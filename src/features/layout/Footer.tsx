import { routes } from "@/utils/routes";
import Link from "next/link";
import { useManagementUser } from "../auth/hooks/useManagementUser";
import { c } from "@/utils/classnames";
import { ManagementMenu } from "./ManagementMenu";
import { useIsClient } from "@/hooks/useIsClient";

const linkClass = c(
  "rounded-sm px-2 py-1 text-sm text-stone-100 transition-colors",
  "hover:text-white hover:underline hover:underline-offset-4",
  "focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-white",
);

export function Footer() {
  const isClient = useIsClient();
  const user = useManagementUser();
  const isLoggedIn = isClient && !!user.data;

  return (
    <footer className="bg-brand-dark flex flex-wrap items-center justify-center gap-x-1 gap-y-2 px-3 py-3 text-center text-white sm:py-4">
      <Link
        href={isLoggedIn ? routes.app.admin : routes.auth.login}
        className={linkClass}
      >
        Hallinta
      </Link>
      {isLoggedIn && (
        <>
          <span className="text-stone-500 select-none" aria-hidden>
            ·
          </span>
          <ManagementMenu />
        </>
      )}
      <span className="text-stone-500 select-none" aria-hidden>
        ·
      </span>
      <a href="https://athene.fi/hallinto/materiaalit/" className={linkClass}>
        Tietosuoja
      </a>
      <span className="text-stone-500 select-none" aria-hidden>
        ·
      </span>
      <a href="https://athene.fi" className={linkClass}>
        Athene.fi
      </a>
    </footer>
  );
}
