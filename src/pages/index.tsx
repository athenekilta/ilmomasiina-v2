import {
  CalendarClock,
  Eye,
  EyeOff,
  History,
  Loader2,
  Plus,
} from "lucide-react";
import { api } from "@/utils/api";
import { PageHead } from "@/features/layout/PageHead";
import { Layout } from "../features/layout/Layout";
import { useUser } from "@/features/auth/hooks/useUser";
import { useState } from "react";
import { EventCard } from "@/features/eventCard/EventCard";
import {
  eventCardSpanClassName,
  getEventCardSize,
  pickBigEventIds,
} from "@/features/eventCard/eventCardVariant";
import { Button } from "@/components/Button";

export default function DesktopPage() {
  const [includeDrafts, setIncludeDrafts] = useState(false);
  const [includeOlderEvents, setIncludeOlderEvents] = useState(false);

  const user = useUser();
  const isAdmin = user.data?.role === "admin";

  const regularEventsQuery = api.events.getEvents.useQuery(undefined, {
    enabled: !isAdmin,
  });

  const adminEventsQuery = api.events.getEventsAdmin.useQuery(
    { includeDrafts, includeOlderEvents },
    { enabled: isAdmin },
  );

  const eventsData = isAdmin ? adminEventsQuery.data : regularEventsQuery.data;
  const isLoading = isAdmin
    ? adminEventsQuery.isLoading
    : regularEventsQuery.isLoading;

  const bigEventIds = eventsData
    ? pickBigEventIds(eventsData)
    : new Set<number>();

  // Rendered in plain chronological order — no reordering to cluster big
  // squares together. The dense grid just plants each big square wherever
  // it naturally falls among the small ones, so multiple big squares land
  // on different sides of the grid instead of piling up on one edge.
  const sizedEvents = eventsData?.map((event) => ({
    event,
    size: getEventCardSize(bigEventIds.has(event.id)),
  }));

  return (
    <>
      <PageHead title="Tapahtumat" />
      <Layout>
        {!isLoading && eventsData ? (
          <div className="flex-col pb-4 sm:mx-15">
            <header className="border-brand-secondary mb-8 w-full border-b-2 pb-4">
              <h1 className="text-brand-dark text-3xl font-bold tracking-tight sm:text-4xl">
                Tapahtumat
              </h1>
            </header>

            {isAdmin && (
              <section
                className="mb-8 w-full"
                aria-label="Hallinnan suodattimet"
              >
                <h2 className="text-brand-secondary mb-4 text-xs font-bold tracking-widest uppercase">
                  Näkymä
                </h2>
                <div className="flex flex-wrap gap-3">
                  <Button
                    variant="filled"
                    color={includeOlderEvents ? "primary" : "neutral"}
                    size="small"
                    startIcon={
                      includeOlderEvents ? (
                        <History size={18} strokeWidth={2.25} />
                      ) : (
                        <CalendarClock size={18} strokeWidth={2.25} />
                      )
                    }
                    onClick={() => setIncludeOlderEvents(!includeOlderEvents)}
                  >
                    {includeOlderEvents
                      ? "Kaikki tapahtumat"
                      : "Tulevat tapahtumat"}
                  </Button>

                  <Button
                    variant="filled"
                    color={includeDrafts ? "primary" : "neutral"}
                    size="small"
                    startIcon={
                      includeDrafts ? (
                        <Eye size={18} strokeWidth={2.25} />
                      ) : (
                        <EyeOff size={18} strokeWidth={2.25} />
                      )
                    }
                    onClick={() => setIncludeDrafts(!includeDrafts)}
                  >
                    {includeDrafts
                      ? "Luonnokset näkyvissä"
                      : "Luonnokset piilotettu"}
                  </Button>
                </div>
              </section>
            )}

            <section className="w-full" aria-label="Tapahtumalista">
              <h2 className="sr-only">Tapahtumalista</h2>
              {/* Fixed equal-width columns — column tracks never resize,
                  only how many a card spans, capped at 2 columns (and 2
                  rows, to match) so a card never takes over the whole
                  row. Cards stretch to fill their row (the grid default)
                  — a row's height is set by its tallest card regardless,
                  so a shorter neighbor must stretch too or the page
                  background would show through the gap below it. Mobile
                  stacks to a single column, where cards need a gap
                  between them instead of relying on the grid's row
                  boundaries. */}
              <ul className="grid w-full list-none grid-cols-1 gap-3 p-0 sm:grid-flow-dense sm:grid-cols-3 sm:gap-0">
                {sizedEvents?.map(({ event, size }) => (
                  <li
                    key={event.id}
                    className={`min-w-0 ${eventCardSpanClassName[size]}`}
                  >
                    <EventCard event={event} isAdmin={isAdmin} size={size} />
                  </li>
                ))}
              </ul>
            </section>

            {isAdmin && (
              <div className="mt-10 w-full border-t border-stone-300 pt-8">
                <h2 className="text-brand-secondary mb-4 text-xs font-bold tracking-widest uppercase">
                  Hallinta
                </h2>
                <Button.Link
                  href="events/create"
                  variant="filled"
                  color="primary"
                  startIcon={<Plus size={20} strokeWidth={2.25} />}
                >
                  Luo uusi tapahtuma
                </Button.Link>
              </div>
            )}
          </div>
        ) : (
          <div className="flex justify-center py-12">
            <Loader2
              size={28}
              strokeWidth={2.25}
              className="text-brand-primary animate-spin"
            />
          </div>
        )}
      </Layout>
    </>
  );
}
