"use client";

import type { User } from "@prisma/client";
import { useSession } from "next-auth/react";

export type UsersTableProps = {
  users: Array<Omit<User, 'password' | 'image'>>,
  handleAction: (userId: string) => void;
};

export function UsersTable({ users, handleAction }: UsersTableProps) {
  const session = useSession();
  console.log('Current session user:', session.data?.user);
  
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200 bg-white rounded-sm shadow-sm my-6">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Email Verified</th>
            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {users.map((user, idx) => {
            const isCurrentUser = session.data?.user?.id === user.id;
            return (
              <tr key={user.id ?? idx} className="hover:bg-gray-50">
                <td className="px-4 py-2 text-sm text-gray-700">{user.id}</td>
                <td className="px-4 py-2 text-sm text-gray-700">{user.name}</td>
                <td className="px-4 py-2 text-sm text-gray-700">{user.email}</td>
                <td className="px-4 py-2 text-sm text-gray-700">
                  {user.emailVerified ? user.emailVerified.toString() : "—"}
                </td>
                <td className="px-4 py-2 text-sm text-gray-700">{user.role}</td>
                <td className="px-4 py-2">
                  <button
                    className={`px-3 py-1 rounded text-xs font-medium transition-colors duration-150
                      ${user.role === "admin"
                        ? "bg-red-100 text-red-700 hover:bg-red-200"
                        : "bg-blue-100 text-blue-700 hover:bg-blue-200"}
                      ${isCurrentUser ? "opacity-50 cursor-not-allowed bg-gray-200 text-gray-400 hover:bg-gray-200" : ""}
                    `}
                    onClick={() => {
                      if (window.confirm(
                        user.role === "admin"
                          ? "Are you sure you want to remove admin rights from this user?"
                          : "Are you sure you want to promote this user to admin?"
                      )) {
                        handleAction(user.id);
                      }
                    }}
                    disabled={isCurrentUser}
                    title={isCurrentUser ? "You cannot change your own role" : undefined}
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
