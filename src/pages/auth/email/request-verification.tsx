import { Icon } from "@/components/Icon";
import { RequestEmailVerificationForm } from "@/features/auth/components/RequestEmailVerificationForm";
import { Layout } from "@/features/layout/Layout";
import { PageHead } from "@/features/layout/PageHead";

export default function RequestEmailVerification() {
  return (
    <>
      <PageHead title="Request email verification" />
      <Layout>
        <div className="-mx-6 mt-16 flex max-w-2xl flex-col items-center gap-16 rounded-xl bg-white p-12 sm:mx-auto">
          <h1 className="text-primary-950 text-center text-4xl font-semibold tracking-tight">
            Verify your email
          </h1>

          <div className="mb-2 flex items-center gap-4 rounded-lg bg-slate-50 p-4 text-sm">
            <Icon icon="info" className="text-primary" />
            <div className="space-y-4">
              <p>
                <b className="font-semibold">Check your email</b> A verification
                email has been sent to your email address when you first signed
                in.{" "}
              </p>
              <p>
                If you need a new confirmation email, send it by clicking the
                link below.
              </p>
            </div>
          </div>

          <RequestEmailVerificationForm />
        </div>
      </Layout>
    </>
  );
}
