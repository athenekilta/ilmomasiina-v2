import { useManagementUser } from "@/features/auth/hooks/useManagementUser";
import { IdentityPromptCard } from "@/features/eventCard/IdentityPromptCard";
import { EventListLoading } from "@/features/eventList/EventListLoading";
import { ManagementToolbar } from "@/features/layout/ManagementToolbar";
import { PublicEventList } from "@/features/eventList/PublicEventList";
import { Layout } from "@/features/layout/Layout";
import { PageHead } from "@/features/layout/PageHead";
import { ManagementRole } from "@/generated/prisma";
import { useNow } from "@/hooks/useNow";
import { useLocale, useTranslations } from "@/i18n/I18nProvider";
import { publicEventsMessages } from "@/i18n/messages/events";
import { api } from "@/utils/api";

export default function DesktopPage() {
  const locale = useLocale();
  const messages = useTranslations(publicEventsMessages);
  // Re-render cards and time-derived grouping without refetching event data.
  useNow();
  const user = useManagementUser();
  const canEditEvents =
    user.data?.role === ManagementRole.event_editor ||
    user.data?.role === ManagementRole.superadmin;
  const eventsQuery = api.events.getEvents.useQuery({ locale });

  return (
    <>
      <PageHead title={messages.list.title} />
      <Layout>
        <ManagementToolbar />
        {!eventsQuery.isLoading && eventsQuery.data ? (
          <div className="flex-col pb-4">
            <IdentityPromptCard />
            <PublicEventList
              events={eventsQuery.data}
              isAdmin={canEditEvents}
            />
          </div>
        ) : (
          <EventListLoading />
        )}
      </Layout>
    </>
  );
}
