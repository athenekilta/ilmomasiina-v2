import { Icon } from "@/components/Icon";
import { api } from "@/utils/api";
import { PageHead } from "@/features/layout/PageHead";
import { Layout } from "../features/layout/Layout";
import Link from "next/link";

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
  const getEvents = api.events.getEvents.useQuery();

  return (
    <>
      <PageHead title="Tapahtumat" />
      <Layout>
        {getEvents.data ? (
          <div>
            <h1>Tapahtumat</h1>

            <div className="relative overflow-x-auto">
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
                  </tr>
                </thead>
                <tbody>
                  {getEvents.data.map((event) => (
                    <tr
                      className="border-b bg-white dark:border-gray-700 dark:bg-gray-800"
                      key={event.id}
                    >
                      <td className="py-4 px-6">
                        <Link href={`events/${event.id}`}>{event.title}</Link>
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
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <Icon icon="loading" />
        )}
      </Layout>
    </>
  );
}
