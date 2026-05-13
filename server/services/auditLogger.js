import crypto from "node:crypto";

const auditEvents = [];

export function auditEvent(type, details = {}) {
  const event = {
    id: crypto.randomUUID(),
    timestamp: new Date().toISOString(),
    type,
    actor: details.actor ?? "demo-user",
    role: details.role ?? "Viewer",
    scenarioId: details.scenarioId ?? null,
    action: details.action ?? "view",
    outcome: details.outcome ?? "success",
    requestId: details.requestId ?? null
  };

  auditEvents.unshift(event);

  if (auditEvents.length > 250) {
    auditEvents.pop();
  }

  console.log(JSON.stringify({ level: "info", service: "metricforge-api", audit: event }));
  return event;
}

export function getAuditEvents(limit = 50) {
  return auditEvents.slice(0, limit);
}