import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";

import { serverEnv } from "@/shared/config/env";

const globalForPrisma = globalThis as typeof globalThis & {
  prisma?: PrismaClient;
};

const connectionString = serverEnv.DATABASE_URL;

export const prisma = connectionString
  ? globalForPrisma.prisma ??
    new PrismaClient({
      adapter: new PrismaPg({
        connectionString,
        // Supabase's pgbouncer transaction pooler (port 6543) has a per-query
        // timeout of 15s. The dashboard's roadmap template fetch is a deep
        // nested include; on cold connections it can take longer to warm up.
        // Bump the pg client statement timeout to 60s to give complex queries
        // headroom without hitting the pooler's hard kill.
        statement_timeout: 60_000,
        connectionTimeoutMillis: 30_000,
        idle_in_transaction_session_timeout: 60_000,
      }),
    })
  : null;

if (process.env.NODE_ENV !== "production" && prisma) {
  globalForPrisma.prisma = prisma;
}