import { PrismaClient } from "@prisma/client";
import dotenv from "dotenv";

dotenv.config();

const globalForPrisma = globalThis;

export const prisma =
  globalForPrisma.__noorPrismaClient ||
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["warn", "error"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.__noorPrismaClient = prisma;
}

/**
 * Verifies connectivity to Supabase PostgreSQL without modifying any data.
 */
export async function checkDatabaseConnection() {
  try {
    await prisma.$queryRaw`SELECT 1`;
    return { connected: true };
  } catch (error) {
    return {
      connected: false,
      error:
        process.env.NODE_ENV === "production"
          ? "Database connection unavailable."
          : error.message,
    };
  }
}
