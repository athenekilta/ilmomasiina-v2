import type { Locale } from "@/i18n/config";
import { formatDate, formatTime } from "@/utils/format";
import type { EnrichedEvent } from "./eventCardVariant";

export type RegistrationState = "upcoming" | "open" | "closed";

export type RegistrationStatus = {
  state: RegistrationState;
  headline: string;
  detail: string;
  urgent: boolean;
};

type RegistrationTimingMessages = {
  closed: string;
  endedAt: (dateTime: string) => string;
  opensInMinutes: (count: number) => string;
  opensInHours: (count: number) => string;
  opensTomorrow: string;
  opensInDays: (count: number) => string;
  closesInMinutes: (count: number) => string;
  closesInHours: (count: number) => string;
  closesTomorrow: string;
  closesInDays: (count: number) => string;
  openForDays: (count: number) => string;
  until: (dateTime: string) => string;
  at: (date: string, time: string) => string;
};

const MINUTE = 60 * 1000;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;

const at = (
  date: Date,
  locale: Locale,
  messages: RegistrationTimingMessages,
) =>
  messages.at(
    formatDate(date, undefined, locale),
    formatTime(date, { hour: "2-digit", minute: "2-digit" }, locale),
  );

export function getRegistrationStatus(
  event: EnrichedEvent,
  locale: Locale,
  messages: RegistrationTimingMessages,
): RegistrationStatus {
  const now = Date.now();
  const start = new Date(event.registrationStartDate);
  const end = new Date(event.registrationEndDate);

  if (end.getTime() < now) {
    return {
      state: "closed",
      headline: messages.closed,
      detail: messages.endedAt(at(end, locale, messages)),
      urgent: false,
    };
  }

  if (start.getTime() > now) {
    const until = start.getTime() - now;
    return {
      state: "upcoming",
      headline: countdown(until, "opens", messages),
      detail: at(start, locale, messages),
      urgent: until < DAY,
    };
  }

  const left = end.getTime() - now;
  return {
    state: "open",
    headline:
      left < 2 * DAY
        ? countdown(left, "closes", messages)
        : messages.openForDays(Math.floor(left / DAY)),
    detail: messages.until(at(end, locale, messages)),
    urgent: left < 2 * DAY,
  };
}

function countdown(
  ms: number,
  verb: "opens" | "closes",
  messages: RegistrationTimingMessages,
): string {
  if (ms < HOUR) {
    const count = Math.max(1, Math.round(ms / MINUTE));
    return verb === "opens"
      ? messages.opensInMinutes(count)
      : messages.closesInMinutes(count);
  }
  if (ms < DAY) {
    const count = Math.round(ms / HOUR);
    return verb === "opens"
      ? messages.opensInHours(count)
      : messages.closesInHours(count);
  }
  if (ms < 2 * DAY) {
    return verb === "opens" ? messages.opensTomorrow : messages.closesTomorrow;
  }
  const count = Math.floor(ms / DAY);
  return verb === "opens"
    ? messages.opensInDays(count)
    : messages.closesInDays(count);
}
