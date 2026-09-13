import { ProtectedRoute } from "@/features/auth/components/ProtectedRoute";
import { useManagementUser } from "@/features/auth/hooks/useManagementUser";
import { Layout } from "@/features/layout/Layout";
import { PageHead } from "@/features/layout/PageHead";
import { UsersTable } from "@/features/users/components/UsersTable";
import { ManagementRole } from "@/generated/prisma";
import { api } from "@/utils/api";

export default function ManageUsers() {
  const currentUser = useManagementUser();
  const isSuperadmin = currentUser.data?.role === ManagementRole.superadmin;
  const apiContext = api.useContext();
  const usersQuery = api.users.getUsers.useQuery(undefined, {
    enabled: isSuperadmin,
  });
  const updateManagementRoleMutation = api.users.updateManagementRole.useMutation({
    onSuccess: () => apiContext.users.getUsers.invalidate(),
  });

  return (
    <ProtectedRoute>
      <PageHead title="Hallinta" />
      <Layout>
        {currentUser.isLoading ? (
          <p className="text-center text-stone-600">Ladataan...</p>
        ) : !isSuperadmin ? (
          <div className="surface-panel mx-auto max-w-xl p-6 text-center">
            <h1 className="text-brand-dark text-xl font-semibold">
              Ei pääkäyttäjän oikeuksia
            </h1>
            <p className="mt-2 text-stone-600">
              Käyttäjähallinta on käytettävissä vain pääkäyttäjille.
            </p>
          </div>
        ) : (
          <section>
            <h1 className="text-brand-dark text-2xl font-semibold">
              Käyttäjät
            </h1>

            {usersQuery.isLoading ? (
              <p className="mt-4 text-stone-600">Ladataan käyttäjiä...</p>
            ) : usersQuery.error ? (
              <p role="alert" className="mt-4 text-red-700">
                Käyttäjien lataaminen epäonnistui.
              </p>
            ) : usersQuery.data?.length ? (
              <UsersTable
                users={usersQuery.data}
                onUpdateRole={(userId, role) =>
                  updateManagementRoleMutation.mutate({ userId, role })
                }
                isUpdating={updateManagementRoleMutation.isPending}
              />
            ) : (
              <p className="mt-4 text-stone-600">Ei käyttäjiä.</p>
            )}

            {updateManagementRoleMutation.error && (
              <p role="alert" className="mt-3 text-red-700">
                Käyttöoikeuden päivittäminen epäonnistui.
              </p>
            )}
          </section>
        )}
      </Layout>
    </ProtectedRoute>
  );
}
