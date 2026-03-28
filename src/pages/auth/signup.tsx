import { ProtectedRoute } from "@/features/auth/components/ProtectedRoute";
import { SignupForm } from "@/features/auth/components/SignupForm";
import { Layout } from "@/features/layout/Layout";
import { PageHead } from "@/features/layout/PageHead";

export default function SignupPage() {
  return (
    <ProtectedRoute unauthenticatedOnly>
      <PageHead title="Signup" />
      <Layout>
        <div className="surface-panel mx-auto mt-8 flex w-full max-w-lg flex-col items-center gap-6 p-6 sm:mt-10 sm:p-8">
          <h1 className="text-primary-950 text-4xl font-semibold tracking-tight">
            Signup
          </h1>
          <SignupForm />
        </div>
      </Layout>
    </ProtectedRoute>
  );
}
