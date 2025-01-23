"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const node_cron_1 = __importDefault(require("node-cron"));
const drawRaffle_1 = require("../server/jobs/drawRaffle");
const dotenv_1 = __importDefault(require("dotenv"));
// Load environment variables
dotenv_1.default.config();
const prisma = new client_1.PrismaClient();
async function checkRaffles() {
    try {
        const now = new Date();
        // Find events with raffles that need to be started
        const events = await prisma.event.findMany({
            where: {
                raffleEnabled: true,
                raffleStartTime: { lte: now },
                raffleEndTime: { gt: now },
                raffleStatus: client_1.RaffleStatus.NOT_STARTED
            }
        });
        // Start each raffle
        for (const event of events) {
            console.log(`Starting raffle for event ${event.id}`);
            (0, drawRaffle_1.drawRaffle)(prisma, event.id).catch(error => {
                console.error(`Error drawing raffle for event ${event.id}:`, error);
            });
        }
    }
    catch (error) {
        console.error("Error checking raffles:", error);
    }
}
// Check every minute
node_cron_1.default.schedule("* * * * * *", () => {
    checkRaffles();
    console.log("Checking raffles at", new Date().toISOString());
});
// Keep the process alive
process.stdin.resume();
