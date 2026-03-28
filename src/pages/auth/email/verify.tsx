import { Layout } from "@/features/layout/Layout";
import { PageHead } from "@/features/layout/PageHead";
import { EmailVerifier } from "@/features/auth/components/EmailVerifier";
export default function VerifyEmailPage() {
  return (
    <>
      <PageHead title="Verify Email" />
      <Layout>
        <div className="surface-panel mx-auto mt-8 flex w-full max-w-lg flex-col items-center gap-6 p-6 sm:mt-10 sm:p-8">
          <h1 className="text-primary-950 text-4xl font-semibold tracking-tight">
            Verify Email
          </h1>
          <EmailVerifier />
        </div>
      </Layout>
    </>
  );
}
