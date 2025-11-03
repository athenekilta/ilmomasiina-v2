export const formatRegistration = (start: Date, end: Date) => {
  const now = new Date();
  const startDate = new Date(start);
  const endDate = new Date(end);
  const isOpen = startDate <= now && endDate >= now;

  if (isOpen === false && endDate < now) {
    return "Ilmo on päättynyt.";
  } else if (isOpen === true && startDate <= now && endDate >= now) {
    return `Auki ${endDate.toLocaleDateString(
      "fi-FI",
    )} klo ${endDate.toLocaleTimeString("fi-FI", {
      hour: "2-digit",
      minute: "2-digit",
    })} asti`;
  } else if (startDate > now) {
    return `Ilmo aukeaa ${startDate.toLocaleDateString(
      "fi-FI",
    )} klo ${startDate.toLocaleTimeString("fi-FI", {
      hour: "2-digit",
      minute: "2-digit",
    })}`;
  }
  return "";
};
