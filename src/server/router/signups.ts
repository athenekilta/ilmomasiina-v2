import { z } from "zod";
import { router } from "../trpc/trpc";
import { RegistrationDate } from "@/features/events/utils/utils";
import { publicProcedure } from "../trpc/procedures/publicProcedure";
import { eventEditorProcedure } from "../trpc/procedures/eventEditorProcedure";
import { TRPCError } from "@trpc/server";
import { SignupStatus } from "@/generated/prisma/client";
import type { Prisma } from "@/generated/prisma/client";
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
import {
  canAccessSignup,
  createSignupEditUrl,
  getUserSession,
  grantCreatedSignup,
  requireUserSignupAccess,
  setUserSessionIdentity,
} from "../features/userSession/service";
import { normalizeEmail } from "../features/userSession/request";

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


function requireRegistrationNotClosed(registrationEndDate: Date) {
  if (registrationEndDate.getTime() <= Date.now()) {
    throw new TRPCError({
      code: "FORBIDDEN",
      message: "Ilmo on päättynyt, eikä ilmoa voi enää muokata.",
    });
  }
}

async function deleteSignupAndReconcile(
  tx: Prisma.TransactionClient,
  signupId: string,
  eventId?: number,
) {
  const signup = await tx.signup.findFirst({
    where: {
      id: signupId,
      ...(eventId === undefined ? {} : { Quota: { eventId } }),
    },
    include: { Quota: { include: { Event: true } } },
  });

  if (!signup) {
    throw new TRPCError({ code: "NOT_FOUND", message: "Signup not found" });
  }

  await tx.answer.deleteMany({ where: { signupId } });
  await tx.signup.delete({ where: { id: signupId } });
  const allocation = await reconcileEventAllocations(tx, signup.Quota.Event.id);

  return { signup, allocation };
}

