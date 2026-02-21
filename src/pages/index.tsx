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
          <div className="flex flex-col px-6 py-4">
            <h1 className="mb-2 text-xl font-extrabold uppercase">
              Tapahtumat
            </h1>

            {isAdmin && (
              <div className="my-2 flex flex-wrap gap-3">
                <Button
                  variant="filled"
                  color={includeOlderEvents ? "primary" : "neutral"}
                  size="small"
                  startIcon={
                    <Icon
                      icon={
                        includeOlderEvents ? "history" : "history_toggle_off"
                      }
                      className="h-4 w-4"
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
                      className="h-4 w-4"
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

            <div className="flex flex-col gap-4">
              {eventsData.map((event) => (
                <EventCard key={event.id} event={event} isAdmin={isAdmin} />
              ))}
            </div>

            {isAdmin && (
              <div className="mt-6">
                <Button.Link
                  href="events/create"
                  variant="filled"
                  color="secondary"
                  startIcon={<Icon icon="add" className="h-5 w-5" />}
                >
                  Luo uusi tapahtuma
                </Button.Link>
              </div>
            )}
          </div>
        ) : (
          <Icon icon="loading" />
        )}
      </Layout>
    </>
  );
}
