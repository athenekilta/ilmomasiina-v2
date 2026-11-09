import { EventCard } from "@/features/eventCard/EventCard";
import type { EnrichedEvent } from "@/features/eventCard/eventCardVariant";

export function EventGrid({
  events,
  isAdmin,
}: {
  events: EnrichedEvent[];
  isAdmin: boolean;
}) {
  return (
    <ul className="grid w-full list-none grid-cols-1 gap-4 p-0 md:grid-cols-2 xl:grid-cols-3">
      {events.map((event) => (
        <li key={event.id} className="min-w-0">
          <EventCard event={event} isAdmin={isAdmin} />
        </li>
      ))}
    </ul>
  );
}
