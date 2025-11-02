import { z } from "zod";

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
  size: z.number().min(1).nullable(),
  sortId: z.number().positive(),
  eventId: z.union([z.number(), z.nan()]),
});

export const questionSchema = z.object({
  id: z.string(),
  question: z.string().min(1),
  type: z.enum(["text", "textarea", "radio", "checkbox"]),
  options: z.array(z.string()),
  sortId: z.number().positive(),
  required: z.boolean(),
  public: z.boolean(),
  eventId: z.union([z.number(), z.nan()]),
});

export const eventFormSchema = z.object({
  title: z.string().min(1),
  date: z.preprocess((arg) => {
    if (typeof arg === "string" || arg instanceof Date) return new Date(arg);
  }, z.date()),
  registrationStartDate: z.preprocess((arg) => {
    if (typeof arg === "string" || arg instanceof Date) return new Date(arg);
  }, z.date()),
  registrationEndDate: z.preprocess((arg) => {
    if (typeof arg === "string" || arg instanceof Date) return new Date(arg);
  }, z.date()),
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
  raffleEnabled: z.boolean().default(false),
  Quotas: z.array(quotaSchema.extend({ signupCount: z.number() })),
  Questions: z.array(questionSchema),
});
