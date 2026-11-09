import { Layout } from "@/features/layout/Layout";
import { PageHead } from "@/features/layout/PageHead";
import { EmailVerifier } from "@/features/auth/components/EmailVerifier";
import { useTranslations } from "@/i18n/I18nProvider";
import { authMessages } from "@/i18n/messages/auth";
export default function VerifyEmailPage() {
  const messages = useTranslations(authMessages);

  return (
    <>
      <PageHead title={messages.emailVerification.title} />
      <Layout>
        <div className="surface-panel mx-auto mt-8 flex w-full max-w-lg flex-col items-center gap-6 p-6 sm:mt-10 sm:p-8">
          <h1 className="eyebrow text-brand-secondary sm:text-base">
            {messages.emailVerification.title}
          </h1>
          <EmailVerifier />
        </div>
      </Layout>
    </>
  );
}