export const signupsRouter = router({
  getSignupByEventIds: eventEditorProcedure
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
          identity: { select: { email: true } },
        },
      });
      return signups.map(({ identity, ...signup }) => ({
        ...signup,
        email: identity.email,
      }));
    }),
  getMySignupStatus: publicProcedure
    .input(z.object({ eventId: z.number() }))
    .query(async ({ ctx, input }) => {
      const userSession = await getUserSession(ctx.prisma, ctx.userSession);
      if (!userSession?.email) return null;
      const email = userSession.email;

      const signups = await ctx.prisma.signup.findMany({
        where: {
          Quota: { eventId: input.eventId },
          identity: { email: { equals: email, mode: "insensitive" } },
          status: { not: SignupStatus.REJECTED },
        },
        select: {
          id: true,
          completedAt: true,
        },
        orderBy: [{ createdAt: "asc" }, { id: "asc" }],
      });
      const matches = await Promise.all(
        signups.map(async (signup) => ({
          ...signup,
          canEditDirectly: await canAccessSignup(
            ctx.prisma,
            ctx.userSession,
            signup,
          ),
        })),
      );
      const signup =
        matches.find(
          (item) => item.canEditDirectly && item.completedAt !== null,
        ) ??
        matches.find(
          (item) => item.canEditDirectly && item.completedAt === null,
        ) ??
        matches.find((item) => item.completedAt !== null) ??
        matches[0];

      if (!signup) return null;

      return {
        ...(signup.canEditDirectly ? { id: signup.id } : {}),
        state: signup.completedAt === null ? "IN_PROGRESS" : "COMPLETED",
        canEditDirectly: signup.canEditDirectly,
      };
    }),

  sendMySignupAccessEmail: publicProcedure
    .input(z.object({ eventId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const userSession = await getUserSession(ctx.prisma, ctx.userSession);
      const signup = userSession?.email
        ? await ctx.prisma.signup.findFirst({
            where: {
              Quota: { eventId: input.eventId },
              identity: {
                email: { equals: userSession.email, mode: "insensitive" },
              },
              status: { not: SignupStatus.REJECTED },
            },
            include: {
              Quota: { include: { Event: true } },
              identity: { select: { email: true } },
            },
            orderBy: [
              { completedAt: "desc" },
              { createdAt: "asc" },
              { id: "asc" },
            ],
          })
        : null;

      // Deliberately return the same response whether a matching signup exists
      // or its registration has already closed.
      if (!signup || RegistrationDate(signup.Quota.Event).isRegistrationClosed)
        return;

      await (
        await ctx.mail.templates.eventSignupAccess({
          eventName: signup.Quota.Event.title,
          eventDate: signup.Quota.Event.date,
          signupName: signup.name,
          signupEmail: signup.identity.email,
          quotaName: signup.Quota.title,
          editUrl: await createSignupEditUrl(signup.id),
        })
      ).send({
        to: { displayName: signup.name, address: signup.identity.email },
        from: "DoNotReply@athene.fi",
      });
    }),

  getSignupByID: publicProcedure
    .input(
      z.object({
        signupId: z.string(),
        eventId: z.number(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const event = await ctx.prisma.event.findUnique({
        where: {
          id: input.eventId,
        },
      });

      if (!event) {
        throw new Error("Event not found");
      }

      const signup = await ctx.prisma.signup.findFirst({
        where: {
          id: input.signupId,
          Quota: { eventId: input.eventId },
        },
        include: {
          Quota: true,
          identity: { select: { email: true } },
        },
      });

      if (!signup) {
        throw new Error("Signup not found");
      }

      await requireUserSignupAccess(ctx.prisma, ctx.userSession, signup);

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
      const { identity, ...signupData } = signup;
      return {
        ...signupData,
        email: identity.email,
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
        const name = `Demoilmoittautuja ${demoId.slice(-4)}`;
        const email = `${DEMO_SIGNUP_EMAIL_PREFIX}${demoId}@example.invalid`;
        const identity = await tx.identity.upsert({
          where: { email },
          update: {},
          create: { email, name },
        });
        const signup = await tx.signup.create({
          data: {
            quotaId: input.quotaId,
            originalQuotaId: input.quotaId,
            name,
            identityId: identity.id,
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
            identity: { email: { startsWith: DEMO_SIGNUP_EMAIL_PREFIX } },
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
      const normalizedEmail = normalizeEmail(input.email);
      const initialQuota = await ctx.prisma.quota.findUnique({
        where: { id: input.quotaId },
        select: { eventId: true },
      });

      if (!initialQuota) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Quota not found" });
      }

      const accessSession = await setUserSessionIdentity(ctx.userSession, {
        name: input.name,
        email: normalizedEmail,
      });
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
            identity: {
              email: { equals: normalizedEmail, mode: "insensitive" },
            },
          },
          include: { Quota: { select: { title: true } } },
          orderBy: [{ createdAt: "asc" }, { id: "asc" }],
        });
        const existingSignup =
          matchingSignups.find((signup) => signup.completedAt !== null) ??
          matchingSignups[0];

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

        const canAccessExisting = existingSignup
          ? await canAccessSignup(tx, ctx.userSession, existingSignup)
          : false;
        if (existingSignup?.quotaId === quota.id) {
          response =
            canAccessExisting && existingSignup.completedAt === null
              ? { kind: "EXISTING", signupId: existingSignup.id }
              : { kind: "CONFLICT" };
        } else if (existingSignup && !canAccessExisting) {
          response = { kind: "CONFLICT" };
        } else {
          const identity = await tx.identity.upsert({
            where: { email: normalizedEmail },
            update: {},
            create: { email: normalizedEmail, name: input.name },
          });
          const candidate = await tx.signup.create({
            data: {
              quotaId: quota.id,
              originalQuotaId: quota.id,
              name: input.name,
              identityId: identity.id,
              status: SignupStatus.IN_PROGRESS,
            },
          });
          await grantCreatedSignup(tx, accessSession, candidate.id);
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
          include: {
            identity: { select: { email: true } },
            Quota: { include: { Event: true } },
          },
        });
        if (
          !candidate ||
          candidate.completedAt !== null ||
          candidate.status !== SignupStatus.IN_PROGRESS
        ) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Signup choice has expired",
          });
        }

        await requireUserSignupAccess(tx, ctx.userSession, candidate);
        requireRegistrationNotClosed(candidate.Quota.Event.registrationEndDate);

        const otherSignups = await tx.signup.findMany({
          where: {
            id: { not: candidate.id },
            Quota: { eventId },
            identity: {
              email: { equals: candidate.identity.email, mode: "insensitive" },
            },
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
        await requireUserSignupAccess(tx, ctx.userSession, existingSignup);

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
              identity: { select: { email: true } },
            },
          });

          if (!currentSignup) {
            throw new TRPCError({
              code: "NOT_FOUND",
              message: "Signup not found",
            });
          }

          await requireUserSignupAccess(tx, ctx.userSession, currentSignup);
          requireRegistrationNotClosed(
            currentSignup.Quota.Event.registrationEndDate,
          );

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
            include: { identity: { select: { email: true } } },
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
      if (
        currentSignup.status !== SignupStatus.CONFIRMED &&
        newSignup.status === SignupStatus.CONFIRMED
      ) {
        if (wasQueued) return newSignup;
        await (
          await ctx.mail.templates.eventSignup({
            eventName: currentSignup.Quota.Event.title,
            eventDate: currentSignup.Quota.Event.date,
            signupName: newSignup.name,
            signupEmail: newSignup.identity.email,
            quotaName: currentSignup.Quota.title,
            editUrl: await createSignupEditUrl(currentSignup.id),
          })
        ).send({
          to: {
            displayName: newSignup.name,
            address: newSignup.identity.email,
          },
          from: "DoNotReply@athene.fi",
        });
      } else if (!wasCompletedBefore) {
        await (
          await ctx.mail.templates.eventQueue({
            eventName: currentSignup.Quota.Event.title,
            eventDate: currentSignup.Quota.Event.date,
            signupName: newSignup.name,
            signupEmail: newSignup.identity.email,
            quotaName: currentSignup.Quota.title,
            editUrl: await createSignupEditUrl(currentSignup.id),
          })
        ).send({
          to: {
            displayName: newSignup.name,
            address: newSignup.identity.email,
          },
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
      const result = await ctx.prisma.$transaction(async (tx) => {
        const signup = await tx.signup.findUnique({
          where: { id: input.signupId },
          select: {
            id: true,
            Quota: {
              select: { Event: { select: { registrationEndDate: true } } },
            },
          },
        });
        if (!signup) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Signup not found",
          });
        }
        await requireUserSignupAccess(tx, ctx.userSession, signup);
        requireRegistrationNotClosed(signup.Quota.Event.registrationEndDate);
        return deleteSignupAndReconcile(tx, input.signupId);
      });

      await sendQueueAcceptedEmails(
        result.allocation.queueAcceptedNotification,
      );
      return result.signup;
    }),

  deleteSignupAsAdmin: eventEditorProcedure
    .input(
      z.object({
        signupId: z.string(),
        eventId: z.number(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const result = await ctx.prisma.$transaction((tx) =>
        deleteSignupAndReconcile(tx, input.signupId, input.eventId),
      );

      await sendQueueAcceptedEmails(
        result.allocation.queueAcceptedNotification,
      );
      return result.signup;
    }),

  moveSignupToQuota: eventEditorProcedure
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

  exportSignupsCsv: eventEditorProcedure
    .input(
      z.object({
        eventId: z.number(),
      }),
    )
    .query(async ({ ctx, input }) => {
      return createSignupsCsv(ctx.prisma, input.eventId);
    }),
});
