import { Button } from "@/components/Button";
import { useRouter } from "next/router";
import { useManagementUser } from "@/features/auth/hooks/useManagementUser";
import { ManagementRole } from "@/generated/prisma";
import { useTranslations } from "@/i18n/I18nProvider";
import { layoutMessages } from "@/i18n/messages/layout";

import { routes } from "@/utils/routes";
import { ManagementMenu } from "./ManagementMenu";

export function ManagementToolbar() {
  const user = useManagementUser();
  const router = useRouter();
  const messages = useTranslations(layoutMessages);

  if (!user.data || user.error) return null;

  const canEditEvents =
    user.data.role === ManagementRole.event_editor ||
    user.data.role === ManagementRole.superadmin;
  const links = [
    ...(canEditEvents
      ? [{ href: routes.app.admin, label: messages.management }]
      : []),
    { href: routes.app.settings.user, label: messages.userSettings },
    ...(user.data.role === ManagementRole.superadmin
      ? [{ href: routes.app.adminUsers, label: messages.manageUsers }]
      : []),
  ];

  return (
    <aside
      className="surface-panel mb-6 px-4 py-3"
      aria-label={messages.management}
    >
      <p className="text-sm break-words text-stone-600">
        {messages.managementUser(
          [user.data.name, user.data.email].filter(Boolean).join(" · ") ||
            user.data.id,
        )}
      </p>
      <nav
        className="mt-3 flex flex-wrap items-center gap-2"
        aria-label={messages.management}
      >
        {links.map(({ href, label }) => (
          <Button.Link
            key={href}
            href={href}
            variant="filled"
            color={router.pathname === href ? "primary" : "neutral"}
            className={
              router.pathname === href
                ? "hover:bg-brand-secondary active:bg-brand-darkgreen"
                : "hover:bg-stone-300 active:bg-stone-400"
            }
            aria-current={router.pathname === href ? "page" : undefined}
          >
            {label}
          </Button.Link>
        ))}
        <ManagementMenu appearance="toolbar" className="sm:ml-auto" />
      </nav>
    </aside>
  );
}
