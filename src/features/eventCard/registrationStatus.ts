import { formatDate, formatTime } from "@/utils/format";
import type { EnrichedEvent } from "./eventCardVariant";

export type RegistrationState = "upcoming" | "open" | "closed";

export type RegistrationStatus = {
  state: RegistrationState;
  /** "Auki vielä 3 päivää" — the countdown, the thing people act on. */
  headline: string;
  /** "23.8.2026 klo 19.23 asti" — the exact moment, for planning. */
  detail: string;
  /** True inside the last 48h of an open window, or the last 24h before one opens. */
  urgent: boolean;
};

const MINUTE = 60 * 1000;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;

const at = (date: Date) =>
  `${formatDate(date)} klo ${formatTime(date, {
    hour: "2-digit",
    minute: "2-digit",
  })}`;

/**
 * Registration timing as a countdown rather than a date.
 *
 * A date makes the reader do the arithmetic before they know whether to
 * hurry; "Sulkeutuu 6 tunnin päästä" doesn't. The exact moment still ships
 * alongside it as the secondary line, since that is what people need once
 * they've decided to come.
 *
 * Deliberately no progress bar for time: the registration window's start
 * and end are arbitrary from the reader's point of view, so a half-full bar
 * says nothing about urgency. Bars are for the seats, which have a real
 * zero-to-full scale — that is the figures pill next to this.
 */
export function getRegistrationStatus(event: EnrichedEvent): RegistrationStatus {
  const now = Date.now();
  const start = new Date(event.registrationStartDate);
  const end = new Date(event.registrationEndDate);

  if (end.getTime() < now) {
    return {
      state: "closed",
      headline: "Ilmo sulkeutunut",
      detail: `Päättyi ${at(end)}`,
      urgent: false,
    };
  }

  if (start.getTime() > now) {
    const until = start.getTime() - now;
    return {
      state: "upcoming",
      headline: countdown(until, "Aukeaa"),
      detail: at(start),
      urgent: until < DAY,
    };
  }

  const left = end.getTime() - now;
  return {
    state: "open",
    headline:
      left < 2 * DAY ? countdown(left, "Sulkeutuu") : `Auki vielä ${Math.floor(left / DAY)} päivää`,
    detail: `${at(end)} asti`,
    urgent: left < 2 * DAY,
  };
}

/** "Aukeaa 3 päivän päästä", "Sulkeutuu 40 minuutin päästä". */
function countdown(ms: number, verb: string): string {
  if (ms < HOUR) {
    return `${verb} ${Math.max(1, Math.round(ms / MINUTE))} minuutin päästä`;
  }
  if (ms < DAY) {
    return `${verb} ${Math.round(ms / HOUR)} tunnin päästä`;
  }
  if (ms < 2 * DAY) {
    return `${verb} huomenna`;
  }
  return `${verb} ${Math.floor(ms / DAY)} päivän päästä`;
}
