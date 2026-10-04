import { RequestChangePasswordForm } from "@/features/auth/components/RequestChangePasswordForm";
import { ProtectedRoute } from "@/features/auth/components/ProtectedRoute";
import { Layout } from "@/features/layout/Layout";
import { PageHead } from "@/features/layout/PageHead";
import { useTranslations } from "@/i18n/I18nProvider";
import { authMessages } from "@/i18n/messages/auth";

export default function RequestChangePassword() {
  const messages = useTranslations(authMessages);

  return (
    <ProtectedRoute unauthenticatedOnly>
      <PageHead title={messages.passwordChange.requestTitle} />
      <Layout>
        <div className="surface-panel mx-auto mt-8 flex w-full max-w-lg flex-col items-center gap-6 p-6 sm:mt-10 sm:p-8">
          <h1 className="text-primary-950 text-center text-4xl font-semibold tracking-tight">
            {messages.passwordChange.requestTitle}
          </h1>

          <p className="text-center text-gray-600">
            {messages.passwordChange.requestDescription}
          </p>
          <RequestChangePasswordForm />
        </div>
      </Layout>
    </ProtectedRoute>
  );
}
