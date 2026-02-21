/* Refaktoroitu erilleen [eventId].tsx:stä. Tätä komponenttia käytetään siellä.
Tämän ja SignupsTablen voisi varmaan yhdistää*/

import { SignupRow } from "@/features/events/components/SingupRow";
import { OriginalQuotaTitle } from "@/features/events/utils/utils";
import type { RouteOutput } from "@/types/types";

export function ParticipantsTable({
  event,
}: {
  event: RouteOutput["events"]["getEventByID"];
}) {
  return (
    <div className="space-y-8">
      <h2 className="text-xl font-semibold text-gray-800">Ilmonneet</h2>

      {event.Quotas.map(
        (quota) =>
          !(quota.id == "queue" && quota.Signups.length == 0) && (
            <div
              key={quota.id}
              className="rounded-lg border border-gray-200 bg-white"
            >
              <div className="flex items-center border-b border-gray-200 p-4 text-lg font-medium">
                <h3 className="w-30 text-wrap">{quota.title}</h3>
                {quota.id !== "queue" && (
                  <>
                    <span className="text-md mx-5 w-40 font-normal text-gray-700">
                      {quota.Signups.length} / {quota.size ?? "∞"}
                    </span>
                    {quota.size && (
                      <div className="bg-brand-beige ml-auto h-2 w-60 overflow-hidden rounded-full">
                        <div
                          className={`h-full ${
                            quota.Signups.length >= quota.size
                              ? "bg-red-500"
                              : quota.Signups.length / quota.size > 0.75
                                ? "bg-yellow-500"
                                : "bg-green-500"
                          }`}
                          style={{
                            width: `${Math.min((quota.Signups.length / quota.size) * 100, 100)}%`,
                          }}
                        ></div>
                      </div>
                    )}
                  </>
                )}
                {quota.id === "queue" && (
                  <span className="text-md ml-5 font-normal text-gray-700">
                    {quota.Signups.length}
                  </span>
                )}
              </div>
              <div className="overflow-x-auto">
                {quota.Signups.length > 0 ? (
                  <table className="min-w-full text-sm">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="px-6 py-3 text-left font-medium text-gray-900">
                          Sija
                        </th>
                        <th className="px-6 py-3 text-left font-medium text-gray-900">
                          Nimi
                        </th>
                        <th className="px-6 py-3 text-left font-medium text-gray-900">
                          Ilmoittautumisaika
                        </th>
                        {quota.id === "queue" && (
                          <th className="px-6 py-3 text-left font-medium text-gray-900">
                            Kiintiö
                          </th>
                        )}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {quota.Signups.map((signup, index) => {
                        const rowStyle = signup.completedAt
                          ? "px-6 py-2"
                          : "px-6 py-2 text-gray-400";
                        return (
                          <tr key={signup.id}>
                            <td className={rowStyle}>{index + 1}.</td>
                            <td className={rowStyle}>{signup.name}</td>
                            <SignupRow signup={signup} rowStyle={rowStyle} />
                            {quota.id === "queue" && (
                              <td className={rowStyle}>
                                {OriginalQuotaTitle(
                                  event.Quotas,
                                  signup.originalQuotaId,
                                )}
                              </td>
                            )}
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                ) : (
                  <p className="px-6 py-4 text-gray-500">
                    Ei vielä osallistujia
                  </p>
                )}
              </div>
            </div>
          ),
      )}
    </div>
  );
}
