import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/Button";
import { Input } from "@/components/Input";
import { useManagementUser } from "@/features/auth/hooks/useManagementUser";
import { groupEventsForList } from "@/features/eventCard/eventOrder";
import { ManagementRole } from "@/generated/prisma";
import { useNow } from "@/hooks/useNow";
import { useLocale, useTranslations } from "@/i18n/I18nProvider";
import { publicEventsMessages } from "@/i18n/messages/events";
import { adminMessages } from "@/i18n/messages/admin";
import { api } from "@/utils/api";
import { routes } from "@/utils/routes";
import { EventGrid } from "./EventGrid";
import { EventListLoading } from "./EventListLoading";
import { ManagementFilters } from "./ManagementFilters";

export function ManagementEventList() {
  const locale = useLocale();
  const messages = useTranslations(publicEventsMessages);
  const admin = useTranslations(adminMessages);
  const user = useManagementUser();
  const canEditEvents =
    user.data?.role === ManagementRole.event_editor ||
    user.data?.role === ManagementRole.superadmin;
  useNow();
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState({
    includeDrafts: true,
    includeOlderEvents: false,
  });
  const eventsQuery = api.events.getEventsAdmin.useQuery(
    { locale, ...filters },
    { enabled: canEditEvents },
  );
  const query = search.trim().toLocaleLowerCase(locale);
  const matchingEvents = (eventsQuery.data ?? []).filter((event) =>
    event.title.toLocaleLowerCase(locale).includes(query),
  );
  const { open, closed } = groupEventsForList(matchingEvents);

  if (!canEditEvents) return null;

  return (
    <section aria-label={messages.list.eventList}>
      <div className="mb-4">
        <Button.Link
          href={routes.app.events.create}
          variant="filled"
          color="primary"
          startIcon={<Plus size={20} strokeWidth={2.25} />}
        >
          {messages.list.createEvent}
        </Button.Link>
      </div>
      <div className="mb-4">
        <Input
          type="search"
          fullWidth
          aria-label={admin.searchEvents}
          placeholder={admin.searchEvents}
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />
      </div>
      <ManagementFilters value={filters} onChange={setFilters} />
      <div className="mt-6" aria-busy={eventsQuery.isFetching}>
        {eventsQuery.isLoading ? (
          <EventListLoading compact />
        ) : eventsQuery.error ? (
          <div className="space-y-3">
            <p role="alert" className="text-sm text-red-700">
              {messages.detail.refreshFailed}
            </p>
            <Button
              type="button"
              onClick={() => void eventsQuery.refetch()}
              loading={eventsQuery.isFetching}
            >
              {messages.detail.retry}
            </Button>
          </div>
        ) : matchingEvents.length ? (
          <EventGrid events={[...open, ...closed]} isAdmin />
        ) : (
          <p className="text-sm text-stone-600">{admin.noEvents}</p>
        )}
      </div>
    </section>
  );
}
