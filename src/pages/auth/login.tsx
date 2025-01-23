import { ProtectedRoute } from "@/features/auth/components/ProtectedRoute";
import { LoginForm } from "@/features/auth/components/LoginForm";
import { Layout } from "@/features/layout/Layout";
import { PageHead } from "@/features/layout/PageHead";

export default function LoginPage() {
  return (
    <ProtectedRoute unauthenticatedOnly>
      <PageHead title="Login" />
      <Layout>
        <div className="-mx-6 mt-16 flex max-w-2xl flex-col items-center gap-16 rounded-xl bg-white p-12 sm:mx-auto">
          <h1 className="text-primary-950 text-4xl font-semibold tracking-tight">
            Login
          </h1>
          <LoginForm />
        </div>
      </Layout>
    </ProtectedRoute>
  );
}
