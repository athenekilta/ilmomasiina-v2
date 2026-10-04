import { ProtectedRoute } from "@/features/auth/components/ProtectedRoute";
import { EventForm } from "@/features/events/components/EventForm";
import { Layout } from "@/features/layout/Layout";
import { PageHead } from "@/features/layout/PageHead";
import { useTranslations } from "@/i18n/I18nProvider";
import { eventAdminMessages } from "@/i18n/messages/eventAdmin";

export default function CreateEvent() {
  const messages = useTranslations(eventAdminMessages);

  return (
    <ProtectedRoute eventEditorOnly>
      <PageHead title={messages.pages.createTitle} />
      <Layout>
        <div className="surface-panel mx-auto mt-4 w-full max-w-3xl sm:mt-6">
          <EventForm />
        </div>
      </Layout>
    </ProtectedRoute>
  );
}
