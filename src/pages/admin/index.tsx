import { ProtectedRoute } from "@/features/auth/components/ProtectedRoute";
import { Layout } from "@/features/layout/Layout";
import { PageHead } from "@/features/layout/PageHead";
import { UsersTable } from "@/features/users/components/UsersTable";
import { UserRole } from "@/generated/prisma";

import { api } from "@/utils/api";

export default function ManageAdmins() {
  const { data: users } = api.users.getUsers.useQuery();
  const updateRoleMutation = api.users.updateUserRole.useMutation();

  const adminUsers = users?.filter((user) => user.role == UserRole.admin);
  const nonAdminUsers = users?.filter((user) => user.role == UserRole.user);

  const handleRoleUpdate = (userId: string) => {
    const currentRole = users?.find((user) => user.id === userId)?.role;
    const updatedRole =
      currentRole === UserRole.admin ? UserRole.user : UserRole.admin;
    updateRoleMutation.mutate({ userId, role: updatedRole });
  };

  return (
    <ProtectedRoute adminOnly={true}>
      <PageHead title="Create event" />
      <Layout>
        {adminUsers?.length ? (
          <>
            <p className="mt-2 text-center text-lg font-semibold text-brand-dark">
              Admin käyttäjät
            </p>
            <UsersTable users={adminUsers} handleAction={handleRoleUpdate} />
          </>
        ) : (
          <p className="text-center text-lg font-semibold text-brand-dark">
            Ei admin-käyttäjiä
          </p>
        )}
        {nonAdminUsers?.length ? (
          <>
            <p className="mt-6 text-center text-lg font-semibold text-brand-dark">
              Muut käyttäjät
            </p>
            <UsersTable users={nonAdminUsers} handleAction={handleRoleUpdate} />
          </>
        ) : (
          <p className="text-center text-lg font-semibold text-brand-dark">
            Ei muita käyttäjiä
          </p>
        )}
      </Layout>
    </ProtectedRoute>
  );
}
