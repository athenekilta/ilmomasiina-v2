"use client";

import { useManagementUser } from "@/features/auth/hooks/useManagementUser";
import { managementSignOut } from "@/server/auth/management-auth-client";
import { c } from "@/utils/classnames";
import { useTranslations } from "@/i18n/I18nProvider";
import { layoutMessages } from "@/i18n/messages/layout";
import { useState } from "react";
import { useAlert } from "@/features/alert/hooks/useAlert";
import { Button } from "@/components/Button";

const controlClass = c(
  "cursor-pointer rounded-sm px-2 py-1 text-sm text-stone-100 transition-colors",
  "hover:text-white hover:underline hover:underline-offset-4",
  "focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-white",
);

export function ManagementMenu({
  className,
  appearance = "footer",
}: {
  className?: string;
  appearance?: "footer" | "toolbar";
}) {
  const messages = useTranslations(layoutMessages);
  const user = useManagementUser();
  const alert = useAlert();
  const [pending, setPending] = useState(false);

  const signOut = async () => {
    if (pending) return;
    setPending(true);
    try {
      const result = await managementSignOut();
      if (result.error) alert.error(messages.signOutFailed);
    } catch {
      alert.error(messages.signOutFailed);
    } finally {
      setPending(false);
    }
  };

  if (!user.data) return null;

  if (appearance === "toolbar") {
    return (
      <Button
        type="button"
        variant="text"
        color="primary"
        className={className}
        loading={pending}
        onClick={() => void signOut()}
      >
        {messages.signOut}
      </Button>
    );
  }

  return (
    <button
      type="button"
      className={className ?? controlClass}
      disabled={pending}
      onClick={() => void signOut()}
    >
      {messages.signOut}
    </button>
  );
}
