import { ChangePasswordForm } from "@/features/auth/components/ChangePasswordForm";
import { ProtectedRoute } from "@/features/auth/components/ProtectedRoute";
import { Layout } from "@/features/layout/Layout";
import { PageHead } from "@/features/layout/PageHead";

export default function ChangePassword() {
  return (
    <ProtectedRoute>
      <PageHead title="Change password" />
      <Layout>
        <div className="-mx-6 mt-16 flex max-w-2xl flex-col items-center gap-16 rounded-xl bg-white p-12 sm:mx-auto">
          <h1 className="text-primary-950 text-center text-4xl font-semibold tracking-tight">
            Change password
          </h1>
          <ChangePasswordForm />
        </div>
      </Layout>
    </ProtectedRoute>
  );
}
