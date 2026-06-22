import { Router } from "express";
import { requireAuth, requireRole, AuthedRequest } from "../auth/auth.middleware";

export const usersRouter = Router();

usersRouter.get("/me", requireAuth, (req: AuthedRequest, res) => {
  res.status(200).json({ me: req.user });
});

usersRouter.get("/admin/secret", requireAuth, requireRole("admin"), (_req, res) => {
  res.status(200).json({ secret: "admin-only" });
});