import { PrismaClient } from "@prisma/client";

/**
 * Create and reuse a single `PrismaClient` instance across the app.
 * In development, caches the client on `globalThis` to avoid multiple instances during HMR.
 */
const prismaGlobal = (globalThis as unknown as { prisma?: PrismaClient }).prisma;

/**
 * Returns the shared `PrismaClient` instance.
 */
export const db: PrismaClient =
  prismaGlobal ??
  new PrismaClient({
    log: ["error", "warn"],
  });

if (process.env.NODE_ENV !== "production") {
  (globalThis as unknown as { prisma?: PrismaClient }).prisma = db;
}
