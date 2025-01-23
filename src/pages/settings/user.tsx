import { ProtectedRoute } from "@/features/auth/components/ProtectedRoute";
import { Layout } from "@/features/layout/Layout";
import { PageHead } from "@/features/layout/PageHead";
import { UserSettingsForm } from "@/features/auth/components/UserSettingsFrom";
export default function UserSettings() {
  return (
    <ProtectedRoute>
      <PageHead title="Asetukset" />
      <Layout>
        <UserSettingsForm />
      </Layout>
    </ProtectedRoute>
  );
}
