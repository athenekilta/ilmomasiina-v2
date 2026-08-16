import { z } from "zod";
import { router } from "../trpc/trpc";
import { RegistrationDate } from "@/features/events/utils/utils";
import { publicProcedure } from "../trpc/procedures/publicProcedure";
import { adminProcedure } from "../trpc/procedures/adminProcedure";
import { TRPCError } from "@trpc/server";
import { SignupStatus } from "@/generated/prisma/client";
import {
  getChoiceConfigurationIssues,
  validateAndCanonicalizeSignupAnswers,
} from "@/features/events/utils/questionAnswers";
import { createSignupsCsv } from "../features/exports/buildSignupsCsv";
import {
  cleanupExpiredInProgressSignups,
  reconcileEventAllocations,
} from "../features/allocations/reconcileEventAllocations";
import { sendQueueAcceptedEmails } from "../features/allocations/sendQueueAcceptedEmails";

const DEMO_SIGNUP_EMAIL_PREFIX = "dev-demo-";

function ensureDevelopment() {
  if (process.env.NODE_ENV !== "development") {
    throw new TRPCError({ code: "NOT_FOUND" });
  }
}

export const signupsRouter = router({
  getSignupByEventIds: adminProcedure
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
        include: {
          Answers: true,
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
  addDemoSignup: publicProcedure
    .input(z.object({ quotaId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      ensureDevelopment();

      return ctx.prisma.$transaction(async (tx) => {
        const quota = await tx.quota.findUnique({
          where: { id: input.quotaId },
          select: { eventId: true },
        });
        if (!quota) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Quota not found",
          });
        }

        const demoId = `${Date.now()}-${Math.random().toString(36).slice(2)}`;
        const signup = await tx.signup.create({
          data: {
            quotaId: input.quotaId,
            originalQuotaId: input.quotaId,
            name: `Demoilmoittautuja ${demoId.slice(-4)}`,
            email: `${DEMO_SIGNUP_EMAIL_PREFIX}${demoId}@example.invalid`,
            completedAt: new Date(),
            status: SignupStatus.IN_PROGRESS,
          },
        });
        await reconcileEventAllocations(tx, quota.eventId);

        return tx.signup.findUniqueOrThrow({ where: { id: signup.id } });
      });
    }),

  removeDemoSignup: publicProcedure
    .input(z.object({ quotaId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      ensureDevelopment();

      const result = await ctx.prisma.$transaction(async (tx) => {
        const quota = await tx.quota.findUnique({
          where: { id: input.quotaId },
          select: { eventId: true },
        });
        if (!quota) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Quota not found",
          });
        }

        const signup = await tx.signup.findFirst({
          where: {
            quotaId: input.quotaId,
            email: { startsWith: DEMO_SIGNUP_EMAIL_PREFIX },
          },
          orderBy: [{ createdAt: "desc" }, { id: "desc" }],
        });
        if (!signup) return null;

        await tx.signup.delete({ where: { id: signup.id } });
        const allocation = await reconcileEventAllocations(tx, quota.eventId);
        return {
          signup,
          queueAcceptedNotification: allocation.queueAcceptedNotification,
        };
      });

      if (!result) return null;
      await sendQueueAcceptedEmails(result.queueAcceptedNotification);
      return result.signup;
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
        if (!existingSignup.completedAt)
          return { signup: existingSignup, isExistingSignup: true };
        throw new TRPCError({
          code: "CONFLICT",
        });
      }

      const signup = await ctx.prisma.$transaction(async (tx) => {
        const created = await tx.signup.create({
          data: {
            quotaId: input.quotaId,
            originalQuotaId: input.quotaId,
            name: input.name,
            email: input.email,
            status: SignupStatus.IN_PROGRESS,
          },
        });
        await reconcileEventAllocations(tx, quota.eventId);
        return tx.signup.findUniqueOrThrow({ where: { id: created.id } });
      });

      return { signup };
    }),

  updateSignup: publicProcedure
    .input(
      z.object({
        signupId: z.string(),
        answers: z.array(
          z.object({
            questionId: z.string(),
            answer: z.string(),
          }),
        ),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { currentSignup, newSignup, queueAcceptedNotification } =
        await ctx.prisma.$transaction(async (tx) => {
          const currentSignup = await tx.signup.findUnique({
            where: { id: input.signupId },
            include: {
              Quota: {
                include: {
                  Event: { include: { Questions: true } },
                },
              },
            },
          });

          if (!currentSignup) {
            throw new TRPCError({
              code: "NOT_FOUND",
              message: "Signup not found",
            });
          }

          const questions = currentSignup.Quota.Event.Questions;
          const hasInvalidChoiceConfiguration = questions.some((question) => {
            if (question.type !== "radio" && question.type !== "checkbox") {
              return false;
            }
            return getChoiceConfigurationIssues(question.options).length > 0;
          });
          if (hasInvalidChoiceConfiguration) {
            throw new TRPCError({
              code: "PRECONDITION_FAILED",
              message:
                "Tapahtuman monivalintakysymys on määritetty virheellisesti",
            });
          }

          const validated = validateAndCanonicalizeSignupAnswers(
            questions,
            input.answers,
          );
          if (!validated.success) {
            throw new TRPCError({
              code: "BAD_REQUEST",
              message: validated.message,
            });
          }

          for (const answer of validated.answers) {
            await tx.answer.upsert({
              where: {
                signup_and_question: {
                  questionId: answer.questionId,
                  signupId: input.signupId,
                },
              },
              update: { answer: answer.answer },
              create: {
                questionId: answer.questionId,
                signupId: input.signupId,
                answer: answer.answer,
              },
            });
          }

          await tx.signup.update({
            where: { id: input.signupId },
            data: { completedAt: new Date() },
          });
          const allocation = await reconcileEventAllocations(
            tx,
            currentSignup.Quota.eventId,
          );
          const newSignup = await tx.signup.findUniqueOrThrow({
            where: { id: input.signupId },
          });

          return {
            currentSignup,
            newSignup,
            queueAcceptedNotification: allocation.queueAcceptedNotification,
          };
        });

      const wasCompletedBefore = currentSignup.completedAt !== null;
      const wasQueued =
        currentSignup.status === SignupStatus.PENDING ||
        currentSignup.status === SignupStatus.WAITLISTED;

      await sendQueueAcceptedEmails(queueAcceptedNotification);

      // Only send confirmation email if this is the first time being confirmed
      const baseUrl = process.env.NEXTAUTH_URL ?? "http://localhost:3000";
      const nextAuthUrl = baseUrl.endsWith("/") ? baseUrl : `${baseUrl}/`;
      const editUrl = `${nextAuthUrl}events/${currentSignup.Quota.eventId}/${currentSignup.id}`;
      if (
        currentSignup.status !== SignupStatus.CONFIRMED &&
        newSignup.status === SignupStatus.CONFIRMED
      ) {
        if (wasQueued) return newSignup;
        await (
          await ctx.mail.templates.eventSignup({
            eventName: currentSignup.Quota.Event.title,
            editUrl,
          })
        ).send({
          to: { displayName: newSignup.name, address: newSignup.email },
          from: "DoNotReply@athene.fi",
        });
      } else if (!wasCompletedBefore) {
        await (
          await ctx.mail.templates.eventQueue({
            eventName: currentSignup.Quota.Event.title,
            editUrl,
          })
        ).send({
          to: { displayName: newSignup.name, address: newSignup.email },
          from: "DoNotReply@athene.fi",
        });
      }

      return newSignup;
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
                  createdAt: "asc",
                },
              },
            },
          },
        },
      });

      if (!signup) {
        throw new Error("Signup not found");
      }

      const allocation = await ctx.prisma.$transaction(async (tx) => {
        await tx.answer.deleteMany({ where: { signupId: input.signupId } });
        await tx.signup.delete({ where: { id: input.signupId } });
        return reconcileEventAllocations(tx, signup.Quota.Event.id);
      });

      await sendQueueAcceptedEmails(allocation.queueAcceptedNotification);
      return signup;
    }),

  moveSignupToQuota: adminProcedure
    .input(
      z.object({
        signupId: z.string(),
        targetQuotaId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const result = await ctx.prisma.$transaction(async (tx) => {
        const signup = await tx.signup.findUnique({
          where: { id: input.signupId },
          include: { Quota: true },
        });
        const targetQuota = await tx.quota.findUnique({
          where: { id: input.targetQuotaId },
        });

        if (!signup || !targetQuota) {
          throw new TRPCError({ code: "NOT_FOUND" });
        }
        if (signup.Quota.eventId !== targetQuota.eventId) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Signup and target quota must belong to the same event",
          });
        }

        await tx.signup.update({
          where: { id: signup.id },
          data: {
            quotaId: targetQuota.id,
            originalQuotaId: targetQuota.id,
          },
        });
        const allocation = await reconcileEventAllocations(
          tx,
          targetQuota.eventId,
        );
        const updatedSignup = await tx.signup.findUniqueOrThrow({
          where: { id: signup.id },
        });
        return {
          updatedSignup,
          queueAcceptedNotification: allocation.queueAcceptedNotification,
        };
      });

      await sendQueueAcceptedEmails(result.queueAcceptedNotification);
      return result.updatedSignup;
    }),

  deleteUnconfirmedSignups: publicProcedure.mutation(async ({ ctx }) => {
    await cleanupExpiredInProgressSignups(ctx.prisma);
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
          originalQuotaId: input.quotaId,
          name: input.name,
          email: input.email,
          registrationIntent: now,
          status: "PENDING",
        },
      });

      return signup;
    }),

  exportSignupsCsv: adminProcedure
    .input(
      z.object({
        eventId: z.number(),
      }),
    )
    .query(async ({ ctx, input }) => {
      return createSignupsCsv(ctx.prisma, input.eventId);
    }),
});
