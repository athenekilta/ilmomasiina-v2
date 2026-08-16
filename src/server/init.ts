import { prisma } from "@/server/external/prisma";
import { checkRaffles } from "../scripts/raffle-worker";
import cron from "node-cron";
import {
  cleanupExpiredInProgressSignups,
  finalizeClosedEventAllocations,
} from "./features/allocations/reconcileEventAllocations";

let initialized = false;

export function initializeServer() {
  if (initialized) return;
  initialized = true;

  // Set up the raffle worker cron job
  const job = cron.schedule("* * * * *", async () => {
    try {
      await Promise.all([
        checkRaffles(prisma),
        cleanupExpiredInProgressSignups(prisma),
        finalizeClosedEventAllocations(prisma),
      ]);
      console.log(
        "Checking scheduled allocations at",
        new Date().toISOString(),
      );
    } catch (error) {
      console.error("Cron job error:", error);
    }
  });

  // Handle cleanup
  process.on("SIGTERM", () => {
    job.stop();
    prisma.$disconnect();
  });
}
