import { cleanupEventImages } from "./features/eventImages/lifecycle";
import { prisma } from "@/server/external/prisma";

import { cleanupUserSessions } from "./features/userSession/service";

import {
  cleanupExpiredInProgressSignups,
  finalizeClosedEventAllocations,
} from "./features/allocations/reconcileEventAllocations";

export async function runScheduledTasks() {
  try {
    await Promise.all([

      cleanupEventImages(prisma),
      cleanupExpiredInProgressSignups(prisma),
      finalizeClosedEventAllocations(prisma),
      cleanupUserSessions(),
    ]);
    console.log("Checked scheduled tasks at", new Date().toISOString());
  } catch (error) {
    console.error("Scheduled task error:", error);
  }
}
