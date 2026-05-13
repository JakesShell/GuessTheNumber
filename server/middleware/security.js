import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";

const allowedOrigin = process.env.CLIENT_ORIGIN ?? "http://localhost:5173";

export const permissionMatrix = {
  Learner: ["dashboard:view", "scenario:view", "simulation:evaluate"],
  Manager: ["dashboard:view", "scenario:view", "simulation:evaluate", "coaching:assign"],
  "Training Lead": ["dashboard:view", "scenario:view", "simulation:evaluate", "coaching:assign"],
  Executive: ["dashboard:view", "scenario:view", "simulation:evaluate", "status:view"],
  Admin: ["dashboard:view", "scenario:view", "simulation:evaluate", "coaching:assign", "audit:view", "status:view"],
  Viewer: ["dashboard:view", "scenario:view", "status:view"]
};

export function configureSecurity(app) {
  app.use(helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" }
  }));

  app.use(cors({
    origin: allowedOrigin,
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type", "x-demo-role", "x-request-id"]
  }));

  app.use(rateLimit({
    windowMs: 60 * 1000,
    limit: 150,
    standardHeaders: true,
    legacyHeaders: false
  }));
}

export function roleCan(role, permission) {
  const normalizedRole = role ?? "Viewer";
  return permissionMatrix[normalizedRole]?.includes(permission) ?? false;
}

export function requirePermission(permission) {
  return (req, res, next) => {
    const role = req.header("x-demo-role") ?? "Viewer";

    if (roleCan(role, permission)) {
      req.userRole = role;
      return next();
    }

    return res.status(403).json({
      error: "Forbidden",
      message: `The ${role} role does not have permission for ${permission}.`,
      requestId: req.requestId
    });
  };
}