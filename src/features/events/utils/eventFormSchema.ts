import { z } from "zod";
import { nativeDate } from "@/utils/nativeDate";
import {
  getChoiceConfigurationIssues,
  normalizeChoiceOptions,
} from "./questionAnswers";

export const supportedTranslationSchema = z.object({
  fi: z.string(),
  en: z.string(),
});

export const eventTranslationFieldsSchema = z.object({
  title: z.string(),
  badgeText: z.string().max(30, "Enintään 30 merkkiä"),
  description: z.string(),
  verificationEmail: z.string(),
});

export const eventTranslationsSchema = z
  .object({
    fi: eventTranslationFieldsSchema.extend({ title: z.string().min(1) }),
    en: eventTranslationFieldsSchema,
  })
  .superRefine((translations, ctx) => {
    const englishHasContent = Object.values(translations.en).some(
      (value) => value.trim() !== "",
    );
    if (englishHasContent && translations.en.title.trim() === "") {
      ctx.addIssue({
        code: "custom",
        path: ["en", "title"],
        message: "Add an English title when providing English content",
      });
    }
  });

export const AnswerSchema = z.object({
  answer: z.string(),
  questionId: z.string(),
  signupId: z.string(),
});

export const signupSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  quotaId: z.number(),
  answers: z.array(AnswerSchema),
});

export const quotaSchema = z.object({
  id: z.string(),
  translations: z.object({
    fi: z.string().min(1),
    en: z.string(),
  }),
  size: z.number().int().min(0).nullable(),
  sharedPlacesAllocation: z.enum([
    "NEVER",
    "IMMEDIATE",
    "AFTER_REGISTRATION_CLOSE",
  ]),
  sortId: z.number().positive(),
  eventId: z.union([z.number(), z.nan()]),
});

export const questionOptionSchema = z.object({
  id: z.string(),
  sortId: z.number().positive(),
  translations: supportedTranslationSchema,
});

export const questionSchema = z
  .object({
    id: z.string(),
    translations: z.object({
      fi: z.string().min(1),
      en: z.string(),
    }),
    type: z.enum(["text", "textarea", "radio", "checkbox"]),
    options: z.array(questionOptionSchema),
    sortId: z.number().positive(),
    required: z.boolean(),
    public: z.boolean(),
    eventId: z.union([z.number(), z.nan()]),
  })
  .superRefine((question, ctx) => {
    if (question.type !== "radio" && question.type !== "checkbox") return;

    for (const locale of ["fi", "en"] as const) {
      const labels = question.options.map(
        (option) => option.translations[locale],
      );
      const hasAnyTranslation = labels.some((label) => label.trim() !== "");
      if (locale === "en" && !hasAnyTranslation) continue;

      getChoiceConfigurationIssues(labels).forEach((issue) => {
        ctx.addIssue({
          code: "custom",
          path: [
            "options",
            ...(issue.index === undefined ? [] : [issue.index]),
            "translations",
            locale,
          ],
          message: issue.message,
        });
      });
    }
  });

export function normalizeQuestionOptions<
  T extends {
    type: string;
    options: Array<{
      translations: { fi: string; en: string };
    }>;
  },
>(question: T): T {
  return {
    ...question,
    options:
      question.type === "radio" || question.type === "checkbox"
        ? question.options.map((option) => ({
            ...option,
            translations: {
              fi: normalizeChoiceOptions([option.translations.fi])[0] ?? "",
              en: normalizeChoiceOptions([option.translations.en])[0] ?? "",
            },
          }))
        : [],
  };
}

export const eventFormSchema = z.object({
  translations: eventTranslationsSchema,
  badgeTone: z.enum(["GREEN", "PINK", "DARK"]).default("GREEN"),
  date: nativeDate.form.schema,
  registrationStartDate: nativeDate.form.schema,
  registrationEndDate: nativeDate.form.schema,
  time: z.string().regex(/^\d{2}:\d{2}$/, "Time must be in HH:MM format"),
  registrationStartTime: z
    .string()
    .regex(/^\d{2}:\d{2}$/, "Time must be in HH:MM format"),
  registrationEndTime: z
    .string()
    .regex(/^\d{2}:\d{2}$/, "Time must be in HH:MM format"),
  location: z.string().optional(),
  price: z.string().optional(),
  webpageUrl: z.string().optional(),
  draft: z.boolean(),
  signupsPublic: z.boolean(),
  extraCapacity: z.number().int().min(0),
  Quotas: z.array(quotaSchema).min(1),
  Questions: z.array(questionSchema),
});
