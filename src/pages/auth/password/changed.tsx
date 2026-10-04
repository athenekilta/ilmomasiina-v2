import { Layout } from "@/features/layout/Layout";
import { PageHead } from "@/features/layout/PageHead";
import { Button } from "@/components/Button";
import { routes } from "@/utils/routes";
import { useTranslations } from "@/i18n/I18nProvider";
import { authMessages } from "@/i18n/messages/auth";

export default function ChangePassword() {
  const messages = useTranslations(authMessages);

  return (
    <>
      <PageHead title={messages.passwordChange.title} />
      <Layout>
        <div className="surface-panel mx-auto mt-8 flex w-full max-w-lg flex-col items-center gap-6 p-6 sm:mt-10 sm:p-8">
          <h1 className="text-primary-950 text-center text-4xl font-semibold tracking-tight">
            {messages.passwordChange.title}
          </h1>

          <p className="text-center text-gray-600">
            {messages.passwordChange.changedDescription}
          </p>

          <Button.Link href={routes.auth.login} type="submit" color="primary">
            {messages.actions.login}
          </Button.Link>
        </div>
      </Layout>
    </>
  );
}
