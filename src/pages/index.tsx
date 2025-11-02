import { Icon } from "@/components/Icon";
import { api } from "@/utils/api";
import { PageHead } from "@/features/layout/PageHead";
import { Layout } from "../features/layout/Layout";
import Link from "next/link";
import { useUser } from "@/features/auth/hooks/useUser";
import { useState } from "react";
import { EventCard } from "@/features/eventCard/EventCard";

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
            <h1 className="mb-4 text-xl font-extrabold uppercase">
              Tapahtumat
            </h1>

            {isAdmin && (
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() => setIncludeOlderEvents(!includeOlderEvents)}
                  className={`font-secondary inline-flex items-center rounded-md px-3 py-1 text-sm font-medium ${
                    includeOlderEvents
                      ? "text-brand-darkbeige bg-gray-700 text-blue-800"
                      : "bg-brand-darkbeige text-gray-800 dark:bg-gray-700 dark:text-gray-300"
                  }`}
                >
                  <Icon
                    icon={includeOlderEvents ? "history" : "history_toggle_off"}
                    className="mr-1 h-4 w-4"
                  />
                  {includeOlderEvents
                    ? "Kaikki tapahtumat"
                    : "Tulevat tapahtumat"}
                </button>
                <button
                  onClick={() => setIncludeDrafts(!includeDrafts)}
                  className={`font-secondary inline-flex items-center rounded-md px-3 py-1 text-sm font-medium ${
                    includeDrafts
                      ? "text-brand-darkbeige bg-gray-700 text-blue-800"
                      : "bg-brand-darkbeige text-gray-800 dark:bg-gray-700 dark:text-gray-300"
                  }`}
                >
                  <Icon
                    icon={includeDrafts ? "visibility" : "visibility_off"}
                    className="mr-1 h-4 w-4"
                  />
                  {includeDrafts
                    ? "Luonnokset näkyvissä"
                    : "Luonnokset piilotettu"}
                </button>
              </div>
            )}

            <div className="flex flex-col gap-4">
              {eventsData.map((event) => (
                <EventCard key={event.id} event={event} isAdmin={isAdmin} />
              ))}
            </div>

            {isAdmin && (
              <div className="mt-6">
                <Link
                  href="events/create"
                  className="inline-flex items-center rounded-md bg-green-600 px-4 py-2 text-center font-medium text-white hover:bg-green-700"
                >
                  <Icon icon="add" className="mr-2 h-5 w-5" />
                  Luo uusi tapahtuma
                </Link>
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
