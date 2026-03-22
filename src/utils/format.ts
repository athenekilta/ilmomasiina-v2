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
