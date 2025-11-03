import { Layout } from "@/features/layout/Layout";
import { PageHead } from "@/features/layout/PageHead";
import { Button } from "@/components/Button";
import { routes } from "@/utils/routes";

export default function ChangePassword() {
  return (
    <>
      <PageHead title="Change password" />
      <Layout>
        <div className="bg-brand-light -mx-6 mt-16 flex max-w-2xl flex-col items-center gap-16 rounded-xl p-12 sm:mx-auto">
          <h1 className="text-primary-950 text-center text-4xl font-semibold tracking-tight">
            Change password
          </h1>

          <p className="text-center text-black/70">
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
