import Link from "next/link";
import { useUser } from "../auth/hooks/useUser";
import { signOut } from "@/server/auth/auth-client";
import { routes } from "@/utils/routes";

export const Header = () => {
  const user = useUser();

  return (
    <nav className="bg-brand-primary shadow-soft flex h-14 items-center justify-between px-4 sm:px-6">
      <Link href="/" className="min-w-0 shrink focus-visible:outline-hidden">
        <h1 className="font-primary truncate text-xl font-extrabold tracking-tight text-white uppercase sm:text-2xl">
          Athenen Ilmomasiina
        </h1>
      </Link>

      {user.data ? (
        <div className="flex shrink-0 items-center gap-3 text-sm text-white">
          <Link
            href={routes.app.settings.user}
            className="font-medium underline-offset-2 hover:underline"
          >
            Profile
          </Link>
          <button
            type="button"
            onClick={() => void signOut()}
            className="rounded-control bg-white/15 px-3 py-1.5 font-medium transition-colors hover:bg-white/25 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-brand-primary"
          >
            Logout
          </button>
        </div>
      ) : null}
    </nav>
  );
};
