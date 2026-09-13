"use client";

import { useUser } from "@/features/auth/hooks/useUser";
import { signOut } from "@/server/auth/auth-client";
import { c } from "@/utils/classnames";

const controlClass = c(
  "cursor-pointer rounded-sm px-2 py-1 text-sm text-stone-100 transition-colors",
  "hover:text-white hover:underline hover:underline-offset-4",
  "focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-white",
);

export function AdminMenu() {
  const user = useUser();

  if (!user.data) return null;

  return (
    <button
      type="button"
      className={controlClass}
      onClick={() => void signOut()}
    >
      Kirjaudu ulos
    </button>
  );
}
