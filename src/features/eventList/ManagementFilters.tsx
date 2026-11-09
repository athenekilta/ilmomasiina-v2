import { CalendarClock, Eye, EyeOff, History } from "lucide-react";
import { Button } from "@/components/Button";
import { useTranslations } from "@/i18n/I18nProvider";
import { publicEventsMessages } from "@/i18n/messages/events";

export type ManagementFiltersValue = {
  includeDrafts: boolean;
  includeOlderEvents: boolean;
};

export function ManagementFilters({
  value,
  onChange,
}: {
  value: ManagementFiltersValue;
  onChange: (value: ManagementFiltersValue) => void;
}) {
  const { list: messages } = useTranslations(publicEventsMessages);
  const filters = [
    {
      key: "includeOlderEvents",
      label: value.includeOlderEvents
        ? messages.allEvents
        : messages.upcomingEvents,
      icon: value.includeOlderEvents ? History : CalendarClock,
    },
    {
      key: "includeDrafts",
      label: value.includeDrafts
        ? messages.draftsVisible
        : messages.draftsHidden,
      icon: value.includeDrafts ? Eye : EyeOff,
    },
  ] as const;

  return (
    <div
      className="flex flex-wrap gap-3"
      role="group"
      aria-label={messages.adminFilters}
    >
      {filters.map(({ key, label, icon: Icon }) => (
        <Button
          key={key}
          variant="filled"
          color={value[key] ? "primary" : "neutral"}
          size="small"
          startIcon={<Icon size={18} strokeWidth={2.25} />}
          aria-pressed={value[key]}
          onClick={() => onChange({ ...value, [key]: !value[key] })}
        >
          {label}
        </Button>
      ))}
    </div>
  );
}
