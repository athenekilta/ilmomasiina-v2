import { prisma } from "@/server/external/prisma";
import { checkRaffles } from "../scripts/raffle-worker";

import {
  cleanupExpiredInProgressSignups,
  finalizeClosedEventAllocations,
} from "./features/allocations/reconcileEventAllocations";

export async function runScheduledTasks() {
  try {
    await Promise.all([
      checkRaffles(prisma),
      cleanupExpiredInProgressSignups(prisma),
      finalizeClosedEventAllocations(prisma),
    ]);
    console.log("Checked scheduled tasks at", new Date().toISOString());
  } catch (error) {
    console.error("Scheduled task error:", error);
  }
}
