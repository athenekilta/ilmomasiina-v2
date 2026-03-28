import Link from "next/link";
import { Icon } from "@/components/Icon";
import { routes } from "@/utils/routes";
import type { Event, Quota, Signup } from "@/generated/prisma/client";
import { formatDateTime, formatRegistration } from "@/utils/format";
import { Button } from "@/components/Button";
import { Divider } from "@/components/Divider";

type EnrichedQuota = Quota & {
  Signups: Signup[];
  signupCount: number;
};

type EnrichedEvent = Event & {
  Quotas: EnrichedQuota[];
};

export function EventCard({
  event,
  isAdmin,
}: {
  event: EnrichedEvent;
  isAdmin: boolean;
}) {
  const now = new Date();
  const endDate = new Date(event.registrationEndDate);
  const isRegistrationClosed = endDate < now;

  return (
    <article
      className={`flex h-full min-h-0 w-full min-w-0 flex-col rounded-control border shadow-soft transition-shadow duration-200 hover:shadow-card ${
        event.draft
          ? "border-amber-400 bg-amber-100"
          : "border-stone-300 bg-brand-light"
      }`}
    >
      <div className="flex min-h-0 flex-1 flex-col gap-4 p-5 sm:p-6">
        <Link
          href={`events/${event.id}`}
          className="group flex min-h-0 min-w-0 flex-1 flex-col rounded-sm focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-brand-secondary focus-visible:ring-offset-2 focus-visible:ring-offset-brand-light"
        >
          <div className="shrink-0">
            <h2 className="text-xl font-bold tracking-tight text-brand-dark group-hover:text-brand-secondary sm:text-2xl">
              {event.title}
            </h2>

            <div className="mt-3 space-y-1.5 text-sm leading-relaxed text-gray-700 sm:text-base">
              <p className="min-w-0 break-words">
                <span className="font-semibold text-brand-dark">Ajankohta:</span>{" "}
                {formatDateTime(event.date, {
                  dateStyle: "medium",
                  timeStyle: "short",
                })}
              </p>
              {event.location ? (
                <p className="min-w-0 break-words">
                  <span className="font-semibold text-brand-dark">Paikka:</span>{" "}
                  {event.location}
                </p>
              ) : null}
            </div>

            <div className="mt-3">
              {isRegistrationClosed ? (
                <span className="inline-block text-sm font-semibold text-brand-danger">
                  Ilmoittautuminen sulkeutunut
                </span>
              ) : (
                <span className="inline-block text-sm font-semibold text-brand-primary">
                  {formatRegistration(
                    event.registrationStartDate,
                    event.registrationEndDate,
                  )}
                </span>
              )}
            </div>

            {event.draft && (
              <div className="mt-4">
                <span className="inline-flex items-center rounded-control border border-amber-400 bg-amber-200 px-2.5 py-1 text-xs font-bold tracking-wide text-amber-950 uppercase">
                  <Icon icon="draft" className="mr-1.5 h-3.5 w-3.5" />
                  Luonnos
                </span>
              </div>
            )}
          </div>

          <div className="min-h-2 flex-1" aria-hidden />

          {event.Quotas.length > 0 && (
            <div className="mt-auto shrink-0 border-t border-stone-200 pt-5">
              <h3 className="mb-3 text-xs font-bold tracking-widest text-brand-secondary uppercase">
                Kiintiöt
              </h3>
              <ul className="flex list-none flex-col gap-2.5 p-0">
                {event.Quotas.map((quota) => (
                  <li
                    key={quota.id}
                    className="flex items-center justify-between gap-3 text-sm sm:text-base"
                  >
                    <span className="font-semibold text-brand-dark">
                      {quota.title}
                    </span>
                    <span className="shrink-0 text-right">
                      <span className="tabular-nums text-gray-700">
                        {quota.signupCount} / {quota.size ?? "\u221E"}
                      </span>
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </Link>

        {isAdmin && (
          <div className="mt-auto shrink-0">
            <Divider spacingY="lg" tone="strong" />
            <div>
              <Button.Link
                href={routes.app.events.edit(event.id)}
                variant="filled"
                color="primary"
                size="small"
                startIcon={<Icon icon="edit" size={18} />}
                className="w-auto min-w-30 justify-center"
              >
                Muokkaa
              </Button.Link>
            </div>
          </div>
        )}
      </div>
    </article>
  );
}
