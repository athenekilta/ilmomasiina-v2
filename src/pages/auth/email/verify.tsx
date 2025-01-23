import { Layout } from "@/features/layout/Layout";
import { PageHead } from "@/features/layout/PageHead";
import { EmailVerifier } from "@/features/auth/components/EmailVerifier";
export default function VerifyEmailPage() {
  return (
    <>
      <PageHead title="Verify Email" />
      <Layout>
        <div className="-mx-6 mt-16 flex max-w-2xl flex-col items-center gap-16 rounded-xl bg-white p-12 sm:mx-auto">
          <h1 className="text-primary-950 text-4xl font-semibold tracking-tight">
            Verify Email
          </h1>
          <EmailVerifier />
        </div>
      </Layout>
    </>
  );
}
