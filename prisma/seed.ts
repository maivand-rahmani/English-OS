import "dotenv/config";

import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";

import { seedCuratedContent } from "./seeds/curated-content";

const connectionString =
  process.env.DIRECT_URL ??
  process.env.DATABASE_URL ??
  "postgresql://postgres:postgres@localhost:5432/english_os?schema=public";

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString, max: 1, idleTimeoutMillis: 60000 }),
});

async function main() {
  await seedCuratedContent(prisma);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error: unknown) => {
    console.error("Failed to seed curated content.", error);
    await prisma.$disconnect();
    process.exit(1);
  });
