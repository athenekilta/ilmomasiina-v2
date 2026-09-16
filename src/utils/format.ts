const APP_LOCALE = "fi-FI";
const APP_TIME_ZONE = "Europe/Helsinki";

type DateValue = Date | string | number;

const asDate = (value: DateValue) => new Date(value);

export const formatDate = (
  value: DateValue,
  options?: Intl.DateTimeFormatOptions,
) =>
  asDate(value).toLocaleDateString(APP_LOCALE, {
    timeZone: APP_TIME_ZONE,
    ...options,
  });

export const formatTime = (
  value: DateValue,
  options?: Intl.DateTimeFormatOptions,
) =>
  asDate(value).toLocaleTimeString(APP_LOCALE, {
    timeZone: APP_TIME_ZONE,
    ...options,
  });

export const formatDateTime = (
  value: DateValue,
  options?: Intl.DateTimeFormatOptions,
) =>
  asDate(value).toLocaleString(APP_LOCALE, {
    timeZone: APP_TIME_ZONE,
    ...options,
  });

/**
 * Event date with the weekday in front: "Su 16.8.2026 klo 17.57".
 *
 * The weekday is the part people plan around ("is it a weekday?"), so it
 * carries more weight than the year. Written out with explicit fields
 * rather than `dateStyle`, since Intl rejects mixing the two — and short
 * rather than long, because Finnish long weekdays come out in the essive
 * ("sunnuntaina"), which reads oddly in front of a date.
 */
export const formatEventDateTime = (value: DateValue) => {
  const formatted = asDate(value).toLocaleString(APP_LOCALE, {
    timeZone: APP_TIME_ZONE,
    weekday: "short",
    day: "numeric",
    month: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

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
export const formatSignupTime = (value: DateValue) => {
  const date = asDate(value);
  const day = date.toLocaleDateString(APP_LOCALE, {
    timeZone: APP_TIME_ZONE,
    day: "numeric",
    month: "numeric",
  });
  const time = date.toLocaleTimeString(APP_LOCALE, {
    timeZone: APP_TIME_ZONE,
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
  return `${day} ${time}`;
};

export const formatRegistration = (start: Date, end: Date) => {
  const now = new Date();
  const startDate = new Date(start);
  const endDate = new Date(end);
  const isOpen = startDate <= now && endDate >= now;

  if (isOpen === false && endDate < now) {
    return "Ilmo on p\u00E4\u00E4ttynyt.";
  } else if (isOpen === true && startDate <= now && endDate >= now) {
    return `Auki ${formatDate(endDate)} klo ${formatTime(endDate, {
      hour: "2-digit",
      minute: "2-digit",
    })} asti`;
  } else if (startDate > now) {
    return `Ilmo aukeaa ${formatDate(startDate)} klo ${formatTime(startDate, {
      hour: "2-digit",
      minute: "2-digit",
    })}`;
  }
  return "";
};
