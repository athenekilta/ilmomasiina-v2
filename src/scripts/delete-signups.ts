import { PrismaClient } from "@/generated/prisma/client";

const prisma = new PrismaClient();

async function deleteUncompletedSignups() {
  try {
    const twentyMinutesAgo = new Date(Date.now() - 1000 * 60 * 20);
    await prisma.signup.deleteMany({
      where: {
        completedAt: null,
        createdAt: {
          lte: twentyMinutesAgo,
        },
      },
    });
    console.log("Deleted uncompleted signups older than 20 minutes");
  } catch (error) {
    console.error("Error deleting uncompleted signups:", error);
  } finally {
    await prisma.$disconnect();
  }
}

void deleteUncompletedSignups();
