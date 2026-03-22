import { format, isValid, parse, startOfDay } from "date-fns";
import { z } from "zod";

const INVALID_DATE_MESSAGE = "Syötä kunnollinen päivämäärä";
const DISPLAY_DATE_FORMAT = "dd.MM.yyyy";
const FORM_DATE_FORMAT = "yyyy-MM-dd";

function parseDateString(value: string, dateFormat: string) {
  const parsedDate = parse(value, dateFormat, new Date());
  if (!isValid(parsedDate)) return undefined;
  if (format(parsedDate, dateFormat) !== value) return undefined;
  return startOfDay(parsedDate);
}

const formSchema = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, INVALID_DATE_MESSAGE)
  .refine((date) => parseDateString(date, FORM_DATE_FORMAT) !== undefined, {
    message: INVALID_DATE_MESSAGE,
  });

const formSchemaWithTransform = formSchema.transform((date) =>
  parseDateString(date, FORM_DATE_FORMAT),
);

export const nativeDate = {
  stringify(d: Date) {
    return format(d, DISPLAY_DATE_FORMAT);
  },
  form: {
    stringify(d: Date) {
      return format(d, FORM_DATE_FORMAT);
    },
    parse(s: string | undefined) {
      if (!s) return undefined;
      return parseDateString(s, FORM_DATE_FORMAT);
    },
    schema: formSchema,
    schemaWithTransform: formSchemaWithTransform,
  },
};
