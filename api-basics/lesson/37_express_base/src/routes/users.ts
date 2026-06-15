import { Router, Request, Response } from "express";
import { isNonEmptyString, looksLikeEmail } from "../lib/validate";
import { notFoundError, validationError } from "../lib/errors";

export type User = { id: number; name: string; email: string; createdAt: string };

const router = Router();

let nextId = 3;
const users: User[] = [
  { id: 1, name: "Taro", email: "taro@example.com", createdAt: new Date().toISOString() },
  { id: 2, name: "Hanako", email: "hanako@example.com", createdAt: new Date().toISOString() },
];

// GET /users
router.get("/", (_req: Request, res: Response) => {
  res.status(200).json({ items: users, page: 1, limit: 20, total: users.length });
});

// GET /users/:id
router.get("/:id", (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const user = users.find((u) => u.id === id);
  if (!user) return res.status(404).json(notFoundError("user not found"));
  res.status(200).json({ item: user });
});

// POST /users
router.post("/", (req: Request, res: Response) => {
  const { name, email } = req.body ?? {};
  const details: { field: string; reason: string }[] = [];

  if (!isNonEmptyString(name)) details.push({ field: "name", reason: "required" });
  if (!isNonEmptyString(email)) details.push({ field: "email", reason: "required" });
  if (isNonEmptyString(email) && !looksLikeEmail(email)) details.push({ field: "email", reason: "invalid_format" });

  if (details.length) return res.status(400).json(validationError("invalid request", details));

  // email重複チェック（簡易）
  if (users.some((u) => u.email === email)) {
    return res.status(400).json(validationError("email already exists", [{ field: "email", reason: "duplicate" }]));
  }

  const user: User = {
    id: nextId++,
    name: name.trim(),
    email: email.trim(),
    createdAt: new Date().toISOString(),
  };
  users.push(user);
  res.status(201).json({ item: user });
});

// PUT /users/:id
router.put("/:id", (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const user = users.find((u) => u.id === id);
  if (!user) return res.status(404).json(notFoundError("user not found"));

  const { name, email } = req.body ?? {};
  const details: { field: string; reason: string }[] = [];

  if (!isNonEmptyString(name)) details.push({ field: "name", reason: "required" });
  if (!isNonEmptyString(email)) details.push({ field: "email", reason: "required" });
  if (isNonEmptyString(email) && !looksLikeEmail(email)) details.push({ field: "email", reason: "invalid_format" });

  if (details.length) return res.status(400).json(validationError("invalid request", details));
  if (users.some((u) => u.email === email && u.id !== id)) {
    return res.status(400).json(validationError("email already exists", [{ field: "email", reason: "duplicate" }]));
  }

  user.name = name.trim();
  user.email = email.trim();
  res.status(200).json({ item: user });
});

// DELETE /users/:id
router.delete("/:id", (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const idx = users.findIndex((u) => u.id === id);
  if (idx === -1) return res.status(404).json(notFoundError("user not found"));

  users.splice(idx, 1);
  res.status(204).send();
});

export default router;