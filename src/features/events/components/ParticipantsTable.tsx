/* Refaktoroitu erilleen [eventId].tsx:stä. Tätä komponenttia käytetään siellä.
Tämän ja SignupsTablen voisi varmaan yhdistää*/

import { useMemo } from "react";
import { SignupRow } from "@/features/events/components/SingupRow";
import { OriginalQuotaTitle } from "@/features/events/utils/utils";
import type { RouteOutput } from "@/types/types";

export function ParticipantsTable({
  event,
}: {
  event: RouteOutput["events"]["getEventByID"];
}) {
  const publicQuestions = useMemo(
    () =>
      [...event.Questions]
        .filter((q) => q.public)
        .sort((a, b) => a.sortId - b.sortId),
    [event.Questions],
  );

  return (
    <div className="space-y-5">
      <h2 className="text-lg font-semibold text-brand-dark">Ilmonneet</h2>
      {event.Quotas.map(
        (quota) =>
          !(quota.id == "queue" && quota.Signups.length == 0) && (
            <div
              key={quota.id}
              className="surface-panel"
            >
              <div className="flex justify-between items-center border-b border-stone-200 p-3 text-base font-medium text-brand-dark">
                <h3 className="w-full text-wrap">{quota.title}</h3>
                {quota.id !== "queue" && (
                  <>
                    <span className="text-md mx-5 text-nowrap font-normal text-gray-700">
                      {quota.Signups.length} / {quota.size ?? "∞"}
                    </span>
                    {quota.size && (
                      <div className="bg-brand-beige ml-auto h-1.5 w-60 overflow-hidden rounded-sm">
                        <div
                          className={`h-full rounded-sm ${
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
                      <tr className="border-b border-stone-200">
                        <th className="px-3 py-2 text-left text-xs font-semibold tracking-wide text-brand-dark uppercase">
                          Sija
                        </th>
                        <th className="px-3 py-2 text-left text-xs font-semibold tracking-wide text-brand-dark uppercase">
                          Nimi
                        </th>
                        {publicQuestions.map((q) => (
                          <th
                            key={q.id}
                            className="max-w-44 px-3 py-2 text-left text-xs font-semibold tracking-wide text-brand-dark uppercase"
                            title={q.question}
                          >
                            <span className="line-clamp-3 whitespace-normal">
                              {q.question}
                            </span>
                          </th>
                        ))}
                        <th className="px-3 py-2 text-left text-xs font-semibold tracking-wide text-brand-dark uppercase">
                          Ilmoittautumisaika
                        </th>
                        {quota.id === "queue" && (
                          <th className="px-3 py-2 text-left text-xs font-semibold tracking-wide text-brand-dark uppercase">
                            Kiintiö
                          </th>
                        )}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-200">
                      {quota.Signups.map((signup, index) => {
                        const rowStyle = signup.completedAt
                          ? "px-3 py-1.5"
                          : "px-3 py-1.5 text-gray-500";
                        return (
                          <tr key={signup.id}>
                            <td className={rowStyle}>{index + 1}.</td>
                            <td className={rowStyle}>{signup.name}</td>
                            {publicQuestions.map((q) => {
                              const raw = q.Answers.find(
                                (a) => a.signupId === signup.id,
                              )?.answer;
                              const text = raw?.trim() ?? "";
                              return (
                                <td
                                  key={q.id}
                                  className={`${rowStyle} max-w-44`}
                                  title={text || undefined}
                                >
                                  <span className="line-clamp-3 wrap-break-word whitespace-pre-wrap">
                                    {text || "—"}
                                  </span>
                                </td>
                              );
                            })}
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
                  <p className="px-3 py-3 text-sm text-gray-600">
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
