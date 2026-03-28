import { Icon } from "@/components/Icon";
import { api } from "@/utils/api";
import { PageHead } from "@/features/layout/PageHead";
import { Layout } from "../features/layout/Layout";
import { useUser } from "@/features/auth/hooks/useUser";
import { useState } from "react";
import { EventCard } from "@/features/eventCard/EventCard";
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

  return (
    <>
      <PageHead title="Tapahtumat" />
      <Layout>
        {!isLoading && eventsData ? (
          <div className="flex w-full flex-col pb-4">
            <header className="border-brand-secondary mb-8 w-full border-b-2 pb-4">
              <h1 className="text-brand-dark text-3xl font-bold tracking-tight sm:text-4xl">
                Tapahtumat
              </h1>
            </header>

            {isAdmin && (
              <div className="mb-8 flex flex-wrap gap-3">
                <Button
                  variant="filled"
                  color={includeOlderEvents ? "primary" : "neutral"}
                  size="small"
                  startIcon={
                    <Icon
                      icon={
                        includeOlderEvents ? "history" : "history_toggle_off"
                      }
                      size={18}
                    />
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
                    <Icon
                      icon={includeDrafts ? "visibility" : "visibility_off"}
                      size={18}
                    />
                  }
                  onClick={() => setIncludeDrafts(!includeDrafts)}
                >
                  {includeDrafts
                    ? "Luonnokset näkyvissä"
                    : "Luonnokset piilotettu"}
                </Button>
              </div>
            )}

            <div className="grid w-full grid-cols-1 gap-6 sm:grid-cols-2 sm:items-stretch lg:gap-8">
              {eventsData.map((event) => (
                <div key={event.id} className="flex h-full min-h-0 min-w-0">
                  <EventCard event={event} isAdmin={isAdmin} />
                </div>
              ))}
            </div>

            {isAdmin && (
              <div className="mt-10 w-full border-t border-stone-300 pt-8">
                <Button.Link
                  href="events/create"
                  variant="filled"
                  color="secondary"
                  startIcon={<Icon icon="add" size={20} />}
                >
                  Luo uusi tapahtuma
                </Button.Link>
              </div>
            )}
          </div>
        ) : (
          <div className="flex justify-center py-12">
            <Icon icon="loading" />
          </div>
        )}
      </Layout>
    </>
  );
}
