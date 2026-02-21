import { startOfDay, format, getMilliseconds } from "date-fns";
import { formatInTimeZone } from 'date-fns-tz';
import { z } from "zod";

// Time zone set to helsinki so there is no mismatch between the server and client that could cause a hydration error.
const TIMEZONE = 'Europe/Helsinki';

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
    return formatInTimeZone(d, TIMEZONE, `HH:mm`);
  },
  stringifyAccurate(d: Date) {
    return formatInTimeZone(d, TIMEZONE, `HH:mm`) + "." + getMilliseconds(d);
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
