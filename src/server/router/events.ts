import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { changeEventImage } from "../features/eventImages/lifecycle";
import { router } from "../trpc/trpc";
import { publicProcedure } from "../trpc/procedures/publicProcedure";
import { eventEditorProcedure } from "../trpc/procedures/eventEditorProcedure";
import {
  eventTranslationsSchema,
  normalizeQuestionOptions,
  quotaSchema,
  questionSchema,
} from "@/features/events/utils/eventFormSchema";
import { QUEUE_QUOTA_ID } from "@/features/events/utils/queueQuota";
import { SignupStatus, type Prisma } from "@/generated/prisma/client";
import { localeSchema, type Locale } from "@/i18n/config";
import {
  localizedTranslation,
  localizedValue,
  translationRecord,
} from "../features/localization/content";
import { reconcileEventAllocations } from "../features/allocations/reconcileEventAllocations";
import { sendQueueAcceptedEmails } from "../features/allocations/sendQueueAcceptedEmails";

const eventMutationSchema = z.object({
  imageId: z.uuid().nullable().optional(),
  translations: eventTranslationsSchema,
  badgeTone: z.enum(["GREEN", "PINK", "DARK"]).optional(),
  date: z.date(),
  registrationStartDate: z.date(),
  registrationEndDate: z.date(),
  location: z.string().optional(),
  price: z.string().optional(),
  webpageUrl: z.string().optional(),
  draft: z.boolean(),
  signupsPublic: z.boolean(),
  extraCapacity: z.number().int().min(0),
  quotas: z.array(quotaSchema),
  questions: z.array(questionSchema),
});

type Tx = Prisma.TransactionClient;
type EventTranslationsInput = z.infer<typeof eventTranslationsSchema>;
type QuotaInput = z.infer<typeof quotaSchema>;
type QuestionInput = z.infer<typeof questionSchema>;

function hasValues(values: Record<string, string>) {
  return Object.values(values).some((value) => value.trim() !== "");
}

function eventTranslationRows(translations: EventTranslationsInput) {
  const rows = [
    {
      locale: "fi",
      title: translations.fi.title,
      badgeText: translations.fi.badgeText.trim() || null,
      description: translations.fi.description || null,
      verificationEmail: translations.fi.verificationEmail || null,
    },
  ];
  if (hasValues(translations.en)) {
    rows.push({
      locale: "en",
      title: translations.en.title,
      badgeText: translations.en.badgeText.trim() || null,
      description: translations.en.description || null,
      verificationEmail: translations.en.verificationEmail || null,
    });
  }
  return rows;
}

function simpleTranslationRows(
  translations: Record<Locale, string>,
  key: string,
) {
  return (["fi", "en"] as const)
    .filter((locale) => locale === "fi" || translations[locale].trim() !== "")
    .map((locale) => ({ locale, [key]: translations[locale] }));
}

async function syncEventTranslations(
  tx: Tx,
  eventId: number,
  translations: EventTranslationsInput,
) {
  const rows = eventTranslationRows(translations);
  await tx.eventTranslation.deleteMany({
    where: { eventId, locale: { notIn: rows.map((row) => row.locale) } },
  });
  for (const row of rows) {
    await tx.eventTranslation.upsert({
      where: { eventId_locale: { eventId, locale: row.locale } },
      update: row,
      create: { eventId, ...row },
    });
  }
}

async function syncQuotaTranslations(
  tx: Tx,
  quotaId: string,
  translations: QuotaInput["translations"],
) {
  const rows = simpleTranslationRows(translations, "title") as Array<{
    locale: Locale;
    title: string;
  }>;
  await tx.quotaTranslation.deleteMany({
    where: { quotaId, locale: { notIn: rows.map((row) => row.locale) } },
  });
  for (const row of rows) {
    await tx.quotaTranslation.upsert({
      where: { quotaId_locale: { quotaId, locale: row.locale } },
      update: { title: row.title },
      create: { quotaId, ...row },
    });
  }
}

