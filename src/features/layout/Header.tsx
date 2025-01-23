import Link from "next/link";
import { useUser } from "../auth/hooks/useUser";
import { signOut } from "next-auth/react";
import { routes } from "@/utils/routes";
export const Header = () => {
  const user = useUser();

  return (
    <nav className="flex h-16 items-center justify-between bg-brand-primary p-6">
      <Link href="/">
        <h1>Ilmomasiina</h1>
      </Link>

      {user.data ? (
        <div>
          <Link href={routes.app.settings.user}>Profile</Link>
          <br />
          <button onClick={() => signOut()}>Logout</button>
        </div>
      ) : (
        <Link href="/auth/login">Login</Link>
      )}
    </nav>
  );
};
