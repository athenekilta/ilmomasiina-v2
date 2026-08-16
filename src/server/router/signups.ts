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

type SignupPlacementItem = {
  id: string;
  quotaId: string;
  status: SignupStatus;
  allocatedAt: Date | null;
};

function getSignupPlacement(signups: SignupPlacementItem[], signupId: string) {
  const signup = signups.find((item) => item.id === signupId);
  if (!signup) throw new Error("Signup not found in quota");

  const isQueued = (item: SignupPlacementItem) =>
    item.status === SignupStatus.PENDING ||
    item.status === SignupStatus.WAITLISTED ||
    (item.status === SignupStatus.IN_PROGRESS && item.allocatedAt === null);
  const signupIsQueued = isQueued(signup);
  const position =
    signups
      .filter(
        (item) =>
          item.quotaId === signup.quotaId && isQueued(item) === signupIsQueued,
      )
      .findIndex((item) => item.id === signup.id) + 1;

  return {
    type: signupIsQueued ? ("QUEUE" as const) : ("QUOTA" as const),
    position,
  };
}

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

      const quotaSignups = await ctx.prisma.signup.findMany({
        where: {
          quotaId: signup.quotaId,
          registrationIntent: null,
          status: { not: SignupStatus.REJECTED },
        },
        select: {
          id: true,
          quotaId: true,
          status: true,
          allocatedAt: true,
        },
        orderBy: [{ createdAt: "asc" }, { id: "asc" }],
      });
      return {
        ...signup,
        answers,
        questions,
        event,
        placement: getSignupPlacement(quotaSignups, signup.id),
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
      const normalizedEmail = input.email.trim().toLowerCase();
      const initialQuota = await ctx.prisma.quota.findUnique({
        where: { id: input.quotaId },
        select: { eventId: true },
      });

      if (!initialQuota) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Quota not found" });
      }

      const result = await ctx.prisma.$transaction(async (tx) => {
        await tx.$executeRaw`SELECT pg_advisory_xact_lock(${initialQuota.eventId})`;

        const quota = await tx.quota.findUnique({
          where: { id: input.quotaId },
          include: { Event: true },
        });
        if (!quota) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Quota not found",
          });
        }
        if (quota.Event.draft) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Event is a draft",
          });
        }

        const { isRegistrationOpen } = RegistrationDate(quota.Event);
        if (!isRegistrationOpen) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Registration is closed",
          });
        }

        const matchingSignups = await tx.signup.findMany({
          where: {
            Quota: { eventId: quota.eventId },
            email: { equals: normalizedEmail, mode: "insensitive" },
          },
          include: { Quota: { select: { title: true } } },
          orderBy: [{ createdAt: "asc" }, { id: "asc" }],
        });
        const existingSignup =
          matchingSignups.find((signup) => signup.completedAt !== null) ??
          matchingSignups[0];

        const staleIncompleteSignupIds = matchingSignups
          .filter(
            (signup) =>
              signup.id !== existingSignup?.id && signup.completedAt === null,
          )
          .map((signup) => signup.id);
        if (staleIncompleteSignupIds.length > 0) {
          await tx.answer.deleteMany({
            where: { signupId: { in: staleIncompleteSignupIds } },
          });
          await tx.signup.deleteMany({
            where: { id: { in: staleIncompleteSignupIds } },
          });
        }

        let response:
          | { kind: "CREATED"; signupId: string }
          | { kind: "EXISTING"; signupId: string }
          | { kind: "CONFLICT" }
          | {
              kind: "CHOICE";
              signupId: string;
              existingSignupId: string;
              existingQuotaId: string;
              existingQuotaTitle: string;
              existingIsCompleted: boolean;
              selectedQuotaTitle: string;
            };

        if (existingSignup?.quotaId === quota.id) {
          response = existingSignup.completedAt
            ? { kind: "CONFLICT" }
            : { kind: "EXISTING", signupId: existingSignup.id };
        } else {
          const candidate = await tx.signup.create({
            data: {
              quotaId: quota.id,
              originalQuotaId: quota.id,
              name: input.name,
              email: normalizedEmail,
              status: SignupStatus.IN_PROGRESS,
            },
          });
          response = existingSignup
            ? {
                kind: "CHOICE",
                signupId: candidate.id,
                existingSignupId: existingSignup.id,
                existingQuotaId: existingSignup.quotaId,
                existingQuotaTitle: existingSignup.Quota.title,
                existingIsCompleted: existingSignup.completedAt !== null,
                selectedQuotaTitle: quota.title,
              }
            : { kind: "CREATED", signupId: candidate.id };
        }

        const allocation = await reconcileEventAllocations(tx, quota.eventId);
        const signup =
          response.kind === "CONFLICT"
            ? null
            : await tx.signup.findUniqueOrThrow({
                where: { id: response.signupId },
              });
        const choicePlacements =
          response.kind === "CHOICE"
            ? await tx.signup
                .findMany({
                  where: {
                    quotaId: {
                      in: [quota.id, response.existingQuotaId],
                    },
                    registrationIntent: null,
                    status: { not: SignupStatus.REJECTED },
                  },
                  select: {
                    id: true,
                    quotaId: true,
                    status: true,
                    allocatedAt: true,
                  },
                  orderBy: [{ createdAt: "asc" }, { id: "asc" }],
                })
                .then((signups) => ({
                  existing: getSignupPlacement(
                    signups,
                    response.existingSignupId,
                  ),
                  selected: getSignupPlacement(signups, response.signupId),
                }))
            : null;

        return {
          response,
          signup,
          choicePlacements,
          queueAcceptedNotification: allocation.queueAcceptedNotification,
        };
      });

      await sendQueueAcceptedEmails(result.queueAcceptedNotification);

      if (result.response.kind === "CONFLICT") {
        throw new TRPCError({ code: "CONFLICT" });
      }
      if (result.response.kind === "EXISTING") {
        return { signup: result.signup!, isExistingSignup: true };
      }
      if (result.response.kind === "CHOICE") {
        return {
          signup: result.signup!,
          requiresSignupChoice: true,
          existingSignup: {
            quotaTitle: result.response.existingQuotaTitle,
            isCompleted: result.response.existingIsCompleted,
            placement: result.choicePlacements!.existing,
          },
          selectedQuotaTitle: result.response.selectedQuotaTitle,
          selectedPlacement: result.choicePlacements!.selected,
        };
      }
      return { signup: result.signup! };
    }),

  resolveSignupConflict: publicProcedure
    .input(
      z.object({
        candidateSignupId: z.string(),
        choice: z.enum(["NEW", "EXISTING"]),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const initialCandidate = await ctx.prisma.signup.findUnique({
        where: { id: input.candidateSignupId },
        select: { Quota: { select: { eventId: true } } },
      });
      if (!initialCandidate) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Signup choice has expired",
        });
      }

      const result = await ctx.prisma.$transaction(async (tx) => {
        const eventId = initialCandidate.Quota.eventId;
        await tx.$executeRaw`SELECT pg_advisory_xact_lock(${eventId})`;

        const candidate = await tx.signup.findUnique({
          where: { id: input.candidateSignupId },
        });
        if (
          !candidate ||
          candidate.completedAt !== null ||
          candidate.status !== SignupStatus.IN_PROGRESS ||
          candidate.registrationIntent !== null
        ) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Signup choice has expired",
          });
        }

        const otherSignups = await tx.signup.findMany({
          where: {
            id: { not: candidate.id },
            Quota: { eventId },
            email: { equals: candidate.email, mode: "insensitive" },
          },
          orderBy: [{ createdAt: "asc" }, { id: "asc" }],
        });
        const existingSignup =
          otherSignups.find((signup) => signup.completedAt !== null) ??
          otherSignups[0];
        if (!existingSignup) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "The existing signup no longer exists",
          });
        }

        const selectedSignupId =
          input.choice === "NEW" ? candidate.id : existingSignup.id;
        const signupIdsToDelete = [candidate, ...otherSignups]
          .filter((signup) => signup.id !== selectedSignupId)
          .map((signup) => signup.id);

        await tx.answer.deleteMany({
          where: { signupId: { in: signupIdsToDelete } },
        });
        await tx.signup.deleteMany({
          where: { id: { in: signupIdsToDelete } },
        });

        const allocation = await reconcileEventAllocations(tx, eventId);
        const signup = await tx.signup.findUniqueOrThrow({
          where: { id: selectedSignupId },
        });

        return {
          signup,
          isExistingSignup: input.choice === "EXISTING",
          canContinue: signup.completedAt === null,
          queueAcceptedNotification: allocation.queueAcceptedNotification,
        };
      });

      await sendQueueAcceptedEmails(result.queueAcceptedNotification);
      return {
        signup: result.signup,
        isExistingSignup: result.isExistingSignup,
        canContinue: result.canContinue,
      };
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
