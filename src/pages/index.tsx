import { Icon } from "@/components/Icon";
import { api } from "@/utils/api";
import { PageHead } from "@/features/layout/PageHead";
import { Layout } from "../features/layout/Layout";
import Link from "next/link";
import { useUser } from "@/features/auth/hooks/useUser";
import { useState } from "react";

const formatRegistration = (start: Date, end: Date) => {
  const now = new Date();
  const startDate = new Date(start);
  const endDate = new Date(end);
  const isOpen = startDate <= now && endDate >= now;

  if (isOpen === false && endDate < now) {
    return "Ilmoittautuminen on päättynyt.";
  } else if (isOpen === true && startDate <= now && endDate >= now) {
    return `Auki ${endDate.toLocaleDateString(
      "fi-FI"
    )} klo ${endDate.toLocaleTimeString("fi-FI", {
      hour: "2-digit",
      minute: "2-digit",
    })} asti.`;
  } else if (startDate > now) {
    return `Alkaa ${startDate.toLocaleDateString(
      "fi-FI"
    )} klo ${startDate.toLocaleTimeString("fi-FI", {
      hour: "2-digit",
      minute: "2-digit",
    })}.`;
  }
  return "";
};

export default function DesktopPage() {
  const [includeDrafts, setIncludeDrafts] = useState(false);
  const [includeOlderEvents, setIncludeOlderEvents] = useState(false);
  
  const user = useUser();
  const isAdmin = user.data?.role === "admin";
  
  const regularEventsQuery = api.events.getEvents.useQuery(undefined, {
    enabled: !isAdmin
  });

  const adminEventsQuery = api.events.getEventsAdmin.useQuery(
    { includeDrafts, includeOlderEvents },
    { enabled: isAdmin }
  );

  const eventsData = isAdmin ? adminEventsQuery.data : regularEventsQuery.data;
  const isLoading = isAdmin ? adminEventsQuery.isLoading : regularEventsQuery.isLoading;

  return (
    <>
      <PageHead title="Tapahtumat" />
      <Layout>
        {!isLoading && eventsData ? (
          <div>
            <div className="flex flex-col justify-between gap-4 sm:flex-row">
              <h1 className="text-2xl font-bold">Tapahtumat</h1>
              
              {isAdmin && (
                <div className="flex flex-wrap gap-3">
                  <button 
                    onClick={() => setIncludeDrafts(!includeDrafts)}
                    className={`inline-flex items-center rounded-md px-3 py-1 text-sm font-medium ${
                      includeDrafts 
                        ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300' 
                        : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                    }`}
                  >
                    <Icon icon={includeDrafts ? "eye" : "eye-slash"} className="mr-1 h-4 w-4" />
                    {includeDrafts ? "Luonnokset näkyvissä" : "Näytä luonnokset"}
                  </button>
                  
                  <button 
                    onClick={() => setIncludeOlderEvents(!includeOlderEvents)}
                    className={`inline-flex items-center rounded-md px-3 py-1 text-sm font-medium ${
                      includeOlderEvents 
                        ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300' 
                        : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                    }`}
                  >
                    <Icon icon="calendar" className="mr-1 h-4 w-4" />
                    {includeOlderEvents ? "Kaikki tapahtumat" : "Näytä vanhat tapahtumat"}
                  </button>
                </div>
              )}
            </div>

            <div className="mt-6 relative overflow-x-auto">
              <table className="w-full text-left text-sm text-gray-500 dark:text-gray-400">
                <thead className="bg-gray-50 text-xs uppercase text-gray-700 dark:bg-gray-700 dark:text-gray-400">
                  <tr>
                    <th scope="col" className="py-3 px-6">
                      Nimi
                    </th>
                    <th scope="col" className="py-3 px-6">
                      Ajankohta
                    </th>
                    <th scope="col" className="py-3 px-6">
                      Ilmoittautuminen
                    </th>
                    <th scope="col" className="py-3 px-6">
                      Ilmoittautuneita
                    </th>
                    {isAdmin && (
                      <th className="py-3 px-6">
                        Toiminto
                      </th>
                    )}
                  </tr>
                </thead>
                <tbody>
                  {eventsData.map((event) => (
                    <tr
                      className={`border-b ${
                        event.draft
                          ? "bg-amber-50 dark:bg-amber-900/20"
                          : "bg-white dark:bg-gray-800"
                      } dark:border-gray-700`}
                      key={event.id}
                    >
                      <td className="py-4 px-6">
                        <div className="flex flex-col">
                          <Link href={`events/${event.id}`} className="font-medium hover:text-blue-600">
                            {event.title}
                          </Link>
                          {event.draft && (
                            <span className="mt-1 inline-block rounded bg-amber-200 px-2 py-0.5 text-xs font-medium text-amber-800 dark:bg-amber-800 dark:text-amber-200">
                              Luonnos
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        {new Date(event.date).toLocaleDateString()}
                      </td>
                      <td className="py-4 px-6">
                        {formatRegistration(
                          event.registrationStartDate,
                          event.registrationEndDate
                        )}
                      </td>
                      <td className="py-4 px-6">
                        {event.Quotas.map((quota) => (
                          <p key={quota.id}>
                            {quota.title}: {quota.signupCount} / {quota.size}
                          </p>
                        ))}
                      </td>
                      {isAdmin && (
                        <td className="py-4 px-6">
                          <Link 
                            href={`events/edit/${event.id}`}
                            className="font-medium text-blue-600 hover:underline dark:text-blue-500"
                          >
                            Muokkaa
                          </Link>
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
              
              {isAdmin && (
                <div className="mt-6">
                  <Link 
                    href="events/create"
                    className="inline-flex items-center rounded-md bg-green-600 px-4 py-2 text-center font-medium text-white hover:bg-green-700"
                  >
                    <Icon icon="plus" className="mr-2 h-5 w-5" />
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
