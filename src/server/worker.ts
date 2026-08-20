import { prisma } from "@/server/external/prisma";
import { runScheduledTasks } from "@/server/scheduledTasks";

const INTERVAL_MS = 60_000;
const activeRuns = new Set<Promise<void>>();
let shuttingDown = false;

function scheduleRun() {
  if (shuttingDown) return;

  const run = runScheduledTasks().finally(() => activeRuns.delete(run));
  activeRuns.add(run);
}

scheduleRun();
const interval = setInterval(scheduleRun, INTERVAL_MS);
console.log("Scheduled task worker started");

async function shutdown(signal: NodeJS.Signals) {
  if (shuttingDown) return;
  shuttingDown = true;
  clearInterval(interval);

  console.log(`Received ${signal}; stopping scheduled task worker`);
  await Promise.allSettled(activeRuns);
  await prisma.$disconnect();
}

process.once("SIGINT", () => void shutdown("SIGINT"));
process.once("SIGTERM", () => void shutdown("SIGTERM"));
