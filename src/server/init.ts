import {prisma} from "@/server/external/prisma"
import { checkRaffles } from "../scripts/raffle-worker";
import cron from "node-cron";

let initialized = false;

export function initializeServer() {
  if (initialized) return;
  initialized = true;

  // Set up the raffle worker cron job
  const job = cron.schedule("* * * * *", async () => {
    try {
      await checkRaffles(prisma);
      console.log("Checking raffles at", new Date().toISOString());
    } catch (error) {
      console.error("Cron job error:", error);
    }
  });

  // Handle cleanup
  process.on('SIGTERM', () => {
    job.stop();
    prisma.$disconnect();
  });
} 