async function syncQuestionTranslations(
  tx: Tx,
  questionId: string,
  translations: QuestionInput["translations"],
) {
  const rows = simpleTranslationRows(translations, "question") as Array<{
    locale: Locale;
    question: string;
  }>;
  await tx.questionTranslation.deleteMany({
    where: { questionId, locale: { notIn: rows.map((row) => row.locale) } },
  });
  for (const row of rows) {
    await tx.questionTranslation.upsert({
      where: { questionId_locale: { questionId, locale: row.locale } },
      update: { question: row.question },
      create: { questionId, ...row },
    });
  }
}

async function syncOptionTranslations(
  tx: Tx,
  optionId: string,
  translations: QuestionInput["options"][number]["translations"],
) {
  const rows = simpleTranslationRows(translations, "label") as Array<{
    locale: Locale;
    label: string;
  }>;
  await tx.questionOptionTranslation.deleteMany({
    where: { optionId, locale: { notIn: rows.map((row) => row.locale) } },
  });
  for (const row of rows) {
    await tx.questionOptionTranslation.upsert({
      where: { optionId_locale: { optionId, locale: row.locale } },
      update: { label: row.label },
      create: { optionId, ...row },
    });
  }
}

async function createQuota(tx: Tx, eventId: number, quota: QuotaInput) {
  await tx.quota.create({
    data: {
      id: quota.id,
      eventId,
      size: quota.size,
      sharedPlacesAllocation: quota.sharedPlacesAllocation,
      sortId: quota.sortId,
      Translations: {
        create: (
          simpleTranslationRows(quota.translations, "title") as Array<{
            locale: Locale;
            title: string;
          }>
        ).map(({ locale, title }) => ({ locale, title })),
      },
    },
  });
}

async function createQuestion(
  tx: Tx,
  eventId: number,
  question: QuestionInput,
) {
  await tx.question.create({
    data: {
      id: question.id,
      eventId,
      type: question.type,
      sortId: question.sortId,
      required: question.required,
      public: question.public,
      Translations: {
        create: (
          simpleTranslationRows(question.translations, "question") as Array<{
            locale: Locale;
            question: string;
          }>
        ).map(({ locale, question }) => ({ locale, question })),
      },
      Options: {
        create: question.options.map((option) => ({
          id: option.id,
          sortId: option.sortId,
          Translations: {
            create: (
              simpleTranslationRows(option.translations, "label") as Array<{
                locale: Locale;
                label: string;
              }>
            ).map(({ locale, label }) => ({ locale, label })),
          },
        })),
      },
    },
  });
}

async function syncQuestionOptions(
  tx: Tx,
  questionId: string,
  options: QuestionInput["options"],
) {
  const existing = await tx.questionOption.findMany({
    where: { questionId },
    select: { id: true },
  });
  const inputIds = new Set(options.map((option) => option.id));
  await tx.questionOption.deleteMany({
    where: {
      questionId,
      id: {
        in: existing
          .filter((option) => !inputIds.has(option.id))
          .map((option) => option.id),
      },
    },
  });

  const existingIds = new Set(existing.map((option) => option.id));
  const retained = options.filter((option) => existingIds.has(option.id));
  for (const [index, option] of retained.entries()) {
    await tx.questionOption.update({
      where: { id: option.id },
      data: { sortId: -(index + 1) },
    });
  }

  for (const option of options) {
    if (existingIds.has(option.id)) {
      await tx.questionOption.update({
        where: { id: option.id },
        data: { sortId: option.sortId },
      });
      await syncOptionTranslations(tx, option.id, option.translations);
    } else {
      await tx.questionOption.create({
        data: {
          id: option.id,
          questionId,
          sortId: option.sortId,
          Translations: {
            create: (
              simpleTranslationRows(option.translations, "label") as Array<{
                locale: Locale;
                label: string;
              }>
            ).map(({ locale, label }) => ({ locale, label })),
          },
        },
      });
    }
  }
}

