import { RequestChangePasswordForm } from "@/features/auth/components/RequestChangePasswordForm";
import { ProtectedRoute } from "@/features/auth/components/ProtectedRoute";
import { Layout } from "@/features/layout/Layout";
import { PageHead } from "@/features/layout/PageHead";

export default function RequestChangePassword() {
  return (
    <ProtectedRoute unauthenticatedOnly>
      <PageHead title="Request password change" />
      <Layout>
        <div className="bg-brand-light -mx-6 mt-16 flex max-w-2xl flex-col items-center gap-16 rounded-xl p-12 sm:mx-auto">
          <h1 className="text-primary-950 text-center text-4xl font-semibold tracking-tight">
            Request password change
          </h1>

          <p className="text-center text-black/70">
            Enter your email and we will send you a link to reset your password
          </p>
          <RequestChangePasswordForm />
        </div>
      </Layout>
    </ProtectedRoute>
  );
}
