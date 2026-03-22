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
    <div
      className={`rounded-xl shadow-xs transition-all duration-300 hover:shadow-md ${
        event.draft
          ? "border-amber-300 bg-amber-50 dark:border-amber-700 dark:bg-amber-900/20"
          : "bg-brand-light border-gray-200 dark:border-gray-700 dark:bg-gray-800"
      }`}
    >
      <div className="flex flex-col p-4">
        <Link href={`events/${event.id}`}>
          <div className="flex-row justify-between sm:flex">
            <div>
              <h2 className="text-brand-primary upper text-xl font-bold">
                {event.title}
              </h2>
              <span className="text-brand-dark text-xs">
                {formatDateTime(event.date, {
                  dateStyle: "medium",
                  timeStyle: "short",
                })}
                {event.location && <span> - {event.location}</span>}
              </span>
            </div>
            <div className="self-start">
              {isRegistrationClosed ? (
                <span className="text-brand-danger text-xs sm:text-sm">
                  Ilmoittautuminen sulkeutunut
                </span>
              ) : (
                <span className="text-brand-primary mt-2 text-xs sm:text-sm">
                  {formatRegistration(
                    event.registrationStartDate,
                    event.registrationEndDate,
                  )}
                </span>
              )}
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {event.draft && (
              <span className="inline-flex items-center rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-medium text-amber-800 dark:bg-amber-800/30 dark:text-amber-200">
                <Icon icon="draft" className="mr-1 h-3 w-3" />
                Luonnos
              </span>
            )}
          </div>

          {event.Quotas.length > 0 && (
            <div className="mt-1 flex flex-col gap-1">
              {event.Quotas.map((quota) => (
                <div
                  key={quota.id}
                  className="text-brand-dark flex items-center justify-between text-sm"
                >
                  <span className="text-sm font-semibold">{quota.title}</span>
                  <div className="ml-2 flex items-center">
                    <span className="text-sm font-normal">
                      {quota.signupCount} / {quota.size ?? "\u221E"}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Link>

        {isAdmin && (
          <>
            <Divider />
            <Button.Link
              href={routes.app.events.edit(event.id)}
              variant="filled"
              color="neutral"
              size="small"
              startIcon={<Icon icon="edit" className="h-4 w-4" />}
              className="w-36"
            >
              Muokkaa
            </Button.Link>
          </>
        )}
      </div>
    </div>
  );
}
