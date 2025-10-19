import { Icon } from "@/components/Icon";
import { api } from "@/utils/api";
import { PageHead } from "@/features/layout/PageHead";
import { Layout } from "../features/layout/Layout";
import Link from "next/link";
import { useUser } from "@/features/auth/hooks/useUser";
import { routes } from "@/utils/routes";
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
          <div>
            <div className="flex flex-col justify-between gap-4 p-6 font-primary sm:flex-row">
              <h1 className="text-2xl font-bold">Tapahtumat</h1>

              {isAdmin && (
                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={() => setIncludeOlderEvents(!includeOlderEvents)}
                    className={`inline-flex items-center rounded-md px-3 py-1 font-secondary text-sm font-medium ${
                      includeOlderEvents
                        ? "bg-gray-700 text-blue-800 text-brand-darkbeige"
                        : "bg-brand-darkbeige text-gray-800 dark:bg-gray-700 dark:text-gray-300"
                    }`}
                  >
                    <Icon
                      icon={
                        includeOlderEvents ? "history" : "history_toggle_off"
                      }
                      className="mr-1 h-4 w-4"
                    />
                    {includeOlderEvents
                      ? "Kaikki tapahtumat"
                      : "Tulevat tapahtumat"}
                  </button>
                  <button
                    onClick={() => setIncludeDrafts(!includeDrafts)}
                    className={`inline-flex items-center rounded-md px-3 py-1 font-secondary text-sm font-medium ${
                      includeDrafts
                        ? "bg-gray-700 text-blue-800 text-brand-darkbeige"
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
            </div>

            <div className="relative overflow-x-auto p-6">
              <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
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
          </div>
        ) : (
          <Icon icon="loading" />
        )}
      </Layout>
    </>
  );
}
