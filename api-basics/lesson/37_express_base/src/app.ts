import helmet from "helmet";
import rateLimit from "express-rate-limit";
import express, { Request, Response, NextFunction } from "express";
import { authRouter } from "./auth/auth.routes";
import { usersRouter } from "./routes/users.routes";
import type { HttpError } from "./auth/auth.service";

export function buildApp() {
  const app = express();

  app.use(express.json());

  app.use(helmet());

  const limiter = rateLimit({
    windowMs: 60 * 1000,
    limit: 60,
  });

  app.use(limiter);

  app.use("/auth", authRouter);
  app.use("/users", usersRouter);

  app.use((_req: Request, res: Response) => {
    res.status(404).json({
      error: {
        code: "NOT_FOUND",
        message: "Route not found",
      },
    });
  });

  app.use((err: unknown, _req: Request, res: Response, _next: NextFunction) => {
    const e = err as Partial<HttpError>;

    if (typeof e.status === "number" && typeof e.code === "string") {
      res.status(e.status).json({
        error: {
          code: e.code,
          message: e.message ?? "Error",
        },
      });
      return;
    }

    console.error(err);

    res.status(500).json({
      error: {
        code: "INTERNAL_ERROR",
        message: "Unexpected error",
      },
    });
  });

  return app;
}