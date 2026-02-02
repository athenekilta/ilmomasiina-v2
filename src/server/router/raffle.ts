import { router } from "../trpc/trpc";
import { publicProcedure } from "../trpc/procedures/publicProcedure";
import { z } from "zod";
import { generateRaffleSeed } from "@/utils/raffleUtils";
import { pusher } from "../external/pusher";
import type { RaffleResult } from '@/types/raffle';
import { RaffleStatus } from "@/generated/prisma/client";

export const raffleRouter = router({
  getRaffleStatus: publicProcedure
    .input(z.object({
      eventId: z.number(),
      quotaId: z.string()
    }))
    .query(async ({ ctx, input }) => {
      const event = await ctx.prisma.event.findUnique({
        where: { id: input.eventId },
        select: {
          raffleEnabled: true,
          raffleStartTime: true,
          raffleEndTime: true,
          raffleStatus: true,
          Quotas: {
            where: { id: input.quotaId },
            select: {
              Signups: {
                where: { registrationIntent: { not: null } },
                select: {
                  id: true,
                  name: true,
                  email: true,
                  registrationIntent: true
                }
              }
            }
          }
        }
      });

      if (!event?.raffleEnabled || !event.Quotas?.[0]?.Signups) {
        return { phase: RaffleStatus.NOT_STARTED };
      }

      const signups = event.Quotas[0].Signups;
      
      if (signups.length > 0) {
        const seed = generateRaffleSeed(signups);
        return {
          phase: event.raffleStatus,
          seed,
          participants: signups.map(s => ({ id: s.id, name: s.name, email: s.email }))
        };
      }

      return { phase: event.raffleStatus };
    }),

  registerForRaffle: publicProcedure
    .input(z.object({
      eventId: z.number(),
      quotaId: z.string(),
      name: z.string(),
      email: z.string()
    }))
    .mutation(async ({ ctx, input }) => {
      const signup = await ctx.prisma.signup.create({
        data: {
          quotaId: input.quotaId,
          name: input.name,
          email: input.email,
          registrationIntent: new Date(),
          status: "PENDING"
        }
      });

      // Trigger status update via Pusher
      await pusher.trigger(`raffle-${input.eventId}`, 'status-update', {});

      return signup;
    }),

  getRaffleResults: publicProcedure
    .input(z.object({
      eventId: z.number(),
      quotaId: z.string()
    }))
    .query(async ({ ctx, input }): Promise<RaffleResult[]> => {
      const signups = await ctx.prisma.signup.findMany({
        where: {
          quotaId: input.quotaId,
          status: { in: ['CONFIRMED', 'REJECTED'] }
        },
        select: {
          id: true,
          name: true,
          status: true
        },
        orderBy: {
          createdAt: 'asc'
        }
      });

      return signups.map(signup => ({
        id: signup.id,
        name: signup.name,
        status: signup.status as 'CONFIRMED' | 'REJECTED' // Safe because of the where clause
      }));
    }),
});