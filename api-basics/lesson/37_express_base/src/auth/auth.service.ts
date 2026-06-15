import * as bcrypt from "bcryptjs";
import * as jwt from "jsonwebtoken";
import { config } from "../lib/config";
import { findByEmail } from "../users/users.repo";
import type { SignOptions } from "jsonwebtoken";

export type JwtPayload = {
  sub: number;
  role: "user" | "admin";
};

export class HttpError extends Error {
  status: number;
  code: string;

  constructor(status: number, code: string, message: string) {
    super(message);
    this.status = status;
    this.code = code;
  }
}

export async function login(email: string, password: string) {
  const user = await findByEmail(email);

  if (!user) {
    throw new HttpError(401, "AUTH_FAILED", "Invalid email or password");
  }

  const ok = await bcrypt.compare(password, user.passwordHash);

  if (!ok) {
    throw new HttpError(401, "AUTH_FAILED", "Invalid email or password");
  }

  const role = user.role === "admin" ? "admin" : "user";

  const payload: JwtPayload = { sub: user.id, role };

  const token = jwt.sign(payload, config.jwtSecret, {
    expiresIn: config.jwtExpiresIn as SignOptions["expiresIn"],
  });

  return {
    token,
    user: { id: user.id, name: user.name, email: user.email, role },
  };
}