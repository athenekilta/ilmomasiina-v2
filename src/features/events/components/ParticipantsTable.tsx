import { useMemo } from "react";
import { SignupRow } from "@/features/events/components/SingupRow";
import { OriginalQuotaTitle } from "@/features/events/utils/utils";
import type { RouteOutput } from "@/types/types";
import { QUEUE_QUOTA_ID } from "@/features/events/utils/queueQuota";
import { useTranslations } from "@/i18n/I18nProvider";
import { eventAdminMessages } from "@/i18n/messages/eventAdmin";

/**
 * Every row is exactly one line high: the phone has no width to spare, and a
 * list where each signup wraps to two or three lines stops reading as a list.
 *
 * The layout is fixed rather than automatic, so each column's share is decided
 * here instead of by whatever the longest value in it happens to be. Left to
 * itself the browser gave a free-text answer whatever it wanted and squeezed
 * the name down to two letters with no ellipsis to show for it.
 *
 * The name is the column the list exists for, so it takes everything the
 * others do not need. The others are all things whose width is knowable: a
 * position, a timestamp. Free-text answers are not, so on a phone they step
 * aside entirely rather than eat the name — they come back at `sm`, where
 * there is room for them.
 *
 * The widths below are what they are because the content decides them: "999."
 * is 32px and the widest possible stamp, "31.12. 23.59.59", is 113px at
 * `text-xs`. Both are given their measured need and not a pixel more, because
 * every pixel they do not take is a pixel of name.
 *
 * Only the outer edges keep the card's 16px gutter — the columns between
 * share 8px, which is another twenty-odd characters of name on a phone.
 */
const POSITION = "w-14 pl-4 pr-0";
const NAME = "px-2";
const ANSWER = "w-[26%] px-2";
/** The timestamp is metadata, and metadata can be a size down. */
const TIME = "w-[8.3125rem] pl-1 pr-4 text-xs";
const ORIGIN = "w-[6.5rem] px-2 sm:pr-4";
/** Only from `sm` up: below it the name needs every pixel these would take. */
const WIDE_ONLY = "hidden sm:table-cell";

const headStyle = "label-caps truncate py-2 text-left text-stone-500";

export function ParticipantsTable({
  event,
}: {
  event: RouteOutput["events"]["getEventByID"];
}) {
  const messages = useTranslations(eventAdminMessages).participants;
  const publicQuestions = useMemo(
    () =>
      [...event.Questions]
        .filter((q) => q.public)
        .sort((a, b) => a.sortId - b.sortId),
    [event.Questions],
  );

  return (
    <div className="space-y-5">
      <h2 className="eyebrow text-brand-secondary">{messages.title}</h2>
      {event.Quotas.map(
        (quota) =>
          !(quota.id === QUEUE_QUOTA_ID && quota.signupCount == 0) && (
            <div key={quota.id} className="surface-muted overflow-hidden">
              <div className="text-brand-dark flex items-center justify-between border-b border-stone-300/70 px-4 py-3 text-base font-semibold">
                <h3 className="truncate">{quota.title}</h3>
                {quota.id !== QUEUE_QUOTA_ID ? (
                  <span className="ml-4 shrink-0 text-sm font-medium text-gray-700 tabular-nums">
                    {messages.signedUp(quota.signupCount)}
                  </span>
                ) : (
                  <span className="ml-4 shrink-0 text-sm font-medium text-gray-700 tabular-nums">
                    {messages.queued(quota.signupCount)}
                  </span>
                )}
              </div>
              <div className="overflow-x-auto">
                {quota.Signups.length > 0 ? (
                  <table className="w-full table-fixed text-sm">
                    <thead>
                      <tr className="border-b border-stone-300/70">
                        <th className={`${headStyle} ${POSITION}`}>
                          {messages.position}
                        </th>
                        {/* No width: the name takes whatever the rest leave. */}
                        <th className={`${headStyle} ${NAME}`}>
                          {messages.name}
                        </th>
                        {publicQuestions.map((q) => (
                          <th
                            key={q.id}
                            className={`${headStyle} ${ANSWER} ${WIDE_ONLY}`}
                            title={q.question}
                          >
                            {q.question}
                          </th>
                        ))}
                        <th className={`${headStyle} ${TIME}`}>
                          {messages.signupTime}
                        </th>
                        {quota.id === QUEUE_QUOTA_ID && (
                          <th className={`${headStyle} ${ORIGIN} ${WIDE_ONLY}`}>
                            {messages.quota}
                          </th>
                        )}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-300/50">
                      {quota.Signups.map((signup, index) => {
                        const rowStyle = signup.completedAt
                          ? "py-1.5"
                          : "py-1.5 text-gray-500";
                        const name = signup.completedAt
                          ? signup.name
                          : messages.unconfirmed;
                        return (
                          <tr key={signup.id ?? `${quota.id}-${index}`}>
                            <td
                              className={`${rowStyle} ${POSITION} truncate tabular-nums`}
                            >
                              {index + 1}.
                            </td>
                            <td
                              className={`${rowStyle} ${NAME} truncate`}
                              title={name ?? undefined}
                            >
                              {name}
                            </td>
                            {publicQuestions.map((q) => {
                              const raw = q.Answers.find(
                                (a) => a.signupId === signup.id,
                              )?.answer;
                              const text = raw?.trim() ?? "";
                              return (
                                <td
                                  key={q.id}
                                  className={`${rowStyle} ${ANSWER} ${WIDE_ONLY} truncate`}
                                  title={text || undefined}
                                >
                                  {text || "—"}
                                </td>
                              );
                            })}
                            <SignupRow
                              signup={signup}
                              rowStyle={`${rowStyle} ${TIME}`}
                            />
                            {quota.id === QUEUE_QUOTA_ID && (
                              <td
                                className={`${rowStyle} ${ORIGIN} ${WIDE_ONLY} truncate`}
                              >
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
                  <p className="px-4 py-3 text-sm text-gray-600">
                    {quota.id === QUEUE_QUOTA_ID && quota.signupCount > 0
                      ? messages.hiddenUntilConfirmed
                      : messages.noParticipants}
                  </p>
                )}
              </div>
            </div>
          ),
      )}
    </div>
  );
}
