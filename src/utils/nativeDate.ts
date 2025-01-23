import { startOfDay, format } from "date-fns";
import { z } from "zod";

const schema = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, "Syötä kunnollinen päivämäärä")
  .refine((date) => !Number.isNaN(new Date(date).getTime()));

const schemaWithTransform = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, "Syötä kunnollinen päivämäärä")
  .refine((date) => !Number.isNaN(new Date(date).getTime()))
  .transform((date) => startOfDay(new Date(date)));

const formSchema = z.preprocess(
  (arg) => (arg instanceof Date ? arg : new Date(String(arg))),
  z.date()
);

export const nativeDate = {
  stringify(d: Date) {
    return format(d, `yyyy-MM-dd`);
  },
  parse(s: string | undefined) {
    if (!s) return undefined;
    const date = schemaWithTransform.parse(s);
    if (Number.isNaN(new Date(date).getTime())) return undefined;
    return date;
  },
  formSchema,
  schema,
  schemaWithTransform,
};
