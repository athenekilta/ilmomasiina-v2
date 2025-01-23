import { Button } from "@/components/Button";
import { ProtectedRoute } from "@/features/auth/components/ProtectedRoute";
import { Layout } from "@/features/layout/Layout";
import { PageHead } from "@/features/layout/PageHead";
import { routes } from "@/utils/routes";

export default function RequestedPasswordChangePage() {
  return (
    <ProtectedRoute unauthenticatedOnly>
      <PageHead title={""} />
      <Layout>
        <div className="-mx-6 mt-16 flex max-w-2xl flex-col items-center gap-16 rounded-xl bg-white p-12 sm:mx-auto">
          <h1 className="text-primary-950 text-center text-4xl font-semibold tracking-tight">
            Forgot password
          </h1>

          <p className="text-center text-black/70">
            A password change link has been sent to your email.{" "}
          </p>

          <Button.Link href={routes.auth.login} type="submit" color="primary">
            Login
          </Button.Link>
        </div>
      </Layout>
    </ProtectedRoute>
  );
}
