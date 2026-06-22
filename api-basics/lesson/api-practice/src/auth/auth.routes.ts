import { Router } from "express";
import * as service from "./auth.service";

export const authRouter = Router();

authRouter.post("/login", async (req, res, next) => {
  try {
    const body = (req.body ?? {}) as { email?: string; password?: string };
    const { email, password } = body;

    if (!email || !password) {
      res.status(400).json({ error: { code: "VALIDATION_ERROR", message: "email and password are required" } });
      return;
    }

    const result = await service.login(email, password);
    res.status(200).json(result);
  } catch (e) {
    next(e);
  }
});