function localizeQuota<
  T extends { Translations: Array<{ locale: string; title: string }> },
>(quota: T, locale: Locale) {
  const { Translations, ...data } = quota;
  return {
    ...data,
    title: localizedValue(Translations, locale, (row) => row.title),
  };
}

function localizeQuestion<
  T extends {
    Translations: Array<{ locale: string; question: string }>;
    Options: Array<{
      id: string;
      sortId: number;
      Translations: Array<{ locale: string; label: string }>;
    }>;
  },
>(question: T, locale: Locale) {
  const { Translations, Options, ...data } = question;
  return {
    ...data,
    question: localizedValue(Translations, locale, (row) => row.question),
    options: Options.map((option) => ({
      id: option.id,
      sortId: option.sortId,
      label: localizedValue(option.Translations, locale, (row) => row.label),
    })),
  };
}

function localizeEvent<
  T extends {
    translations: Array<{
      locale: string;
      title: string;
      badgeText: string | null;
      description: string | null;
      verificationEmail: string | null;
    }>;
  },
>(event: T, locale: Locale) {
  const { translations, ...data } = event;
  const selected = localizedTranslation(translations, locale);
  return {
    ...data,
    title: selected?.title ?? "",
    badgeText: selected?.badgeText ?? null,
    description: selected?.description ?? null,
    verificationEmail: selected?.verificationEmail ?? null,
  };
}

function answerValue(answer: {
  textValue: string | null;
  Selections: Array<{ optionId: string; Option: { sortId: number } }>;
}) {
  return (
    answer.textValue ??
    [...answer.Selections]
      .sort((a, b) => a.Option.sortId - b.Option.sortId)
      .map((selection) => selection.optionId)
      .join("\n")
  );
}

