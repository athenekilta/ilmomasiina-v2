import { z } from "zod";
import { nativeDate } from "@/utils/nativeDate";
import {
  getChoiceConfigurationIssues,
  normalizeChoiceOptions,
} from "./questionAnswers";

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
  title: z.string().min(1),
  size: z.number().int().min(0).nullable(),
  sharedPlacesAllocation: z.enum([
    "NEVER",
    "IMMEDIATE",
    "AFTER_REGISTRATION_CLOSE",
  ]),
  sortId: z.number().positive(),
  eventId: z.union([z.number(), z.nan()]),
});

export const questionSchema = z
  .object({
    id: z.string(),
    question: z.string().min(1),
    type: z.enum(["text", "textarea", "radio", "checkbox"]),
    options: z.array(z.string()),
    sortId: z.number().positive(),
    required: z.boolean(),
    public: z.boolean(),
    eventId: z.union([z.number(), z.nan()]),
  })
  .superRefine((question, ctx) => {
    if (question.type !== "radio" && question.type !== "checkbox") return;

    getChoiceConfigurationIssues(question.options).forEach((issue) => {
      ctx.addIssue({
        code: "custom",
        path: ["options", ...(issue.index === undefined ? [] : [issue.index])],
        message: issue.message,
      });
    });
  });

export function normalizeQuestionOptions<
  T extends { type: string; options: string[] },
>(question: T): T {
  return {
    ...question,
    options:
      question.type === "radio" || question.type === "checkbox"
        ? normalizeChoiceOptions(question.options)
        : [],
  };
}

export const eventFormSchema = z.object({
  title: z.string().min(1),
  /* Short by design: the card shows it as a single-line pill, and long
     text would either wrap over the image or get cut off. */
  badgeText: z.string().max(30, "Enintään 30 merkkiä").optional(),
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
  description: z.string().optional(),
  location: z.string().optional(),
  price: z.string().optional(),
  webpageUrl: z.string().optional(),
  draft: z.boolean(),
  signupsPublic: z.boolean(),
  verificationEmail: z.string().optional(),
  extraCapacity: z.number().int().min(0),
  raffleEnabled: z.boolean().default(false),
  Quotas: z.array(quotaSchema.extend({ signupCount: z.number() })),
  Questions: z.array(questionSchema),
});
