import { ProtectedRoute } from "@/features/auth/components/ProtectedRoute";
import { ManagementEventList } from "@/features/eventList/ManagementEventList";
import { Layout } from "@/features/layout/Layout";
import { ManagementToolbar } from "@/features/layout/ManagementToolbar";
import { PageHead } from "@/features/layout/PageHead";
import { useTranslations } from "@/i18n/I18nProvider";
import { adminMessages } from "@/i18n/messages/admin";

export default function ManageEvents() {
  const messages = useTranslations(adminMessages);

  return (
    <ProtectedRoute eventEditorOnly>
      <PageHead title={messages.title} />
      <Layout>
        <ManagementToolbar />
        <header className="mb-6">
          <h1 className="eyebrow text-brand-secondary sm:text-base">
            {messages.title}
          </h1>
        </header>
        <ManagementEventList />
      </Layout>
    </ProtectedRoute>
  );
}
