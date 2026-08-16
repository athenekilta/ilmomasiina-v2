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
      <h2 className="text-brand-dark text-lg font-semibold">Ilmonneet</h2>
      {event.Quotas.map(
        (quota) =>
          !(quota.id == "queue" && quota.Signups.length == 0) && (
            <div key={quota.id} className="surface-panel">
              <div className="text-brand-dark flex items-center justify-between border-b border-stone-200 px-4 py-3 text-base font-semibold">
                <h3 className="truncate">{quota.title}</h3>
                {quota.id !== "queue" ? (
                  <span className="ml-4 shrink-0 text-sm font-medium text-gray-700 tabular-nums">
                    {quota.Signups.length} / {quota.size ?? "∞"}
                  </span>
                ) : (
                  <span className="ml-4 shrink-0 text-sm font-medium text-gray-700 tabular-nums">
                    {quota.Signups.length} jonossa
                  </span>
                )}
              </div>
              <div className="overflow-x-auto">
                {quota.Signups.length > 0 ? (
                  <table className="min-w-full text-sm">
                    <thead>
                      <tr className="border-b border-stone-200">
                        <th className="text-brand-dark px-3 py-2 text-left text-xs font-semibold tracking-wide uppercase">
                          Sija
                        </th>
                        <th className="text-brand-dark px-3 py-2 text-left text-xs font-semibold tracking-wide uppercase">
                          Nimi
                        </th>
                        {publicQuestions.map((q) => (
                          <th
                            key={q.id}
                            className="text-brand-dark max-w-44 px-3 py-2 text-left text-xs font-semibold tracking-wide uppercase"
                            title={q.question}
                          >
                            <span className="line-clamp-3 whitespace-normal">
                              {q.question}
                            </span>
                          </th>
                        ))}
                        <th className="text-brand-dark px-3 py-2 text-left text-xs font-semibold tracking-wide uppercase">
                          Ilmoittautumisaika
                        </th>
                        {quota.id === "queue" && (
                          <th className="text-brand-dark px-3 py-2 text-left text-xs font-semibold tracking-wide uppercase">
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
