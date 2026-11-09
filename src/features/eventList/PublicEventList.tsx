import type { EnrichedEvent } from "@/features/eventCard/eventCardVariant";
import { groupEventsForList } from "@/features/eventCard/eventOrder";
import { useTranslations } from "@/i18n/I18nProvider";
import { publicEventsMessages } from "@/i18n/messages/events";
import { EventGrid } from "./EventGrid";

export function PublicEventList({
  events,
  isAdmin,
}: {
  events: EnrichedEvent[];
  isAdmin: boolean;
}) {
  const messages = useTranslations(publicEventsMessages);
  const { open, closed } = groupEventsForList(events);

  return (
    <>
      <header className="mt-2 mb-4 w-full">
        <h1 className="eyebrow text-brand-secondary px-1 sm:text-base">
          {messages.list.title}
        </h1>
      </header>
      <section className="w-full" aria-label={messages.list.eventList}>
        <h2 className="sr-only">{messages.list.eventList}</h2>
        {open.length === 0 && (
          <p className="text-brand-dark px-1 text-sm">{messages.list.empty}</p>
        )}
        <EventGrid events={open} isAdmin={isAdmin} />
      </section>
      {closed.length > 0 && (
        <section className="mt-14 w-full" aria-labelledby="closed-events">
          <h2
            id="closed-events"
            className="eyebrow text-brand-dark mb-4 px-1 sm:text-base"
          >
            {messages.list.registrationEnded}
          </h2>
          <EventGrid events={closed} isAdmin={isAdmin} />
        </section>
      )}
    </>
  );
}
