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
import { IdentityPromptCard } from "@/features/eventCard/IdentityPromptCard";
import HydrationZustand from "@/components/HydrationZustand";
import { groupEventsForList } from "@/features/eventCard/eventOrder";
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
  const events = eventsData
    ? groupEventsForList(eventsData)
    : { open: [], closed: [] };
  const isLoading = isAdmin
    ? adminEventsQuery.isLoading
    : regularEventsQuery.isLoading;

  return (
    <>
      <PageHead title="Tapahtumat" />
      <Layout>
        {!isLoading && eventsData ? (
          <div className="flex-col pb-4">
            {/* Above the heading, not under it: this is not an event, and
                under "Tapahtumat" it read as the first item in the list. */}
            <HydrationZustand>
              <IdentityPromptCard />
            </HydrationZustand>

            <header className="mt-2 mb-4 w-full">
              <h1 className="text-brand-secondary px-1 text-xl font-extrabold tracking-tight uppercase sm:text-2xl">
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
              {/* Every card is the same size. Columns are added only once
                  the previous count would leave cards uncomfortably wide:
                  two from `md` (768px), three from `xl` (1280px) — below
                  that a single column keeps the banner from stretching
                  out of proportion. Cards stretch to fill their row (the
                  grid default), so a shorter card still lines up with a
                  taller neighbour. */}
              <ul className="grid w-full list-none grid-cols-1 gap-4 p-0 md:grid-cols-2 xl:grid-cols-3">
                {events.open.map((event) => (
                  <li key={event.id} className="min-w-0">
                    <EventCard event={event} isAdmin={isAdmin} />
                  </li>
                ))}
              </ul>
            </section>

            {events.closed.length > 0 && (
              /* Own section, smaller heading: these are not competing for
                 attention with the events you can still sign up to. */
              <section className="mt-14 w-full" aria-labelledby="closed-events">
                <h2
                  id="closed-events"
                  className="text-brand-dark mb-4 px-1 text-lg font-extrabold tracking-tight uppercase sm:text-xl"
                >
                  Ilmo päättynyt
                </h2>
                <ul className="grid w-full list-none grid-cols-1 gap-4 p-0 md:grid-cols-2 xl:grid-cols-3">
                  {events.closed.map((event) => (
                    <li key={event.id} className="min-w-0">
                      <EventCard event={event} isAdmin={isAdmin} />
                    </li>
                  ))}
                </ul>
              </section>
            )}

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
