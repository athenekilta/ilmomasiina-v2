import PusherClient from "pusher-js";
import { env } from "@/env/client.mjs";

export const pusherClient = new PusherClient(env.NEXT_PUBLIC_PUSHER_KEY, {
  cluster: env.NEXT_PUBLIC_PUSHER_CLUSTER,
});

// Types for events
export type RaffleEvent = {
  eventId: number;
  participantCount: number;
  status: "REGISTRATION_OPEN" | "REGISTRATION_CLOSED" | "DRAWING" | "COMPLETE";
  positions?: Array<{ signupId: string; position: number }>;
};

export const RAFFLE_CHANNEL = "raffle-updates";
