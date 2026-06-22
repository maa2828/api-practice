import type { Prisma } from "../generated/prisma/client";
import { prisma } from "../db";

export async function createTask(input: { title: string }) {
  return prisma.task.create({
    data: {
      title: input.title,
    },
  });
}

export async function findTaskById(id: number) {
  return prisma.task.findUnique({
    where: { id },
  });
}

export async function listTasks(params: {
  q?: string;
  page: number;
  limit: number;
}) {
  const { q, page, limit } = params;
  const skip = (page - 1) * limit;

  const where: Prisma.TaskWhereInput = q
    ? {
        title: { contains: q, mode: "insensitive" },
      }
    : {};

  const [items, total] = await Promise.all([
    prisma.task.findMany({
      where,
      skip,
      take: limit,
      orderBy: { id: "asc" },
    }),
    prisma.task.count({ where }),
  ]);

  return { items, total };
}

export async function updateTask(
  id: number,
  input: {
    title?: string;
    done?: boolean;
  }
) {
  return prisma.task.update({
    where: { id },
    data: input,
  });
}

export async function deleteTask(id: number) {
  return prisma.task.delete({
    where: { id },
  });
}