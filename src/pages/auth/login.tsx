import { ProtectedRoute } from "@/features/auth/components/ProtectedRoute";
import { LoginForm } from "@/features/auth/components/LoginForm";
import { Layout } from "@/features/layout/Layout";
import { PageHead } from "@/features/layout/PageHead";

export default function LoginPage() {
  return (
    <ProtectedRoute unauthenticatedOnly>
      <PageHead title="Login" />
      <Layout>
        <div className="surface-panel mx-auto mt-8 flex max-w-md flex-col items-center gap-6 p-6 sm:mt-10 sm:p-8">
          <h1 className="text-2xl font-semibold tracking-tight text-brand-dark">
            Login
          </h1>
          <LoginForm />
        </div>
      </Layout>
    </ProtectedRoute>
  );
}
