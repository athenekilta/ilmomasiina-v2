import { PrismaClient, RaffleStatus } from "@/generated/prisma/client";
import { faker } from "@faker-js/faker";
import dotenv from "dotenv";

dotenv.config();

const prisma = new PrismaClient();

// Configuration
const CONFIG = {
  numTestUsers: 20,
  adminEmail: process.env.ADMIN_EMAIL,
  eventId: 7, // Optional - if not provided, will create new event
  event: {
    title: "Test Raffle Event",
    date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
    registrationStartDate: new Date(),
    registrationEndDate: new Date(Date.now() + 6 * 24 * 60 * 60 * 1000),
    description: "Test event for raffle functionality",
    openQuotaSize: 10,
  },
  quota: {
    title: "Test Quota",
    size: 10,
  },
  raffleStatus: RaffleStatus.NOT_STARTED,
};

async function setupRaffleTest() {
  try {
    console.log("🎲 Starting raffle test setup...");

    // Verify admin user exists
    const adminUser = await prisma.user.findUnique({
      where: { email: CONFIG.adminEmail },
    });

    if (!adminUser) {
      throw new Error(`Admin user ${CONFIG.adminEmail} not found`);
    }

    // Get or create event
    let event = CONFIG.eventId
      ? await prisma.event.findUnique({
        where: { id: CONFIG.eventId },
        include: { Quotas: true },
      })
      : null;

    if (event) {
      console.log(`📅 Updating existing event: ${event.title}`);
      
      // Delete all existing signups and their answers for all quotas
      for (const quota of event.Quotas) {
        // First delete all answers associated with signups
        await prisma.answer.deleteMany({
          where: {
            Signup: {
              quotaId: quota.id
            }
          }
        });
        
        // Then delete the signups
        await prisma.signup.deleteMany({
          where: { quotaId: quota.id },
        });
      }

      // Update event details
      event = await prisma.event.update({
        where: { id: event.id },
        data: {
          ...CONFIG.event,
          raffleEnabled: true,
          raffleStartTime: null,
          raffleEndTime: null,
          raffleStatus: CONFIG.raffleStatus,
        },
        include: { Quotas: true },
      });
    } else {
      console.log("📅 Creating new event...");
      event = await prisma.event.create({
        data: {
          ...CONFIG.event,
          raffleEnabled: true,
          draft: false,
          Quotas: {
            create: {
              ...CONFIG.quota,
              sortId: 1,
            },
          },
        },
        include: { Quotas: true },
      });
    }

    const quota = event.Quotas[0];
    if (!quota) {
      throw new Error("No quota found for event");
    }

    console.log(`📅 Event: ${event.title} (ID: ${event.id})`);
    console.log(`📊 Quota: ${quota.title} (ID: ${quota.id})`);

    // Set raffle times
    const now = new Date();
    const startTime = new Date(now.getTime() + 70000); // Start in 1 minute
    const endTime = new Date(startTime.getTime() + 30000); // 30 second window

    // Update event with raffle times
    await prisma.event.update({
      where: { id: event.id },
      data: {
        raffleStartTime: startTime,
        raffleEndTime: endTime,
      },
    });

    console.log(`\n⏰ Raffle will start at: ${startTime.toLocaleTimeString()}`);
    console.log(`⏰ Raffle will end at: ${endTime.toLocaleTimeString()}`);

    // Generate test signups
    console.log("\n👥 Creating test participants...");
    await Promise.all(
      Array.from({ length: CONFIG.numTestUsers }).map(async (_, index) => {
        // Random delay between 0-15 seconds after start
        const registrationDelay = Math.random() * 15000;
        const registrationTime = new Date(
          startTime.getTime() + registrationDelay,
        );

        const signup = await prisma.signup.create({
          data: {
            quotaId: quota.id,
            originalQuotaId: quota.id,
            name: faker.person.fullName(),
            email: faker.internet.email(),
            registrationIntent: registrationTime,
            status: "PENDING",
          },
        });

        console.log(`   Created signup #${index + 1}: ${signup.name}`);
        return signup;
      }),
    );

    console.log(`   Added admin user: ${adminUser.name}`);
    console.log("\n📝 Test participants created!");
    console.log("\n📋 Test setup complete!");
    
    await prisma.$disconnect();
    process.exit(0);
  } catch (error) {
    console.error("Error during setup:", error);
    await prisma.$disconnect();
    process.exit(1);
  }
}

setupRaffleTest();
