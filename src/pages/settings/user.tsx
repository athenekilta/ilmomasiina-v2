import { Button } from "@/components/Button";
import { ProtectedRoute } from "@/features/auth/components/ProtectedRoute";
import { UserSettingsForm } from "@/features/auth/components/UserSettingsForm";
import { useManagementUser } from "@/features/auth/hooks/useManagementUser";
import { Layout } from "@/features/layout/Layout";
import { PageHead } from "@/features/layout/PageHead";
import { ManagementToolbar } from "@/features/layout/ManagementToolbar";
import { useTranslations } from "@/i18n/I18nProvider";
import { settingsMessages } from "@/i18n/messages/settings";

export default function UserSettings() {
  const messages = useTranslations(settingsMessages);
  const user = useManagementUser();

  return (
    <ProtectedRoute>
      <PageHead title={messages.title} />
      <Layout>
        <ManagementToolbar />
        <div className="space-y-5">
          <header>
            <h1 className="text-brand-dark text-2xl font-semibold tracking-tight">
              {messages.title}
            </h1>
          </header>

          {user.isLoading && !user.data && (
            <p role="status" className="text-stone-600">
              {messages.loading}
            </p>
          )}
          {user.error && (
            <div className="space-y-3">
              <p role="alert" className="text-danger">
                {messages.loadFailed}
              </p>
              <Button
                type="button"
                loading={user.isFetching}
                onClick={() => void user.refetch()}
              >
                {messages.retry}
              </Button>
            </div>
          )}
          {user.data ? (
            <>
              <section
                aria-label={messages.signedInAs}
                className="surface-panel p-4 sm:p-5"
              >
                <h2 className="text-sm text-stone-600">
                  {messages.signedInAs}
                </h2>
                <p className="text-brand-dark mt-1 font-semibold break-words">
                  {user.data.name}
                </p>
                <p className="break-words">{user.data.email}</p>
                <p className="mt-2 text-sm text-stone-600">
                  {messages.role}: {messages.roles[user.data.role]}
                </p>
              </section>
              <UserSettingsForm key={user.data.id} />
            </>
          ) : null}
        </div>
      </Layout>
    </ProtectedRoute>
  );
}
