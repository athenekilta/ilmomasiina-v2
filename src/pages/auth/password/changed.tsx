import { Layout } from "@/features/layout/Layout";
import { PageHead } from "@/features/layout/PageHead";
import { Button } from "@/components/Button";
import { routes } from "@/utils/routes";

export default function ChangePassword() {
  return (
    <>
      <PageHead title="Change password" />
      <Layout>
        <div className="surface-panel mx-auto mt-8 flex w-full max-w-lg flex-col items-center gap-6 p-6 sm:mt-10 sm:p-8">
          <h1 className="text-primary-950 text-center text-4xl font-semibold tracking-tight">
            Change password
          </h1>

          <p className="text-center text-gray-600">
            Password Changed Successfully
          </p>

          <Button.Link href={routes.auth.login} type="submit" color="primary">
            Login
          </Button.Link>
        </div>
      </Layout>
    </>
  );
}
