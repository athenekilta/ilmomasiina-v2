import { Icon } from "@/components/Icon";
import { RequestEmailVerificationForm } from "@/features/auth/components/RequestEmailVerificationForm";
import { Layout } from "@/features/layout/Layout";
import { PageHead } from "@/features/layout/PageHead";
import { useTranslations } from "@/i18n/I18nProvider";
import { authMessages } from "@/i18n/messages/auth";

export default function RequestEmailVerification() {
  const messages = useTranslations(authMessages);

  return (
    <>
      <PageHead title={messages.emailVerification.requestTitle} />
      <Layout>
        <div className="surface-panel mx-auto mt-8 flex w-full max-w-lg flex-col items-center gap-6 p-6 sm:mt-10 sm:p-8">
          <h1 className="text-primary-950 text-center text-4xl font-semibold tracking-tight">
            {messages.emailVerification.title}
          </h1>

          <div className="mb-2 flex items-center gap-4 rounded-lg bg-slate-50 p-4 text-sm">
            <Icon icon="info" className="text-primary" />
            <div className="space-y-4">
              <p>
                <b className="font-semibold">
                  {messages.emailVerification.checkEmail}
                </b>{" "}
                {messages.emailVerification.initialEmailSent}
              </p>
              <p>{messages.emailVerification.resendInstructions}</p>
            </div>
          </div>

          <RequestEmailVerificationForm />
        </div>
      </Layout>
    </>
  );
}
