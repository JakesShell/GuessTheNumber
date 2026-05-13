import assert from "node:assert/strict";
import { permissionMatrix, roleCan } from "../middleware/security.js";

assert.ok(permissionMatrix.Admin.includes("audit:view"), "Admin should be able to view audit logs.");
assert.equal(roleCan("Viewer", "audit:view"), false, "Viewer should not be able to view audit logs.");
assert.equal(roleCan("Learner", "coaching:assign"), false, "Learner should not be able to assign coaching.");
assert.equal(roleCan("Manager", "coaching:assign"), true, "Manager should be able to assign coaching.");
assert.equal(roleCan("Training Lead", "coaching:assign"), true, "Training Lead should be able to assign coaching.");
assert.equal(roleCan("Viewer", "dashboard:view"), true, "Viewer should be able to view the dashboard.");

console.log("MetricForge security permission tests passed.");