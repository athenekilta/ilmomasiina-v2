import { routes } from "@/utils/routes";
import Link from "next/link";
import { useUser } from "../auth/hooks/useUser";
import { c } from "@/utils/classnames";

const linkClass = c(
  "rounded-sm px-2 py-1 text-sm text-stone-100 transition-colors",
  "hover:text-white hover:underline hover:underline-offset-4",
  "focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-white",
);

export function Footer() {
  const user = useUser();
  const isLoggedIn = user.data !== undefined;

  return (
    <footer className="flex flex-wrap items-center justify-center gap-x-1 gap-y-2 bg-brand-dark px-3 py-3 text-center text-white sm:py-4">
      <Link href={isLoggedIn ? routes.app.admin : routes.auth.login} className={linkClass}>
        Hallinta
      </Link>
      <span className="select-none text-stone-500" aria-hidden>
        ·
      </span>
      <a href="https://athene.fi/hallinto/materiaalit/" className={linkClass}>
        Tietosuoja
      </a>
      <span className="select-none text-stone-500" aria-hidden>
        ·
      </span>
      <a href="https://athene.fi" className={linkClass}>
        Athene.fi
      </a>
    </footer>
  );
}
