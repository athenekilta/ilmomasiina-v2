import { ProtectedRoute } from "@/features/auth/components/ProtectedRoute";
import { LoginForm } from "@/features/auth/components/LoginForm";
import { Layout } from "@/features/layout/Layout";
import { PageHead } from "@/features/layout/PageHead";
import { useTranslations } from "@/i18n/I18nProvider";
import { authMessages } from "@/i18n/messages/auth";

export default function LoginPage() {
  const messages = useTranslations(authMessages);

  return (
    <ProtectedRoute unauthenticatedOnly>
      <PageHead title={messages.login.title} />
      <Layout>
        <div className="surface-panel mx-auto mt-8 flex max-w-md flex-col items-center gap-6 p-6 sm:mt-10 sm:p-8">
          <h1 className="eyebrow text-brand-secondary sm:text-base">
            {messages.login.title}
          </h1>
          <LoginForm />
        </div>
      </Layout>
    </ProtectedRoute>
  );
}
