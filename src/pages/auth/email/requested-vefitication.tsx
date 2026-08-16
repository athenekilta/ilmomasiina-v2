import { Button } from "@/components/Button";
import { Layout } from "@/features/layout/Layout";
import { PageHead } from "@/features/layout/PageHead";
import { routes } from "@/utils/routes";

export default function RequestedEmailVerificationPage() {
  return (
    <>
      <PageHead title="Verify your email" />
      <Layout>
        <div className="surface-panel mx-auto mt-8 flex w-full max-w-lg flex-col items-center gap-6 p-6 sm:mt-10 sm:p-8">
          <h1 className="text-primary-950 text-center text-4xl font-semibold tracking-tight">
            Verify your email
          </h1>

          <p className="text-center text-gray-600">
            We have sent you an email with a link to verify your email address.
          </p>

          <Button.Link href={routes.auth.login} type="submit" color="primary">
            Login
          </Button.Link>
        </div>
      </Layout>
    </>
  );
}
