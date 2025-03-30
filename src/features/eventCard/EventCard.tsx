import Link from "next/link";
import { Icon } from "@/components/Icon";
import { routes } from "@/utils/routes";
import { Event, Quota, Signup } from "@prisma/client";

// Define a simpler type that matches the manual enrichment in the events router
type EnrichedQuota = Quota & {
  Signups: Signup[];
  signupCount: number;
};

type EnrichedEvent = Event & {
  Quotas: EnrichedQuota[];
};

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

export function EventCard({ event, isAdmin }: { 
  event: EnrichedEvent; 
  isAdmin: boolean; 
}) {
  // Determine registration status for styling
  const now = new Date();
  const startDate = new Date(event.registrationStartDate);
  const endDate = new Date(event.registrationEndDate);
  const isRegistrationOpen = startDate <= now && endDate >= now;
  const isRegistrationClosed = endDate < now;
  const isRegistrationUpcoming = startDate > now;
  
  // Determine if all quotas are full
  const hasQuotas = event.Quotas.length > 0;
  const areQuotasFull = hasQuotas && event.Quotas.every(quota => 
    quota.size !== null && quota.signupCount >= quota.size
  );

  return (
    <a href={`events/${event.id}`}>
    {/* Make whole card clickable with <a> tag */}
      <div
        className={`rounded-lg border shadow-sm transition-all duration-300 hover:shadow-md ${
          event.draft 
            ? "border-amber-300 bg-amber-50 dark:border-amber-700 dark:bg-amber-900/20" 
            : "border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800"
        }`}
      >
        <div className="bg-brand-darkbeige p-5">
          {/* Card Header with Title and Status */}
          <div className="mb-3">
            <t 
              className="text-xl font-bold text-gray-900 dark:text-white"
            >
              {event.title}
            </t>
            <div className="mt-2 flex flex-wrap gap-2">
              {event.draft && (
                <span className="inline-flex items-center rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-medium text-amber-800 dark:bg-amber-800/30 dark:text-amber-200">
                  <Icon icon="draft" className="mr-1 h-3 w-3" />
                  Luonnos
                </span>
              )}
              {isRegistrationOpen && (
                <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800 dark:bg-green-800/30 dark:text-green-200">
                  <Icon icon="check" className="mr-1 h-3 w-3" />
                  Ilmoittautuminen auki
                </span>
              )}
              {isRegistrationClosed && (
                <span className="inline-flex items-center rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-medium text-red-800 dark:bg-red-800/30 dark:text-red-200">
                  <Icon icon="error" className="mr-1 h-3 w-3" />
                  Ilmoittautuminen sulkeutunut
                </span>
              )}
              {isRegistrationUpcoming && (
                <span className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800 dark:bg-blue-800/30 dark:text-blue-200">
                  <Icon icon="access_time" className="mr-1 h-3 w-3" />
                  Tuleva tapahtuma
                </span>
              )}
              {areQuotasFull && (
                <span className="inline-flex items-center rounded-full bg-purple-100 px-2.5 py-0.5 text-xs font-medium text-purple-800 dark:bg-purple-800/30 dark:text-purple-200">
                  <Icon icon="person" className="mr-1 h-3 w-3" />
                  Täynnä
                </span>
              )}
            </div>
          </div>
          
          {/* Event Details */}
          <div className="mb-4 space-y-2 text-sm text-gray-700 dark:text-gray-300">
            <div className="flex items-center">
              <Icon icon="calendar_today" className="mr-2 h-4 w-4 flex-shrink-0 text-gray-500 dark:text-gray-400" />
              <span>{new Date(event.date).toLocaleDateString('fi-FI')}</span>
            </div>
            
            <div className="flex items-start">
              <Icon icon="event_available" className="mr-2 h-4 w-4 flex-shrink-0 text-gray-500 dark:text-gray-400" />
              <span>{formatRegistration(event.registrationStartDate, event.registrationEndDate)}</span>
            </div>
            
            {event.location && (
              <div className="flex items-center">
                <Icon icon="location_on" className="mr-2 h-4 w-4 flex-shrink-0 text-gray-500 dark:text-gray-400" />
                <span>{event.location}</span>
              </div>
            )}
          </div>
          
          {/* Quotas */}
          {event.Quotas.length > 0 && (
            <div className="mb-4">
              <h3 className="mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">Kiintiöt</h3>
              <div className="space-y-1">
                {event.Quotas.map((quota) => (
                  <div key={quota.id} className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">{quota.title}</span>
                    <div className="ml-2 flex items-center">
                      <span className="text-sm font-medium">
                        {quota.signupCount} / {quota.size ?? "∞"}
                      </span>
                      {quota.size && (
                        <div className="ml-2 h-2 w-16 overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
                          <div 
                            className={`h-full ${
                              quota.signupCount >= quota.size 
                                ? "bg-red-500" 
                                : quota.signupCount / quota.size > 0.75
                                  ? "bg-yellow-500"
                                  : "bg-green-500"
                            }`} 
                            style={{ width: `${Math.min(quota.signupCount / quota.size * 100, 100)}%` }}
                          ></div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* Admin Actions */}
          {isAdmin && (
            <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
              <Link
                href={routes.app.events.edit(event.id)}
                className="inline-flex items-center rounded-md bg-blue-50 px-3 py-1.5 text-sm font-medium text-blue-700 hover:bg-blue-100 dark:bg-blue-900/30 dark:text-blue-300 dark:hover:bg-blue-900/50"
              >
                <Icon icon="edit" className="mr-1.5 h-4 w-4" />
                Muokkaa
              </Link>
            </div>
          )}
        </div>
      </div>
    </a>
  );
}
