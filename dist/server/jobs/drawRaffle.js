"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.drawRaffle = drawRaffle;
const client_1 = require("@prisma/client");
const date_fns_1 = require("date-fns");
const pusher_1 = __importDefault(require("pusher"));
const simulateRaffle_1 = require("../features/raffle/simulateRaffle");
const raffleUtils_1 = require("@/utils/raffleUtils");
const emailTemplates_1 = require("@/features/emailTemplates/emailTemplates");
// Initialize Pusher with environment variables directly
const pusher = new pusher_1.default({
    appId: process.env.PUSHER_APP_ID,
    key: process.env.PUSHER_KEY,
    secret: process.env.PUSHER_SECRET,
    cluster: process.env.PUSHER_CLUSTER,
    useTLS: true,
});
// Helper to update status and trigger Pusher event
async function updateRaffleStatus(prisma, eventId, status) {
    await prisma.event.update({
        where: { id: eventId },
        data: { raffleStatus: status },
    });
    await pusher.trigger(`raffle-${eventId}`, "status-update", {});
}
async function drawRaffle(prisma, eventId) {
    var _a;
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
    await updateRaffleStatus(prisma, eventId, client_1.RaffleStatus.REGISTRATION_OPEN);
    console.log("Registration open");
    // Wait until end time
    const timeToEnd = endTime.getTime() - Date.now();
    if (timeToEnd > 0) {
        console.log(`Waiting ${timeToEnd}ms until end time...`);
        await new Promise(resolve => setTimeout(resolve, timeToEnd));
    }
    // Set status to SIMULATING
    await updateRaffleStatus(prisma, eventId, client_1.RaffleStatus.SIMULATING);
    console.log("Starting simulation");
    // Get final list of participants
    const signups = await prisma.signup.findMany({
        where: {
            quotaId: (_a = event.Quotas[0]) === null || _a === void 0 ? void 0 : _a.id
        }
    });
    const participants = signups.map(signup => ({
        id: signup.id,
        name: signup.name
    }));
    console.log("Participants:", participants);
    // Generate seed from final participant list
    const seed = (0, raffleUtils_1.generateRaffleSeed)(signups);
    console.log("Generated seed:", seed);
    // Calculate canvas width the same way as the animation component
    const canvasWidth = Math.max(1200, participants.length * 80);
    // Run simulation
    const simulation = (0, simulateRaffle_1.simulateRaffle)(participants, seed, canvasWidth);
    console.log("Simulation complete");
    const ANIMATION_DURATION = 20000; // 20 seconds total
    console.log(`Waiting ${ANIMATION_DURATION}ms for animation...`);
    await new Promise(resolve => setTimeout(resolve, ANIMATION_DURATION));
    // Update signups based on winners
    await Promise.all(simulation.finalPositions.map(async (result, position) => {
        var _a, _b;
        const signup = signups.find(s => s.id === result.id);
        if (!signup)
            return;
        const quota = event.Quotas[0];
        if (!quota)
            return;
        const isConfirmed = position < ((_a = quota.size) !== null && _a !== void 0 ? _a : participants.length);
        const newTime = (0, date_fns_1.addMilliseconds)(new Date(), position);
        await prisma.signup.update({
            where: { id: signup.id },
            data: {
                status: isConfirmed ? "CONFIRMED" : "REJECTED",
                createdAt: newTime,
                confirmedAt: newTime
            }
        });
        // Send appropriate email based on status
        const baseUrl = (_b = process.env.NEXTAUTH_URL) !== null && _b !== void 0 ? _b : "http://localhost:3000";
        const nextAuthUrl = baseUrl.endsWith("/") ? baseUrl : `${baseUrl}/`;
        const editUrl = `${nextAuthUrl}events/${eventId}/${signup.id}`;
        if (isConfirmed) {
            await (await emailTemplates_1.emailTemplates.eventSignup({
                eventName: event.title,
                editUrl
            })).send({
                to: { displayName: signup.name, address: signup.email },
                from: "DoNotReply@athene.fi",
            });
        }
        else {
            await (await emailTemplates_1.emailTemplates.eventQueue({
                eventName: event.title,
                editUrl
            })).send({
                to: { displayName: signup.name, address: signup.email },
                from: "DoNotReply@athene.fi",
            });
        }
    }));
    // Set status to COMPLETED
    await updateRaffleStatus(prisma, eventId, client_1.RaffleStatus.COMPLETED);
    console.log("Raffle completed");
}
