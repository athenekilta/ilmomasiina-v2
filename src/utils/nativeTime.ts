import { startOfDay, format } from "date-fns";
import { z } from "zod";

const timeSchema = z
  .string()
  .regex(/^\d{2}:\d{2}$/, "Syötä kunnollinen aika")
  .refine((date) => !Number.isNaN(new Date(date).getTime()));

const timeSchemaWithTransform = z
  .string()
  .regex(/^\d{2}:\d{2}$/, "Syötä kunnollinen aika")
  .refine((date) => !Number.isNaN(new Date(date).getTime()))
  .transform((date) => startOfDay(new Date(date)));

const formSchema = z.preprocess(
  (arg) => (arg instanceof Date ? arg : new Date(String(arg))),
  z.date()
);

export const nativeTime = {
  stringify(d: Date) {
    return format(d, `HH:mm`);
  },
  parse(s: string | undefined) {
    if (!s) return undefined;
    const time = timeSchemaWithTransform.parse(s);
    if (Number.isNaN(new Date(time).getTime())) return undefined;
    return time;
  },
  formSchema,
  timeSchema,
  timeSchemaWithTransform,
};
