import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";

import { serverEnv } from "@/shared/config/env";

const globalForPrisma = globalThis as typeof globalThis & {
  prisma?: PrismaClient;
};

// Use DIRECT_URL (port 5432, no pgbouncer) for the runtime client so that deep
// nested queries — like the roadmap template fetch on the dashboard — don't
// time out on the Supabase transaction pooler (port 6543). Migrations keep
// using DIRECT_URL via prisma.config.ts.
const connectionString = serverEnv.DIRECT_URL ?? serverEnv.DATABASE_URL;

export const prisma = connectionString
  ? globalForPrisma.prisma ??
    new PrismaClient({
      adapter: new PrismaPg({
        connectionString,
      }),
    })
  : null;

if (process.env.NODE_ENV !== "production" && prisma) {
  globalForPrisma.prisma = prisma;
}