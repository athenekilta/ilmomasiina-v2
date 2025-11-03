import { ProtectedRoute } from "@/features/auth/components/ProtectedRoute";
import { SignupForm } from "@/features/auth/components/SignupForm";
import { Layout } from "@/features/layout/Layout";
import { PageHead } from "@/features/layout/PageHead";

export default function SignupPage() {
  return (
    <ProtectedRoute unauthenticatedOnly>
      <PageHead title="Signup" />
      <Layout>
        <div className="bg-brand-light -mx-6 mt-16 flex max-w-2xl flex-col items-center gap-16 rounded-xl p-12 sm:mx-auto">
          <h1 className="text-primary-950 text-4xl font-semibold tracking-tight">
            Signup
          </h1>
          <SignupForm />
        </div>
      </Layout>
    </ProtectedRoute>
  );
}
