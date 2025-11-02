import Link from "next/link";
import { useUser } from "../auth/hooks/useUser";
import { signOut } from "next-auth/react";
import { routes } from "@/utils/routes";
export const Header = () => {
  const user = useUser();

  console.log(user.data);
  return (
    <nav className="bg-brand-primary flex h-16 items-center justify-between p-6">
      <Link href="/">
        <h1 className="font-primary text-2xl font-extrabold text-white uppercase">
          Athenen Ilmomasiina
        </h1>
      </Link>

      {user.data && (
        <div>
          <Link href={routes.app.settings.user}>Profile</Link>
          <br />
          <button onClick={() => signOut()}>Logout</button>
        </div>
      )}
    </nav>
  );
};
