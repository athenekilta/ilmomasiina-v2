import { Button } from "@/components/Button";
import { ProtectedRoute } from "@/features/auth/components/ProtectedRoute";
import { Layout } from "@/features/layout/Layout";
import { PageHead } from "@/features/layout/PageHead";
import { routes } from "@/utils/routes";
import { useTranslations } from "@/i18n/I18nProvider";
import { authMessages } from "@/i18n/messages/auth";

export default function RequestedPasswordChangePage() {
  const messages = useTranslations(authMessages);

  return (
    <ProtectedRoute unauthenticatedOnly>
      <PageHead title={messages.passwordChange.requestedTitle} />
      <Layout>
        <div className="surface-panel mx-auto mt-8 flex w-full max-w-lg flex-col items-center gap-6 p-6 sm:mt-10 sm:p-8">
          <h1 className="eyebrow text-brand-secondary text-center sm:text-base">
            {messages.passwordChange.requestedTitle}
          </h1>

          <p className="text-center text-gray-600">
            {messages.passwordChange.requestedDescription}
          </p>

          <Button.Link href={routes.auth.login} type="submit" color="primary">
            {messages.actions.login}
          </Button.Link>
        </div>
      </Layout>
    </ProtectedRoute>
  );
}
