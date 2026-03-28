import { RequestChangePasswordForm } from "@/features/auth/components/RequestChangePasswordForm";
import { ProtectedRoute } from "@/features/auth/components/ProtectedRoute";
import { Layout } from "@/features/layout/Layout";
import { PageHead } from "@/features/layout/PageHead";

export default function RequestChangePassword() {
  return (
    <ProtectedRoute unauthenticatedOnly>
      <PageHead title="Request password change" />
      <Layout>
        <div className="surface-panel mx-auto mt-8 flex w-full max-w-lg flex-col items-center gap-6 p-6 sm:mt-10 sm:p-8">
          <h1 className="text-primary-950 text-center text-4xl font-semibold tracking-tight">
            Request password change
          </h1>

          <p className="text-center text-gray-600">
            Enter your email and we will send you a link to reset your password
          </p>
          <RequestChangePasswordForm />
        </div>
      </Layout>
    </ProtectedRoute>
  );
}
