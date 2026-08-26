"use client";

import { UserRole, type User } from "@/generated/prisma";
import { useSession } from "@/server/auth/auth-client";

export type UsersTableProps = {
  users: Array<Pick<User, "id" | "name" | "email" | "role">>;
  onUpdateRole: (userId: string, role: UserRole) => void;
  isUpdating?: boolean;
};

export function UsersTable({
  users,
  onUpdateRole,
  isUpdating = false,
}: UsersTableProps) {
  const session = useSession();
  const currentUserId = session.data?.user?.id;

  return (
    <div className="overflow-x-auto">
      <table className="surface-panel my-4 min-w-full divide-y divide-stone-200">
        <thead className="bg-stone-100">
          <tr>
            <th className="text-brand-dark px-3 py-2 text-left text-xs font-semibold tracking-wide uppercase">
              Nimi
            </th>
            <th className="text-brand-dark px-3 py-2 text-left text-xs font-semibold tracking-wide uppercase">
              Sähköposti
            </th>
            <th className="text-brand-dark px-3 py-2 text-left text-xs font-semibold tracking-wide uppercase">
              Rooli
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
                          ? "Et voi muuttaa omaa rooliasi turvallisuussyistä."
                          : "Valitse käyttäjän rooli"
                      }
                      onChange={(event) => {
                        const newRole = event.target.value as UserRole;
                        const roleLabel =
                          newRole === UserRole.superadmin
                            ? "Pääkäyttäjä"
                            : newRole === UserRole.event_editor
                              ? "Tapahtumamuokkaaja"
                              : "Uusi käyttäjä";

                        if (
                          window.confirm(
                            `Haluatko varmasti muuttaa käyttäjän ${user.email} rooliksi "${roleLabel}"?`,
                          )
                        ) {
                          onUpdateRole(user.id, newRole);
                        }
                      }}
                    >
                      <option value={UserRole.user}>
                        Uusi käyttäjä (Ei oikeuksia)
                      </option>
                      <option value={UserRole.event_editor}>
                        Tapahtumamuokkaaja
                      </option>
                      <option value={UserRole.superadmin}>
                        Pääkäyttäjä (Superadmin)
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
