import crypto from "node:crypto";
import express from "express";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { z } from "zod";
import { auditEvent, getAuditEvents } from "./services/auditLogger.js";
import { buildDashboard, evaluateAttempt } from "./services/trainingEngine.js";
import { configureSecurity, requirePermission } from "./middleware/security.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

function readJson(relativePath) {
  return JSON.parse(readFileSync(join(__dirname, relativePath), "utf8"));
}

const scenarios = readJson("./data/scenarios.json");
const learners = readJson("./data/learners.json");
const sessions = readJson("./data/sessions.json");

const app = express();
const port = Number(process.env.PORT ?? 8080);
const startedAt = new Date().toISOString();

configureSecurity(app);
app.use(express.json({ limit: "250kb" }));

app.use((req, res, next) => {
  req.requestId = req.header("x-request-id") ?? crypto.randomUUID();
  res.setHeader("x-request-id", req.requestId);
  next();
});

app.use((req, res, next) => {
  const started = Date.now();

  res.on("finish", () => {
    console.log(JSON.stringify({
      level: "info",
      service: "metricforge-api",
      requestId: req.requestId,
      method: req.method,
      route: req.originalUrl,
      status: res.statusCode,
      durationMs: Date.now() - started
    }));
  });

  next();
});

app.get("/health", (req, res) => {
  res.json({
    status: "healthy",
    service: "metricforge-api",
    environment: process.env.NODE_ENV ?? "development",
    requestId: req.requestId
  });
});

app.get("/ready", (req, res) => {
  const dataReady = Array.isArray(scenarios) && scenarios.length > 0 && Array.isArray(learners);

  res.status(dataReady ? 200 : 503).json({
    status: dataReady ? "ready" : "not-ready",
    service: "metricforge-api",
    checks: {
      scenariosLoaded: scenarios.length,
      learnersLoaded: learners.length,
      sessionsLoaded: sessions.length
    },
    requestId: req.requestId
  });
});

app.get("/api/status", requirePermission("status:view"), (req, res) => {
  res.json({
    service: "metricforge-api",
    status: "operational",
    startedAt,
    uptimeSeconds: Math.round(process.uptime()),
    environment: process.env.NODE_ENV ?? "development",
    dataMode: "simulated-json",
    cloudReadiness: {
      healthEndpoint: "/health",
      readinessEndpoint: "/ready",
      logs: "cloudwatch-ready-json",
      container: "server/Dockerfile",
      deploymentTarget: "ECS Fargate",
      futureDatabase: "Amazon RDS PostgreSQL"
    },
    requestId: req.requestId
  });
});

app.get("/api/dashboard", requirePermission("dashboard:view"), (req, res) => {
  auditEvent("dashboard.view", {
    role: req.userRole,
    action: "view-dashboard",
    requestId: req.requestId
  });

  res.json(buildDashboard(scenarios, learners, sessions));
});

app.get("/api/scenarios/:id", requirePermission("scenario:view"), (req, res) => {
  const scenario = scenarios.find((item) => item.id === req.params.id);

  if (!scenario) {
    return res.status(404).json({
      error: "Scenario not found",
      requestId: req.requestId
    });
  }

  auditEvent("scenario.view", {
    role: req.userRole,
    scenarioId: scenario.id,
    action: "view-scenario",
    requestId: req.requestId
  });

  res.json(scenario);
});

const attemptSchema = z.object({
  scenarioId: z.string().min(3),
  learnerName: z.string().min(2).max(80),
  estimate: z.coerce.number(),
  selectedDecision: z.string().min(3)
});

app.post("/api/simulations/evaluate", requirePermission("simulation:evaluate"), (req, res) => {
  const parsed = attemptSchema.safeParse(req.body);

  if (!parsed.success) {
    return res.status(400).json({
      error: "Invalid simulation payload",
      details: parsed.error.flatten(),
      requestId: req.requestId
    });
  }

  const scenario = scenarios.find((item) => item.id === parsed.data.scenarioId);

  if (!scenario) {
    return res.status(404).json({
      error: "Scenario not found",
      requestId: req.requestId
    });
  }

  const result = evaluateAttempt(scenario, parsed.data);

  auditEvent("simulation.evaluate", {
    role: req.userRole,
    scenarioId: scenario.id,
    action: "evaluate-kpi-attempt",
    outcome: result.readinessLevel,
    requestId: req.requestId
  });

  res.status(201).json({
    ...result,
    requestId: req.requestId
  });
});

app.post("/api/coaching/assign", requirePermission("coaching:assign"), (req, res) => {
  const coachingSchema = z.object({
    learnerId: z.string().min(3),
    category: z.string().min(3),
    note: z.string().min(10).max(500)
  });

  const parsed = coachingSchema.safeParse(req.body);

  if (!parsed.success) {
    return res.status(400).json({
      error: "Invalid coaching payload",
      details: parsed.error.flatten(),
      requestId: req.requestId
    });
  }

  const event = auditEvent("coaching.assign", {
    role: req.userRole,
    action: "assign-coaching",
    outcome: "recorded",
    requestId: req.requestId
  });

  res.status(201).json({
    message: "Coaching assignment recorded in simulated audit log.",
    assignment: parsed.data,
    audit: event,
    requestId: req.requestId
  });
});

app.get("/api/audit", requirePermission("audit:view"), (req, res) => {
  auditEvent("audit.view", {
    role: req.userRole,
    action: "view-audit-events",
    requestId: req.requestId
  });

  res.json({
    events: getAuditEvents(75),
    requestId: req.requestId
  });
});

app.use((err, req, res, next) => {
  console.error(JSON.stringify({
    level: "error",
    service: "metricforge-api",
    requestId: req.requestId,
    route: req.originalUrl,
    message: err.message
  }));

  res.status(500).json({
    error: "Internal server error",
    message: "A controlled error response was returned. Details are logged server-side.",
    requestId: req.requestId
  });
});

app.listen(port, () => {
  console.log(`MetricForge API running on http://localhost:${port}`);
});