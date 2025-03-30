import Link from "next/link";
import { useUser } from "../auth/hooks/useUser";
import { signOut } from "next-auth/react";
import { routes } from "@/utils/routes";
export const Header = () => {
  const user = useUser();

  console.log(user.data);
  return (
    <nav className="flex h-16 items-center justify-between bg-brand-primary p-6">
      <Link href="/">
        <h1 className="font-primary text-white text-2xl">Athenen Ilmomasiina</h1>
      </Link>

      {user.data ? (
        <div>
          <Link href={routes.app.settings.user}>Profile</Link>
          <br />
          <button onClick={() => signOut()}>Logout</button>
        </div>
      ) : (
        <div>
          <Link href={routes.auth.login}>Login</Link>
          <br />
          <Link href={routes.auth.signup}>Signup</Link>
        </div>
      )}
    </nav>
  );
};
