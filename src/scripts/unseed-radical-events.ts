/**
 * Removes only the events inserted by `seed-radical-events.ts` (matched by
 * TEST_EVENT_PREFIX), along with their quotas/signups. Never touches any
 * other data.
 */
import dotenv from "dotenv";

dotenv.config();

import { PrismaClient } from "@/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { TEST_EVENT_PREFIX } from "./radical-events-shared";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

async function unseed() {
  const events = await prisma.event.findMany({
    where: { title: { startsWith: TEST_EVENT_PREFIX } },
    include: { Quotas: true },
  });

  const quotaIds = events.flatMap((event) => event.Quotas.map((q) => q.id));

  const deletedSignups = await prisma.signup.deleteMany({
    where: { quotaId: { in: quotaIds } },
  });
  const deletedQuotas = await prisma.quota.deleteMany({
    where: { id: { in: quotaIds } },
  });
  const deletedEvents = await prisma.event.deleteMany({
    where: { id: { in: events.map((e) => e.id) } },
  });

  console.log(
    `Removed ${deletedEvents.count} events, ${deletedQuotas.count} quotas, ${deletedSignups.count} signups.`,
  );
}

unseed()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
