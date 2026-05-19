import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";

import { serverEnv } from "@/shared/config/env";

const globalForPrisma = globalThis as typeof globalThis & {
  prisma?: PrismaClient;
};

export const prisma = serverEnv.DATABASE_URL
  ? globalForPrisma.prisma ??
    new PrismaClient({
      adapter: new PrismaPg({
        connectionString: serverEnv.DATABASE_URL,
      }),
    })
  : null;

if (process.env.NODE_ENV !== "production" && prisma) {
  globalForPrisma.prisma = prisma;
}