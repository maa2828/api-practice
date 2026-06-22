import bcrypt from "bcryptjs";
import { createUser, findByEmail } from "./users.repo";

export async function seedUsers() {
  const exists = await findByEmail("alice@example.com");

  if (exists) return;

  const passwordHash = await bcrypt.hash("passw0rd", 10);

  await createUser({
    name: "Alice",
    email: "alice@example.com",
    passwordHash,
    role: "user",
  });

  await createUser({
    name: "Admin",
    email: "admin@example.com",
    passwordHash,
    role: "admin",
  });
}