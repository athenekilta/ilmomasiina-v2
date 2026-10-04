"use client";

import { useManagementUser } from "@/features/auth/hooks/useManagementUser";
import { managementSignOut } from "@/server/auth/management-auth-client";
import { c } from "@/utils/classnames";
import { useTranslations } from "@/i18n/I18nProvider";
import { layoutMessages } from "@/i18n/messages/layout";

const controlClass = c(
  "cursor-pointer rounded-sm px-2 py-1 text-sm text-stone-100 transition-colors",
  "hover:text-white hover:underline hover:underline-offset-4",
  "focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-white",
);

export function ManagementMenu() {
  const messages = useTranslations(layoutMessages);
  const user = useManagementUser();

  if (!user.data) return null;

  return (
    <button
      type="button"
      className={controlClass}
      onClick={() => void managementSignOut()}
    >
      {messages.signOut}
    </button>
  );
}
