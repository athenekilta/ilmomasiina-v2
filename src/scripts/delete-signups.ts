import { PrismaClient } from "@prisma/client";
import cron from "node-cron";

const prisma = new PrismaClient();

async function deleteUnconfirmedSignups() {
  try {
    const twentyMinutesAgo = new Date(Date.now() - 1000 * 60 * 20);
    await prisma.signup.deleteMany({
      where: {
        confirmedAt: null,
        createdAt: {
          lte: twentyMinutesAgo,
        },
      },
    });
    console.log("Deleted unconfirmed signups older than 20 minutes");
  } catch (error) {
    console.error("Error deleting unconfirmed signups:", error);
  } finally {
    await prisma.$disconnect();
  }
}

cron.schedule("* * * * *", () => {
  deleteUnconfirmedSignups();
});
