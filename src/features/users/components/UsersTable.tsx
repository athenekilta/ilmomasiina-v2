"use client";

import { ManagementRole, type ManagementUser } from "@/generated/prisma";
import { useManagementSession } from "@/server/auth/management-auth-client";
import { useTranslations } from "@/i18n/I18nProvider";
import { adminMessages } from "@/i18n/messages/admin";

export type UsersTableProps = {
  users: Array<Pick<ManagementUser, "id" | "name" | "email" | "role">>;
  onUpdateRole: (userId: string, role: ManagementRole) => void;
  isUpdating?: boolean;
};

export function UsersTable({
  users,
  onUpdateRole,
  isUpdating = false,
}: UsersTableProps) {
  const messages = useTranslations(adminMessages);
  const managementSession = useManagementSession();
  const currentUserId = managementSession.data?.user?.id;

  return (
    <div className="overflow-x-auto">
      <table className="surface-panel my-4 min-w-full divide-y divide-stone-200">
        <thead className="bg-stone-100">
          <tr>
            <th className="label-caps text-brand-dark px-3 py-2 text-left">
              {messages.columns.name}
            </th>
            <th className="label-caps text-brand-dark px-3 py-2 text-left">
              {messages.columns.email}
            </th>
            <th className="label-caps text-brand-dark px-3 py-2 text-left">
              {messages.columns.role}
            </th>
          </tr>
        </thead>
        <tbody className="bg-brand-light divide-y divide-stone-200">
          {users.map((user) => {
            const isCurrentUser = currentUserId === user.id;

            return (
              <tr key={user.id} className="hover:bg-brand-beige">
                <td className="px-3 py-2 text-sm text-gray-700">
                  {user.name || "—"}
                </td>
                <td className="px-3 py-2 text-sm text-gray-700">
                  {user.email}
                </td>
                <td className="px-3 py-2">
                  <div className="relative inline-block w-full max-w-[240px]">
                    <select
                      className="bg-brand-light focus:border-brand-primary rounded border border-stone-300 px-2.5 py-1 text-sm text-stone-700 outline-hidden transition-all disabled:cursor-not-allowed disabled:bg-stone-100 disabled:opacity-60"
                      value={user.role}
                      disabled={isUpdating || isCurrentUser}
                      title={
                        isCurrentUser
                          ? messages.ownRoleTitle
                          : messages.selectRoleTitle
                      }
                      onChange={(event) => {
                        const newRole = event.target.value as ManagementRole;
                        const roleLabel =
                          newRole === ManagementRole.superadmin
                            ? messages.roles.superadmin
                            : newRole === ManagementRole.event_editor
                              ? messages.roles.eventEditor
                              : messages.roles.user;

                        if (
                          window.confirm(
                            messages.confirmRoleChange(
                              user.email ?? "—",
                              roleLabel,
                            ),
                          )
                        ) {
                          onUpdateRole(user.id, newRole);
                        }
                      }}
                    >
                      <option value={ManagementRole.user}>
                        {messages.roles.userOption}
                      </option>
                      <option value={ManagementRole.event_editor}>
                        {messages.roles.eventEditor}
                      </option>
                      <option value={ManagementRole.superadmin}>
                        {messages.roles.superadminOption}
                      </option>
                    </select>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
