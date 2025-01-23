import { PrismaClient, RaffleStatus } from "@prisma/client";
import { drawRaffle } from "../server/jobs/drawRaffle";
import cron from "node-cron";

export async function checkRaffles(prisma: PrismaClient) {
  try {
    const now = new Date();
    // Get the start of the current minute
    const startOfMinute = new Date(now.getFullYear(), now.getMonth(), now.getDate(), now.getHours(), now.getMinutes(), 0);
    // Get the start of the next minute
    const startOfNextMinute = new Date(startOfMinute.getTime() + 60000);
    
    const events = await prisma.event.findMany({
      where: {
        raffleEnabled: true,
        raffleStartTime: {
          gte: startOfMinute,
          lt: startOfNextMinute,
        },
        raffleStatus: RaffleStatus.NOT_STARTED
      }
    });

    await Promise.all(events.map(async (event) => {
      try {
        if (!event.raffleStartTime) {
          console.error(`Event ${event.id} has no raffle start time`);
          return;
        }
        
        const startTime = new Date(event.raffleStartTime);
        const delay = startTime.getTime() - Date.now();
        
        if (delay > 0) {
          // Wait until the exact start time
          await new Promise(resolve => setTimeout(resolve, delay));
        }
        
        console.log(`Starting raffle for event ${event.id} at exact time ${new Date().toISOString()}`);
        await drawRaffle(prisma, event.id);
      } catch (error) {
        console.error(`Error drawing raffle for event ${event.id}:`, error);
      }
    }));

  } catch (error) {
    console.error("Error checking raffles:", error);
  }
}

// Only run the cron job if this file is being run directly
if (require.main === module) {
  const prisma = new PrismaClient();
  
  const job = cron.schedule("* * * * *", async () => {
    try {
      await checkRaffles(prisma);
      console.log("Checking raffles at", new Date().toISOString());
    } catch (error) {
      console.error("Cron job error:", error);
    }
  });

  process.on('SIGTERM', () => {
    job.stop();
    prisma.$disconnect();
    process.exit(0);
  });

  process.stdin.resume();
}