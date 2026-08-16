"use client";

import type { User } from "@/generated/prisma";
import { useSession } from "@/server/auth/auth-client";

export type UsersTableProps = {
  users: Array<Omit<User, "password" | "image">>;
  handleAction: (userId: string) => void;
};

export function UsersTable({ users, handleAction }: UsersTableProps) {
  const session = useSession();

  return (
    <div className="overflow-x-auto">
      <table className="surface-panel my-4 min-w-full divide-y divide-stone-200">
        <thead className="bg-stone-100">
          <tr>
            <th className="text-brand-dark px-3 py-2 text-left text-xs font-semibold tracking-wide uppercase">
              ID
            </th>
            <th className="text-brand-dark px-3 py-2 text-left text-xs font-semibold tracking-wide uppercase">
              Name
            </th>
            <th className="text-brand-dark px-3 py-2 text-left text-xs font-semibold tracking-wide uppercase">
              Email
            </th>
            <th className="text-brand-dark px-3 py-2 text-left text-xs font-semibold tracking-wide uppercase">
              Email Verified
            </th>
            <th className="text-brand-dark px-3 py-2 text-left text-xs font-semibold tracking-wide uppercase">
              Role
            </th>
            <th className="text-brand-dark px-3 py-2 text-left text-xs font-semibold tracking-wide uppercase">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-brand-light divide-y divide-stone-200">
          {users.map((user, idx) => {
            const isCurrentUser = session.data?.user?.id === user.id;
            return (
              <tr key={user.id ?? idx} className="hover:bg-brand-beige">
                <td className="px-3 py-1.5 text-sm text-gray-700">{user.id}</td>
                <td className="px-3 py-1.5 text-sm text-gray-700">
                  {user.name}
                </td>
                <td className="px-3 py-1.5 text-sm text-gray-700">
                  {user.email}
                </td>
                <td className="px-3 py-1.5 text-sm text-gray-700">
                  {user.emailVerified ? user.emailVerified.toString() : "—"}
                </td>
                <td className="px-3 py-1.5 text-sm text-gray-700">
                  {user.role}
                </td>
                <td className="px-3 py-1.5">
                  <button
                    className={`rounded px-3 py-1 text-xs font-medium transition-colors duration-150 ${
                      user.role === "admin"
                        ? "bg-red-100 text-red-700 hover:bg-red-200"
                        : "bg-blue-100 text-blue-700 hover:bg-blue-200"
                    } ${isCurrentUser ? "cursor-not-allowed bg-gray-200 text-gray-400 opacity-50 hover:bg-gray-200" : ""} `}
                    onClick={() => {
                      if (
                        window.confirm(
                          user.role === "admin"
                            ? "Are you sure you want to remove admin rights from this user?"
                            : "Are you sure you want to promote this user to admin?",
                        )
                      ) {
                        handleAction(user.id);
                      }
                    }}
                    disabled={isCurrentUser}
                    title={
                      isCurrentUser
                        ? "You cannot change your own role"
                        : undefined
                    }
                  >
                    {user.role === "admin" ? "Remove admin" : "Promote"}
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
