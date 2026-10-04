import { ProtectedRoute } from "@/features/auth/components/ProtectedRoute";
import { Layout } from "@/features/layout/Layout";
import { PageHead } from "@/features/layout/PageHead";
import { UserSettingsForm } from "@/features/auth/components/UserSettingsFrom";
import { useTranslations } from "@/i18n/I18nProvider";
import { accountMessages } from "@/i18n/messages/account";
export default function UserSettings() {
  const messages = useTranslations(accountMessages);

  return (
    <ProtectedRoute>
      <PageHead title={messages.settings.title} />
      <Layout>
        <UserSettingsForm />
      </Layout>
    </ProtectedRoute>
  );
}
