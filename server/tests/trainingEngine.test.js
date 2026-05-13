import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { buildDashboard, calculateAccuracyScore, classifyThreshold, evaluateAttempt } from "../services/trainingEngine.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

function readJson(relativePath) {
  return JSON.parse(readFileSync(join(__dirname, relativePath), "utf8"));
}

const scenarios = readJson("../data/scenarios.json");
const learners = readJson("../data/learners.json");
const sessions = readJson("../data/sessions.json");

const dashboard = buildDashboard(scenarios, learners, sessions);

assert.equal(dashboard.metrics.scenarioCount, scenarios.length, "Dashboard should include all training scenarios.");
assert.ok(dashboard.metrics.coachingNeeded >= 1, "Dashboard should flag learners needing coaching.");

const supportScenario = scenarios.find((scenario) => scenario.id === "support-resolution");
assert.equal(classifyThreshold(supportScenario, 9), "Healthy", "Target should classify correctly.");

assert.ok(calculateAccuracyScore(9.2, 9) >= 95, "Close estimate should score high.");

const result = evaluateAttempt(supportScenario, {
  learnerName: "Demo Learner",
  estimate: 9.5,
  selectedDecision: supportScenario.correctDecision
});

assert.ok(result.scores.readinessScore >= 85, "Strong attempt should produce high readiness.");

console.log("MetricForge training engine tests passed.");