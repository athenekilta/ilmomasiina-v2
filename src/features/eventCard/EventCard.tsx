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
    <article className="flex h-full w-full min-w-0 flex-col">
      <div className="flex h-full flex-col gap-4 p-5 sm:p-6">
        <Link
          href={`events/${event.id}`}
          className="group focus-visible:ring-brand-secondary flex min-w-0 flex-1 flex-col rounded-sm focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-hidden"
        >
          <div className="shrink-0">
            <h2 className="text-brand-dark group-hover:text-brand-secondary text-xl font-bold tracking-tight sm:text-2xl">
              {event.title}
            </h2>

            <div className="mt-3 space-y-1.5 text-sm leading-relaxed text-gray-700 sm:text-base">
              <p className="min-w-0 break-words">
                <span className="text-brand-dark font-semibold">
                  Ajankohta:
                </span>{" "}
                {formatDateTime(event.date, {
                  dateStyle: "medium",
                  timeStyle: "short",
                })}
              </p>
              {event.location ? (
                <p className="min-w-0 break-words">
                  <span className="text-brand-dark font-semibold">Paikka:</span>{" "}
                  {event.location}
                </p>
              ) : null}
            </div>

            <div className="mt-3">
              {isRegistrationClosed ? (
                <span className="text-brand-danger inline-block text-sm font-semibold">
                  Ilmoittautuminen sulkeutunut
                </span>
              ) : (
                <span className="text-brand-primary inline-block text-sm font-semibold">
                  {formatRegistration(
                    event.registrationStartDate,
                    event.registrationEndDate,
                  )}
                </span>
              )}
            </div>

            {event.draft && (
              <div className="mt-4">
                <span className="rounded-control inline-flex items-center border border-amber-400 bg-amber-200 px-2.5 py-1 text-xs font-bold tracking-wide text-amber-950 uppercase">
                  <Icon icon="draft" className="mr-1.5 h-3.5 w-3.5" />
                  Luonnos
                </span>
              </div>
            )}
          </div>

          <div className="flex-1" aria-hidden />

          {event.Quotas.length > 0 && (
            <div className="mt-5 border-t border-stone-200 pt-5">
              <h3 className="text-brand-secondary mb-3 text-xs font-bold tracking-widest uppercase">
                Kiintiöt
              </h3>
              <ul className="flex list-none flex-col gap-2.5 p-0">
                {event.Quotas.map((quota) => (
                  <li
                    key={quota.id}
                    className="flex items-center justify-between gap-3 text-sm sm:text-base"
                  >
                    <span className="text-brand-dark font-semibold">
                      {quota.title}
                    </span>
                    <span className="shrink-0 text-right">
                      <span className="text-gray-700 tabular-nums">
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
          <div className="shrink-0">
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
