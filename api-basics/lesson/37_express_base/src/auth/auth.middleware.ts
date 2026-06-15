import * as jwt from "jsonwebtoken";
import type { Request, Response, NextFunction } from "express";
import { config } from "../lib/config";
import type { JwtPayload } from "./auth.service";

export type AuthedRequest = Request & {
  user?: JwtPayload;
};

function isJwtPayload(obj: unknown): obj is JwtPayload {
  return (
    typeof obj === "object" &&
    obj !== null &&
    "sub" in obj &&
    "role" in obj
  );
}

export function requireAuth(
  req: AuthedRequest,
  res: Response,
  next: NextFunction
) {
  const auth = req.headers.authorization;

  if (!auth || !auth.startsWith("Bearer ")) {
    return res.status(401).json({
      error: { code: "UNAUTHORIZED", message: "Missing Bearer token" },
    });
  }

  const token = auth.slice("Bearer ".length).trim();

  try {
    const decoded = jwt.verify(token, config.jwtSecret);

    if (!isJwtPayload(decoded)) {
      return res.status(401).json({
        error: { code: "UNAUTHORIZED", message: "Invalid token payload" },
      });
    }

    req.user = decoded;
    next();
  } catch {
    return res.status(401).json({
      error: { code: "UNAUTHORIZED", message: "Invalid token" },
    });
  }
}

export function requireRole(role: "admin" | "user") {
  return (req: AuthedRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      res.status(401).json({ error: { code: "UNAUTHORIZED", message: "Missing auth" } });
      return;
    }
    if (req.user.role !== role) {
      res.status(403).json({ error: { code: "FORBIDDEN", message: "Forbidden" } });
      return;
    }
    next();
  };
}