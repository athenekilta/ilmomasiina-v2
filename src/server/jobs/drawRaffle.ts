import type { PrismaClient} from "@prisma/client";
import { RaffleStatus } from "@prisma/client";
import { addMilliseconds } from "date-fns";
import Pusher from "pusher";

import { simulateRaffle } from "../features/raffle/simulateRaffle";
import { generateRaffleSeed } from "../../utils/raffleUtils";
import { emailTemplates } from "../../features/emailTemplates/emailTemplates";

// Initialize Pusher with environment variables directly
const pusher = new Pusher({
  appId: process.env.PUSHER_APP_ID!,
  key: process.env.PUSHER_KEY!,
  secret: process.env.PUSHER_SECRET!,
  cluster: process.env.PUSHER_CLUSTER!,
  useTLS: true,
});

// Helper to update status and trigger Pusher event
async function updateRaffleStatus(prisma: PrismaClient, eventId: number, status: RaffleStatus) {
  await prisma.event.update({
    where: { id: eventId },
    data: { raffleStatus: status },
  });
  await pusher.trigger(`raffle-${eventId}`, "status-update", {});
}

export async function drawRaffle(prisma: PrismaClient, eventId: number) {
  // Get all participants
  const event = await prisma.event.findUnique({
    where: { id: eventId },
    include: {
      Quotas: {
        include: {
          Signups: {
            where: {
              registrationIntent: { not: null }
            }
          },
        },
      },
    },
  });

  if (!event) {
    console.error("Event not found");
    return;
  }

  if (!event.raffleStartTime || !event.raffleEndTime) {
    console.error("Raffle times not set");
    return;
  }

  // Set initial status based on current time
  const now = new Date();
  const startTime = event.raffleStartTime;
  const endTime = event.raffleEndTime;

  console.log("Current time:", now);
  console.log("Start time:", startTime);
  console.log("End time:", endTime);

  // If we're before the start time, wait until start time
  if (now < startTime) {
    const timeToStart = startTime.getTime() - now.getTime();
    console.log(`Waiting ${timeToStart}ms until start time...`);
    await new Promise(resolve => setTimeout(resolve, timeToStart));
  }

  // Set status to REGISTRATION_OPEN
  await updateRaffleStatus(prisma, eventId, RaffleStatus.REGISTRATION_OPEN);
  console.log("Registration open");

  // Wait until end time
  const timeToEnd = endTime.getTime() - Date.now();
  if (timeToEnd > 0) {
    console.log(`Waiting ${timeToEnd}ms until end time...`);
    await new Promise(resolve => setTimeout(resolve, timeToEnd));
  }

  // Set status to SIMULATING
  await updateRaffleStatus(prisma, eventId, RaffleStatus.SIMULATING);
  console.log("Starting simulation");

  // Get final list of participants
  const signups = await prisma.signup.findMany({
    where: {
      quotaId: event.Quotas[0]?.id
    }
  });

  const participants = signups.map(signup => ({
    id: signup.id,
    name: signup.name
  }));

  console.log("Participants:", participants);

  // Generate seed from final participant list
  const seed = generateRaffleSeed(signups);
  console.log("Generated seed:", seed);

  // Calculate canvas width the same way as the animation component
  const canvasWidth = Math.max(1200, participants.length * 80);

  // Run simulation
  const simulation = simulateRaffle(participants, seed, canvasWidth);
  console.log("Simulation complete");

  const ANIMATION_DURATION = 20000; // 20 seconds total
  console.log(`Waiting ${ANIMATION_DURATION}ms for animation...`);
  await new Promise(resolve => setTimeout(resolve, ANIMATION_DURATION));

  // Update signups based on winners
  await Promise.all(
    simulation.finalPositions.map(async (result, position) => {
      const signup = signups.find(s => s.id === result.id);
      if (!signup) return;

      const quota = event.Quotas[0];
      if (!quota) return;

      const isConfirmed = position < (quota.size ?? participants.length);
      const newTime = addMilliseconds(new Date(), position);

      await prisma.signup.update({
        where: { id: signup.id },
        data: {
          status: isConfirmed ? "CONFIRMED" : "REJECTED",
          createdAt: newTime,
          completedAt: newTime
        }
      });

      // Send appropriate email based on status
      const baseUrl = process.env.NEXTAUTH_URL ?? "http://localhost:3000";
      const nextAuthUrl = baseUrl.endsWith("/") ? baseUrl : `${baseUrl}/`;
      const editUrl = `${nextAuthUrl}events/${eventId}/${signup.id}`;

      if (isConfirmed) {
        await (await emailTemplates.eventSignup({
          eventName: event.title,
          editUrl
        })).send({
          to: { displayName: signup.name, address: signup.email },
          from: "DoNotReply@athene.fi",
        });
      } else {
        await (await emailTemplates.eventQueue({
          eventName: event.title,
          editUrl
        })).send({
          to: { displayName: signup.name, address: signup.email },
          from: "DoNotReply@athene.fi",
        });
      }
    })
  );

  // Set status to COMPLETED
  await updateRaffleStatus(prisma, eventId, RaffleStatus.COMPLETED);
  console.log("Raffle completed");
}
