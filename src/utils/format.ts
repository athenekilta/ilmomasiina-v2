import {
  appTimeZone,
  defaultLocale,
  intlLocale,
  type Locale,
} from "@/i18n/config";

type DateValue = Date | string | number;

const asDate = (value: DateValue) => new Date(value);

export const formatDate = (
  value: DateValue,
  options?: Intl.DateTimeFormatOptions,
  locale: Locale = defaultLocale,
) =>
  new Intl.DateTimeFormat(intlLocale[locale], {
    timeZone: appTimeZone,
    ...options,
  }).format(asDate(value));

export const formatTime = (
  value: DateValue,
  options?: Intl.DateTimeFormatOptions,
  locale: Locale = defaultLocale,
) =>
  new Intl.DateTimeFormat(intlLocale[locale], {
    timeZone: appTimeZone,
    ...options,
  }).format(asDate(value));

export const formatDateTime = (
  value: DateValue,
  options?: Intl.DateTimeFormatOptions,
  locale: Locale = defaultLocale,
) =>
  new Intl.DateTimeFormat(intlLocale[locale], {
    timeZone: appTimeZone,
    ...options,
  }).format(asDate(value));

/** Event date with a short weekday in front, in Europe/Helsinki. */
export const formatEventDateTime = (
  value: DateValue,
  locale: Locale = defaultLocale,
) => {
  const formatted = new Intl.DateTimeFormat(intlLocale[locale], {
    timeZone: appTimeZone,
    weekday: "short",
    day: "numeric",
    month: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(asDate(value));

  return formatted.charAt(0).toUpperCase() + formatted.slice(1);
};

/**
 * Signup time for the participants list: "16.9. 11.08.33".
 *
 * The list has to fit one signup per line on a phone, and the year is the
 * part that never earns its width — every signup on an event page is from
 * the same few days, and the year is already in the event's own date. The
 * seconds stay: in a popular event they are the thing people compare.
 */
export const formatSignupTime = (
  value: DateValue,
  locale: Locale = defaultLocale,
) => {
  const date = asDate(value);
  const day = new Intl.DateTimeFormat(intlLocale[locale], {
    timeZone: appTimeZone,
    day: "numeric",
    month: "numeric",
  }).format(date);
  const time = new Intl.DateTimeFormat(intlLocale[locale], {
    timeZone: appTimeZone,
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  }).format(date);
  return `${day} ${time}`;
};

type RegistrationFormatMessages = {
  periodEnded: string;
  openUntil: (dateTime: string) => string;
  opensAt: (dateTime: string) => string;
};

export const formatRegistration = (
  start: DateValue,
  end: DateValue,
  locale: Locale,
  messages: RegistrationFormatMessages,
) => {
  const now = new Date();
  const startDate = asDate(start);
  const endDate = asDate(end);
  const dateTime = (value: Date) =>
    `${formatDate(value, undefined, locale)} ${formatTime(
      value,
      { hour: "2-digit", minute: "2-digit" },
      locale,
    )}`;

  if (endDate < now) return messages.periodEnded;
  if (startDate <= now && endDate >= now) {
    return messages.openUntil(dateTime(endDate));
  }
  if (startDate > now) return messages.opensAt(dateTime(startDate));
  return "";
};
