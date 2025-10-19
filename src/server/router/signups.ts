import { z } from "zod";
import { router } from "../trpc/trpc";
import { RegistrationDate } from "@/features/events/utils/utils";
import { publicProcedure } from "../trpc/procedures/publicProcedure";
import { TRPCError } from "@trpc/server";
import { SignupStatus } from "@prisma/client";

export const signupsRouter = router({
  getSignupByEventIds: publicProcedure
    .input(
      z.object({
        eventId: z.number(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const eventWithQuotas = await ctx.prisma.event.findFirst({
        where: {
          id: input.eventId,
        },
        include: {
          Quotas: true,
        },
      });

      if (!eventWithQuotas) return;

      const quotaIds = eventWithQuotas.Quotas.map((quota) => quota.id);

      const signups = await ctx.prisma.signup.findMany({
        where: {
          quotaId: {
            in: quotaIds,
          },
        },
        orderBy: {
          createdAt: "asc",
        },
      });
      return signups;
    }),
  getSignupByID: publicProcedure
    .input(
      z.object({
        signupId: z.string(),
        eventId: z.number(),
      }),
    )
    .query(async ({ ctx, input }) => {
      // TODO: Make sure it's your own signup
      // Make sure singups are public

      const event = await ctx.prisma.event.findUnique({
        where: {
          id: input.eventId,
        },
      });

      if (!event) {
        throw new Error("Event not found");
      }

      const signup = await ctx.prisma.signup.findUnique({
        where: {
          id: input.signupId,
        },
        include: {
          Quota: true,
        },
      });

      if (!signup) {
        throw new Error("Signup not found");
      }

      const questions = await ctx.prisma.question.findMany({
        where: {
          eventId: input.eventId,
        },
      });

      const answers = await ctx.prisma.answer.findMany({
        where: {
          signupId: input.signupId,
        },
      });

      const indexOfSignupInQuota = await ctx.prisma.signup.count({
        where: {
          quotaId: signup.quotaId,
          createdAt: {
            lt: signup.createdAt,
          },
        },
      });

      
      return {
        ...signup,
        answers,
        questions,
        event,
        indexOfSignupInQuota,
      };
    }),
  createSignup: publicProcedure
    .input(
      z.object({
        quotaId: z.string(),
        name: z.string(),
        email: z.string().email(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      // Make sure event registration is open
      const quota = await ctx.prisma.quota.findUnique({
        where: {
          id: input.quotaId,
        },
        include: {
          Event: true,
        },
      });

      if (!quota) {
        throw new Error("Quota not found");
      }

      if (quota.Event.draft) {
        throw new Error("Event is a draft");
      }

      const { isRegistrationOpen } = RegistrationDate(quota.Event);
      if (!isRegistrationOpen) {
        throw new Error("Registration is closed");
      }

      // check if email is already signed up for this event
      const existingSignup = await ctx.prisma.signup.findFirst({
        where: {
          Quota: {
            eventId: quota.eventId,
          },
          email: input.email,
        },
      });

      if (existingSignup) {
        // return the existing event instead of creating a new one
        if (existingSignup.status === SignupStatus.PENDING) return {signup: existingSignup, isExistingSignup: true};
        throw new TRPCError({code: 'BAD_REQUEST', message: "A registration exists with this email. Edit your existing signup via the confirmation email."});
      }

      const signup = await ctx.prisma.signup.create({
        data: {
          quotaId: input.quotaId,
          name: input.name,
          email: input.email,
        },
      });
      return {signup: signup};
    }),

  updateSignup: publicProcedure
    .input(
      z.object({
        signupId: z.string(),
        name: z.string(),
        email: z.string(),
        answers: z.array(
          z.object({
            questionId: z.string(),
            answer: z.string(),
          }),
        ),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      // First get the current signup to check if it was already confirmed
      const currentSignup = await ctx.prisma.signup.findUnique({
        where: { id: input.signupId }
      });

      if (!currentSignup) {
        throw new Error("Signup not found");
      }

      const wasConfirmedBefore = currentSignup.confirmedAt !== null;

      // Update answers
      for (const answer of input.answers) {
        await ctx.prisma.answer.upsert({
          where: {
            signup_and_question: {
              questionId: answer.questionId,
              signupId: input.signupId,
            },
          },
          update: {
            answer: answer.answer,
          },
          create: {
            questionId: answer.questionId,
            signupId: input.signupId,
            answer: answer.answer,
          },
        });
      }

      // Update signup
      const signup = await ctx.prisma.signup.update({
        where: {
          id: input.signupId,
        },
        data: {
          name: input.name,
          email: input.email,
          confirmedAt: new Date(),
          status: SignupStatus.CONFIRMED,
        },
        include: {
          Quota: {
            include: {
              Event: true
            }
          }
        }
      });

      // Only send confirmation email if this is the first time being confirmed
      if (!wasConfirmedBefore) {
        const baseUrl = process.env.NEXTAUTH_URL ?? "http://localhost:3000";
        const nextAuthUrl = baseUrl.endsWith("/") ? baseUrl : `${baseUrl}/`;
        const editUrl = `${nextAuthUrl}events/${signup.Quota.eventId}/${signup.id}`;

        await (await ctx.mail.templates.eventSignup({
          eventName: signup.Quota.Event.title,
          editUrl
        })).send({
          to: { displayName: signup.name, address: signup.email },
          from: "DoNotReply@athene.fi",
        });
      }

      return signup;
    }),

  deleteSignup: publicProcedure
    .input(
      z.object({
        signupId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      // First get the signup and event details
      const signup = await ctx.prisma.signup.findUnique({
        where: { id: input.signupId },
        include: {
          Quota: {
            include: {
              Event: true,
              Signups: {
                orderBy: {
                  createdAt: 'asc'
                }
              }
            }
          }
        }
      });

      if (!signup) {
        throw new Error("Signup not found");
      }

      // Delete answers first
      await ctx.prisma.answer.deleteMany({
        where: {
          signupId: input.signupId,
        },
      });

      // Delete the signup
      await ctx.prisma.signup.delete({
        where: {
          id: input.signupId,
        },
      });

      // Helper function to move a person and send notification
      const movePersonAndNotify = async (person: { id: string, name: string, email: string }) => {
        await ctx.prisma.signup.update({
          where: { id: person.id },
          data: { quotaId: signup.quotaId }
        });

        const baseUrl = process.env.NEXTAUTH_URL ?? "http://localhost:3000";
        const nextAuthUrl = baseUrl.endsWith("/") ? baseUrl : `${baseUrl}/`;
        const editUrl = `${nextAuthUrl}events/${signup.Quota.Event.id}/${person.id}`;

        await (await ctx.mail.templates.eventQueueAccepted({
          eventName: signup.Quota.Event.title,
          editUrl
        })).send({
          to: { displayName: person.name, address: person.email },
          from: "DoNotReply@athene.fi",
        });
      };

      // 1. First check if there are people in the same quota's queue
      const quotaSignups = await ctx.prisma.signup.findMany({
        where: {
          quotaId: signup.quotaId,
          status: "PENDING",  // Assuming we use status to indicate queue position
        },
        orderBy: {
          createdAt: 'asc'
        },
        take: 1
      });

      if (quotaSignups[0]) {
        await movePersonAndNotify(quotaSignups[0]);
        return signup;
      }

      // 2. Then check if there are people in the open quota
      const openQuota = await ctx.prisma.quota.findFirst({
        where: {
          eventId: signup.Quota.Event.id,
          title: "Open", // Assuming open quota has title "Open"
        },
        include: {
          Signups: {
            where: {
              status: "PENDING"
            },
            orderBy: {
              createdAt: 'asc'
            },
            take: 1
          }
        }
      });

      if (openQuota?.Signups[0]) {
        await movePersonAndNotify(openQuota.Signups[0]);
        return signup;
      }

      // 3. Finally check the general queue
      const queueQuota = await ctx.prisma.quota.findFirst({
        where: {
          eventId: signup.Quota.Event.id,
          id: 'queue'
        },
        include: {
          Signups: {
            orderBy: {
              createdAt: 'asc'
            },
            take: 1
          }
        }
      });

      if (queueQuota?.Signups[0]) {
        await movePersonAndNotify(queueQuota.Signups[0]);
      }

      return signup;
    }),

  deleteUnconfirmedSignups: publicProcedure.mutation(async ({ ctx }) => {
    await ctx.prisma.signup.deleteMany({
      where: {
        confirmedAt: null,
        createdAt: {
          lte: new Date(new Date().getTime() - 1000 * 60 * 1), // Older than 20 minutes
        },
      },
    });
  }),
  // server/router/signups.ts
  // Add to existing signupsRouter:

  createRaffleSignup: publicProcedure
    .input(
      z.object({
        eventId: z.number(),
        quotaId: z.string(),
        name: z.string(),
        email: z.string().email(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      // Verify raffle is active
      const event = await ctx.prisma.event.findUnique({
        where: { id: input.eventId },
        select: {
          raffleEnabled: true,
          raffleStartTime: true,
          raffleEndTime: true,
        },
      });

      if (
        !event?.raffleEnabled ||
        !event.raffleStartTime ||
        !event.raffleEndTime
      ) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Raffle is not active for this event",
        });
      }

      const now = new Date();
      if (now < event.raffleStartTime || now > event.raffleEndTime) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Registration window is not open",
        });
      }

      // Check for existing registration
      const existing = await ctx.prisma.signup.findFirst({
        where: {
          Quota: {
            eventId: input.eventId,
          },
          email: input.email,
        },
      });

      if (existing) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "You have already registered for this event",
        });
      }

      // Create the signup
      const signup = await ctx.prisma.signup.create({
        data: {
          quotaId: input.quotaId,
          name: input.name,
          email: input.email,
          registrationIntent: now,
          status: "PENDING",
        },
      });

      return signup;
    }),
});
