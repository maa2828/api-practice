import { Router } from "express";
import { requireAuth } from "../auth/auth.middleware";
import {
  createTask,
  deleteTask,
  findTaskById,
  listTasks,
  updateTask,
} from "../tasks/tasks.repo";

export const tasksRouter = Router();

tasksRouter.get("/", async (req, res, next) => {
  try {
    const q = typeof req.query.q === "string" ? req.query.q : undefined;
    const page = Number(req.query.page ?? 1);
    const limit = Number(req.query.limit ?? 10);

    const result = await listTasks({ q, page, limit });

    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
});

tasksRouter.get("/:id", async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const task = await findTaskById(id);

    if (!task) {
      res.status(404).json({
        error: {
          code: "TASK_NOT_FOUND",
          message: "task not found",
        },
      });
      return;
    }

    res.status(200).json({ item: task });
  } catch (err) {
    next(err);
  }
});

tasksRouter.post("/", requireAuth, async (req, res, next) => {
  try {
    const title = req.body.title;

    if (typeof title !== "string" || title.trim() === "") {
      res.status(400).json({
        error: {
          code: "VALIDATION_ERROR",
          message: "title is required",
        },
      });
      return;
    }

    const task = await createTask({ title: title.trim() });

    res.status(201).json({ item: task });
  } catch (err) {
    next(err);
  }
});

tasksRouter.put("/:id", requireAuth, async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const { title, done } = req.body;

    const input: { title?: string; done?: boolean } = {};

    if (title !== undefined) {
      if (typeof title !== "string" || title.trim() === "") {
        res.status(400).json({
          error: {
            code: "VALIDATION_ERROR",
            message: "title must be non-empty string",
          },
        });
        return;
      }
      input.title = title.trim();
    }

    if (done !== undefined) {
      if (typeof done !== "boolean") {
        res.status(400).json({
          error: {
            code: "VALIDATION_ERROR",
            message: "done must be boolean",
          },
        });
        return;
      }
      input.done = done;
    }

    const task = await updateTask(id, input);

    res.status(200).json({ item: task });
  } catch (err) {
    next(err);
  }
});

tasksRouter.delete("/:id", requireAuth, async (req, res, next) => {
  try {
    const id = Number(req.params.id);

    await deleteTask(id);

    res.status(204).send();
  } catch (err) {
    next(err);
  }
});