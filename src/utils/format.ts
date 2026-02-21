import { nativeTime } from "@/utils/nativeTime"
import { nativeDate } from "@/utils/nativeDate"

export const formatRegistration = (start: Date, end: Date) => {
  const now = new Date();
  const startDate = new Date(start);
  const endDate = new Date(end);
  const isOpen = startDate <= now && endDate >= now;

  if (isOpen === false && endDate < now) {
    return "Ilmo on päättynyt.";
  } else if (isOpen === true && startDate <= now && endDate >= now) {
    return `Auki ${nativeDate.stringify(startDate)} klo ${nativeTime.stringify(endDate)} asti`;
  } else if (startDate > now) {
    return `Ilmo aukeaa ${nativeDate.stringify(startDate)} klo ${nativeTime.stringify(startDate)}`;
  }

  return "";
};