export const eventsRouter = router({
  getEvents: publicProcedure
    .input(z.object({ locale: localeSchema }))
    .query(async ({ ctx, input }) => {
      const events = await ctx.prisma.event.findMany({
        orderBy: { date: "asc" },
        where: {
          draft: false,
          date: {
            gte: new Date(new Date().setDate(new Date().getDate() - 7)),
          },
        },
        include: {
          translations: true,
          Quotas: {
            include: { Translations: true, Signups: true },
          },
        },
      });

      return events.map((event) =>
        localizeEvent(
          {
            ...event,
            Quotas: event.Quotas.map((quota) => ({
              ...localizeQuota(quota, input.locale),
              signupCount: quota.Signups.length,
            })),
          },
          input.locale,
        ),
      );
    }),

  getEventsAdmin: eventEditorProcedure
    .input(
      z.object({
        locale: localeSchema,
        includeDrafts: z.boolean().optional().default(false),
        includeOlderEvents: z.boolean().optional().default(false),
      }),
    )
    .query(async ({ ctx, input }) => {
      const events = await ctx.prisma.event.findMany({
        orderBy: { date: "asc" },
        where: {
          draft: input.includeDrafts ? {} : false,
          date: input.includeOlderEvents
            ? {}
            : { gte: new Date(new Date().setDate(new Date().getDate() - 7)) },
        },
        include: {
          translations: true,
          Quotas: { include: { Translations: true, Signups: true } },
        },
      });
      return events.map((event) =>
        localizeEvent(
          {
            ...event,
            Quotas: event.Quotas.map((quota) => ({
              ...localizeQuota(quota, input.locale),
              signupCount: quota.Signups.length,
            })),
          },
          input.locale,
        ),
      );
    }),

  getEventEditId: eventEditorProcedure
    .input(z.object({ eventId: z.number() }))
    .query(async ({ ctx, input }) => {
      const event = await ctx.prisma.event.findUnique({
        where: { id: input.eventId },
        include: {
          translations: true,
          Quotas: {
            orderBy: [{ sortId: "asc" }, { id: "asc" }],
            include: { Translations: true },
          },
          Questions: {
            orderBy: [{ sortId: "asc" }, { id: "asc" }],
            include: {
              Translations: true,
              Options: {
                orderBy: [{ sortId: "asc" }, { id: "asc" }],
                include: { Translations: true },
              },
            },
          },
        },
      });
      if (!event) return null;
      const { translations, ...data } = event;
      return {
        ...data,
        translations: {
          fi: {
            title: translationRecord(translations, (row) => row.title).fi,
            badgeText: translationRecord(translations, (row) => row.badgeText)
              .fi,
            description: translationRecord(
              translations,
              (row) => row.description,
            ).fi,
            verificationEmail: translationRecord(
              translations,
              (row) => row.verificationEmail,
            ).fi,
          },
          en: {
            title: translationRecord(translations, (row) => row.title).en,
            badgeText: translationRecord(translations, (row) => row.badgeText)
              .en,
            description: translationRecord(
              translations,
              (row) => row.description,
            ).en,
            verificationEmail: translationRecord(
              translations,
              (row) => row.verificationEmail,
            ).en,
          },
        },
        Quotas: event.Quotas.map(({ Translations, ...quota }) => ({
          ...quota,
          translations: translationRecord(Translations, (row) => row.title),
        })),
        Questions: event.Questions.map(
          ({ Translations, Options, ...question }) => ({
            ...question,
            translations: translationRecord(
              Translations,
              (row) => row.question,
            ),
            options: Options.map(
              ({ Translations: optionTranslations, ...option }) => ({
                ...option,
                translations: translationRecord(
                  optionTranslations,
                  (row) => row.label,
                ),
              }),
            ),
          }),
        ),
      };
    }),

  getEventByID: publicProcedure
    .input(z.object({ eventId: z.number(), locale: localeSchema }))
    .query(async ({ ctx, input }) => {
      const allocation = await ctx.prisma.$transaction((tx) =>
        reconcileEventAllocations(tx, input.eventId),
      );
      await sendQueueAcceptedEmails(allocation.queueAcceptedNotification);
      const event = await ctx.prisma.event.findUnique({
        where: { id: input.eventId },
        include: {
          translations: true,
          Quotas: {
            include: {
              Translations: true,
              Signups: { orderBy: { createdAt: "asc" } },
            },
          },
          Questions: {
            include: {
              Translations: true,
              Options: {
                orderBy: [{ sortId: "asc" }, { id: "asc" }],
                include: { Translations: true },
              },
              Answers: {
                include: {
                  Selections: {
                    include: { Option: { select: { sortId: true } } },
                  },
                },
              },
            },
          },
        },
      });
      if (!event) throw new Error("Event not found");

      const quotas = event.Quotas.map((quota) =>
        localizeQuota(quota, input.locale),
      );
      const seatHoldingSignupCounts = new Map(
        quotas.map((quota) => [
          quota.id,
          quota.Signups.filter(
            (signup) =>
              signup.status === SignupStatus.CONFIRMED ||
              signup.status === SignupStatus.IN_PROGRESS,
          ).length,
        ]),
      );
      const waitlistedSignupCounts = new Map(
        quotas.map((quota) => [
          quota.id,
          quota.Signups.filter(
            (signup) => signup.status === SignupStatus.WAITLISTED,
          ).length,
        ]),
      );

      // Signups waiting for allocation are represented in a presentation-only
      // queue. In-progress signups stay in their quota because they hold a seat.
      const queueQuota = {
        id: QUEUE_QUOTA_ID,
        title: input.locale === "fi" ? "Jono" : "Queue",
        sortId: Number.MAX_SAFE_INTEGER,
        eventId: event.id,
        Signups: [] as (typeof quotas)[number]["Signups"],
        size: null,
        sharedPlacesAllocation: "NEVER" as const,
      };
      for (const quota of quotas) {
        const queued = quota.Signups.filter(
          (signup) =>
            signup.status === SignupStatus.PENDING ||
            signup.status === SignupStatus.WAITLISTED,
        );
        queueQuota.Signups.push(...queued);
        quota.Signups = quota.Signups.filter(
          (signup) => !queued.some((item) => item.id === signup.id),
        );
      }
      const allQuotas = [...quotas, queueQuota];
      const completedSignupIds = new Set(
        allQuotas.flatMap((quota) =>
          quota.Signups.filter((signup) => signup.completedAt !== null).map(
            (signup) => signup.id,
          ),
        ),
      );
      const localized = localizeEvent(event, input.locale);
      const eventWithPublicSignups = {
        ...localized,
        Quotas: allQuotas.map((quota) => ({
          ...quota,
          signupCount: quota.Signups.length,
          seatHoldingSignupCount: seatHoldingSignupCounts.get(quota.id) ?? 0,
          waitlistedSignupCount: waitlistedSignupCounts.get(quota.id) ?? 0,
          Signups: quota.Signups.map((signup) =>
            signup.completedAt !== null
              ? {
                  id: signup.id,
                  name: signup.name,
                  completedAt: signup.completedAt,
                  createdAt: signup.createdAt,
                  originalQuotaId: signup.originalQuotaId,
                }
              : {
                  id: null,
                  name: null,
                  completedAt: null,
                  createdAt: signup.createdAt,
                  originalQuotaId: signup.originalQuotaId,
                },
          ),
        })),
        Questions: event.Questions.map((question) => ({
          ...localizeQuestion(question, input.locale),
          Answers: question.public
            ? question.Answers.filter((answer) =>
                completedSignupIds.has(answer.signupId),
              ).map((answer) => ({
                signupId: answer.signupId,
                answer: answerValue(answer),
              }))
            : [],
        })),
      };

      if (event.signupsPublic) return eventWithPublicSignups;
      return {
        ...eventWithPublicSignups,
        Quotas: eventWithPublicSignups.Quotas.map((quota) => ({
          ...quota,
          Signups: [],
        })),
        Questions: eventWithPublicSignups.Questions.map((question) => ({
          ...question,
          Answers: [],
        })),
      };
    }),

  createEvent: eventEditorProcedure
    .input(eventMutationSchema.extend({ creationRequestId: z.uuid() }))
    .mutation(async ({ ctx, input }) => {
      const questions = input.questions.map(normalizeQuestionOptions);
      const openQuotaSize =
        input.quotas.find((quota) => quota.id.includes("public-quota"))?.size ??
        0;
      return ctx.prisma.$transaction(async (tx) => {
        await tx.$executeRaw`SELECT pg_advisory_xact_lock(7301, hashtext(${input.creationRequestId}))`;
        const existing = await tx.event.findUnique({
          where: { creationRequestId: input.creationRequestId },
        });
        if (existing) return existing;
        await changeEventImage(tx, {
          currentId: null,
          expectedImageId: null,
          imageId: input.imageId,
          uploaderId: ctx.managementUser.id,
        });
        const event = await tx.event.create({
          data: {
            creationRequestId: input.creationRequestId,
            imageId: input.imageId,
            badgeTone: input.badgeTone ?? "GREEN",
            date: input.date,
            registrationStartDate: input.registrationStartDate,
            registrationEndDate: input.registrationEndDate,
            location: input.location,
            price: input.price,
            webpageUrl: input.webpageUrl,
            draft: input.draft,
            signupsPublic: input.signupsPublic,
            openQuotaSize,
            extraCapacity: input.extraCapacity,
            translations: { create: eventTranslationRows(input.translations) },
          },
        });
        for (const quota of input.quotas) {
          await createQuota(tx, event.id, {
            ...quota,
            id: quota.id.includes("public-quota")
              ? `public-quota-${event.id}`
              : quota.id,
          });
        }
        for (const question of questions) {
          await createQuestion(tx, event.id, question);
        }
        return event;
      });
    }),

  updateEvent: eventEditorProcedure
    .input(
      eventMutationSchema.extend({
        id: z.number(),
        expectedImageId: z.uuid().nullable().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const questions = input.questions.map(normalizeQuestionOptions);
      const { updatedEvent, queueAcceptedNotification } =
        await ctx.prisma.$transaction(async (tx) => {
          await tx.$executeRaw`SELECT pg_advisory_xact_lock(${input.id})`;
          const current = await tx.event.findUnique({
            where: { id: input.id },
          });
          if (!current) throw new TRPCError({ code: "NOT_FOUND" });
          await changeEventImage(tx, {
            currentId: current.imageId,
            imageId: input.imageId,
            expectedImageId: input.expectedImageId,
            uploaderId: ctx.managementUser.id,
          });

          const existingQuotas = await tx.quota.findMany({
            where: { eventId: input.id },
            include: { Signups: true },
          });
          const inputQuotaIds = new Set(input.quotas.map((quota) => quota.id));
          await tx.quota.deleteMany({
            where: {
              id: {
                in: existingQuotas
                  .filter(
                    (quota) =>
                      !inputQuotaIds.has(quota.id) &&
                      quota.Signups.length === 0,
                  )
                  .map((quota) => quota.id),
              },
            },
          });
          const existingQuotaIds = new Set(
            existingQuotas.map((quota) => quota.id),
          );
          for (const quota of input.quotas) {
            if (existingQuotaIds.has(quota.id)) {
              await tx.quota.update({
                where: { id: quota.id },
                data: {
                  size: quota.size,
                  sharedPlacesAllocation: quota.sharedPlacesAllocation,
                  sortId: quota.sortId,
                },
              });
              await syncQuotaTranslations(tx, quota.id, quota.translations);
            } else {
              await createQuota(tx, input.id, quota);
            }
          }

          const existingQuestions = await tx.question.findMany({
            where: { eventId: input.id },
            select: { id: true },
          });
          const inputQuestionIds = new Set(
            questions.map((question) => question.id),
          );
          await tx.question.deleteMany({
            where: {
              eventId: input.id,
              id: {
                in: existingQuestions
                  .filter((question) => !inputQuestionIds.has(question.id))
                  .map((question) => question.id),
              },
            },
          });
          const existingQuestionIds = new Set(
            existingQuestions.map((question) => question.id),
          );
          for (const question of questions) {
            if (existingQuestionIds.has(question.id)) {
              await tx.question.update({
                where: { id: question.id },
                data: {
                  type: question.type,
                  sortId: question.sortId,
                  required: question.required,
                  public: question.public,
                },
              });
              await syncQuestionTranslations(
                tx,
                question.id,
                question.translations,
              );
              await syncQuestionOptions(tx, question.id, question.options);
            } else {
              await createQuestion(tx, input.id, question);
            }
          }

          const openQuotaSize =
            input.quotas.find((quota) => quota.id.includes("public-quota"))
              ?.size ?? 0;
          const event = await tx.event.update({
            where: { id: input.id },
            data: {
              imageId: input.imageId,
              badgeTone: input.badgeTone ?? "GREEN",
              date: input.date,
              registrationStartDate: input.registrationStartDate,
              registrationEndDate: input.registrationEndDate,
              location: input.location,
              price: input.price,
              webpageUrl: input.webpageUrl,
              draft: input.draft,
              signupsPublic: input.signupsPublic,
              openQuotaSize,
              extraCapacity: input.extraCapacity,
            },
          });
          await syncEventTranslations(tx, input.id, input.translations);
          const allocation = await reconcileEventAllocations(tx, input.id);
          return {
            updatedEvent: event,
            queueAcceptedNotification: allocation.queueAcceptedNotification,
          };
        });

      let notificationWarning = false;
      try {
        await sendQueueAcceptedEmails(queueAcceptedNotification);
      } catch (error) {
        notificationWarning = true;
        console.error("Event saved but queue notification failed", {
          eventId: input.id,
          error,
        });
      }
      return { ...updatedEvent, notificationWarning };
    }),
});
