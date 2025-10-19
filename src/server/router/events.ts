import { z } from "zod";
import { router } from "../trpc/trpc";
import { publicProcedure } from "../trpc/procedures/publicProcedure";
import { adminProcedure } from "../trpc/procedures/adminProcedure";
import {
  quotaSchema,
  questionSchema,
} from "@/features/events/utils/eventFormSchema";
import { RaffleStatus } from "@prisma/client";

export const eventsRouter = router({
  getEvents: publicProcedure.query(async ({ ctx }) => {
    const events = await ctx.prisma.event.findMany({
      orderBy: { date: "asc" },
      where: {
        draft: false,
        date: {
          gte: new Date(new Date().setDate(new Date().getDate() - 7)), // Show events that have passed are at most 7 days old
        },
      },
      include: {
        Quotas: {
          include: {
            Signups: true, // Include signups directly within each quota
          },
        },
      },
    });

    // Enrich events with signup counts per quota
    const enrichedEvents = events.map((event) => ({
      ...event,
      Quotas: event.Quotas.map((quota) => ({
        ...quota,
        signupCount: quota.Signups.length,
      })),
    }));

    return enrichedEvents;
  }),
    
  getEventsAdmin: adminProcedure
    .input(
      z.object({
        includeDrafts: z.boolean().optional().default(false),
        includeOlderEvents: z.boolean().optional().default(false),
      })
    )
    .query(async ({ ctx, input }) => {
      const dateFilter = input.includeOlderEvents 
        ? {} 
        : { 
          gte: new Date(new Date().setDate(new Date().getDate() - 7))
        };
      
      const events = await ctx.prisma.event.findMany({
        orderBy: { date: "asc" },
        where: {
          draft: input.includeDrafts ? {} : false,
          date: dateFilter,
        },
        include: {
          Quotas: {
            include: {
              Signups: true,
            },
          },
        },
      });

      // Enrich events with signup counts per quota
      const enrichedEvents = events.map((event) => ({
        ...event,
        Quotas: event.Quotas.map((quota) => ({
          ...quota,
          signupCount: quota.Signups.length,
        })),
      }));

      return enrichedEvents;
    }),
  getEventEditId: adminProcedure
    .input(
      z.object({
        eventId: z.number(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const event = await ctx.prisma.event.findUnique({
        where: {
          id: input.eventId,
        },
        include: {
          Quotas: true,
          Questions: true,
        },
      });
      return event;
    }),
  getEventByID: publicProcedure
    .input(
      z.object({
        eventId: z.number(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const event = await ctx.prisma.event.findUnique({
        where: {
          id: input.eventId,
        },
        include: {
          Quotas: {
            include: {
              Signups: {
                orderBy: {
                  createdAt: "asc",
                },
              }
            },
          },
          Questions: {
            include: {
              Answers: true,
            },
          },
        },
      });

      if (!event) {
        throw new Error("Event not found");
      }

      // Hide the identities of unconfirmed signups
      event.Quotas.forEach((quota) => {
        quota.Signups = quota.Signups.map((signup) => ({
          ...signup,
          email: signup.confirmedAt ? signup.email : "",
          name: signup.confirmedAt ? signup.name : "Vahvistamatta / Unconfirmed singup",
        }));
      });

      // Create queue quota
      event.Quotas.push({
        id: "queue",
        title: "Queue",
        sortId: Number.MAX_SAFE_INTEGER,
        eventId: event.id,
        Signups: [],
        size: null,
      });

      // If the quotas are full put singups into queue
      event.Quotas.forEach((quota) => {
        if (quota.size && quota.Signups.length >= quota.size) {
          const queueQuota = event.Quotas.find((q) => q.id === "queue");

          if (!queueQuota) {
            throw new Error("Queue quota not found"); // This should never happen
          }
          const quotaSingupsOvertheSize = quota.Signups.slice(quota.size);

          queueQuota.Signups.push(...quotaSingupsOvertheSize);
          quota.Signups = quota.Signups.slice(0, quota.size);
        }
      });

      // Return event if singups are not public
      if (event.signupsPublic) return event;

      // If signups are not public, return event with quotas that have signup counts

      const filteredEvent = {
        ...event,
        Quotas: event.Quotas.map((quota) => ({
          ...quota,
          signupCount: quota.Signups.length,
        })),
        Questions: event.Questions.map((question) => ({
          ...question,
          Answers: question.Answers.map((answer) => ({
            ...answer,
            answer: null,
          })),
        })),
      };

      return filteredEvent;
    }),
  createEvent: adminProcedure
    .input(
      z.object({
        title: z.string(),
        date: z.date(),
        registrationStartDate: z.date(),
        registrationEndDate: z.date(),
        description: z.string().optional(),
        location: z.string().optional(),
        price: z.string().optional(),
        webpageUrl: z.string().optional(),
        draft: z.boolean(),
        signupsPublic: z.boolean(),
        verificationEmail: z.string().optional(),
        quotas: z.array(quotaSchema),
        questions: z.array(questionSchema),
        raffle: z.boolean().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const event = await ctx.prisma.event.create({
        data: {
          title: input.title,
          date: input.date,
          registrationStartDate: input.registrationStartDate,
          registrationEndDate: input.registrationEndDate,
          description: input.description,
          location: input.location,
          price: input.price,
          webpageUrl: input.webpageUrl,
          draft: input.draft,
          signupsPublic: input.signupsPublic,
          verificationEmail: input.verificationEmail,
          raffleEnabled: input.raffle,
        },
      });

      const quotas = input.quotas.map((quota) => ({
        ...quota,
        eventId: event.id,
      }));

      const questions = input.questions.map((question) => ({
        ...question,
        eventId: event.id,
      }));

      await ctx.prisma.quota.createMany({
        data: quotas,
      });

      await ctx.prisma.question.createMany({
        data: questions,
      });
      return event;
    }),

  updateEvent: adminProcedure
    .input(
      z.object({
        id: z.number(),
        title: z.string(),
        date: z.date(),
        registrationStartDate: z.date(),
        registrationEndDate: z.date(),
        description: z.string().optional(),
        location: z.string().optional(),
        price: z.string().optional(),
        webpageUrl: z.string().optional(),
        draft: z.boolean(),
        signupsPublic: z.boolean(),
        verificationEmail: z.string().optional(),
        quotas: z.array(quotaSchema),
        questions: z.array(questionSchema),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      // First delete existing quotas and questions
      await ctx.prisma.quota.deleteMany({
        where: { eventId: input.id },
      });

      await ctx.prisma.question.deleteMany({
        where: { eventId: input.id },
      });

      // Then update event with new data
      return ctx.prisma.event.update({
        where: {
          id: input.id,
        },
        data: {
          title: input.title,
          date: input.date,
          registrationStartDate: input.registrationStartDate,
          registrationEndDate: input.registrationEndDate,
          description: input.description,
          location: input.location,
          price: input.price,
          webpageUrl: input.webpageUrl,
          draft: input.draft,
          signupsPublic: input.signupsPublic,
          verificationEmail: input.verificationEmail,
          Quotas: {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            create: input.quotas.map(({ eventId, ...quota }) => quota),
          },
          Questions: {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            create: input.questions.map(({ eventId, ...question }) => question),
          },
        },
      });
    }),
  startRaffle: adminProcedure
    .input(
      z.object({
        eventId: z.number(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const now = new Date();
      const startTime = new Date(now.getTime() + 10000); // Start in 10 seconds
      const endTime = new Date(startTime.getTime() + 30000); // 30 second window

      // Update event with raffle times
      await ctx.prisma.event.update({
        where: { id: input.eventId },
        data: {
          raffleEnabled: true,
          raffleStartTime: startTime,
          raffleEndTime: endTime,
          raffleStatus: RaffleStatus.NOT_STARTED
        },
      });

      // The raffle worker will pick this up and start it at the right time
      return {
        startTime,
        endTime,
      };
    }),
});
