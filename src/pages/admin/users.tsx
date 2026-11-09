import { ProtectedRoute } from "@/features/auth/components/ProtectedRoute";
import { useManagementUser } from "@/features/auth/hooks/useManagementUser";
import { Layout } from "@/features/layout/Layout";
import { ManagementToolbar } from "@/features/layout/ManagementToolbar";
import { PageHead } from "@/features/layout/PageHead";
import { UsersTable } from "@/features/users/components/UsersTable";
import { ManagementRole } from "@/generated/prisma";
import { api } from "@/utils/api";
import { useTranslations } from "@/i18n/I18nProvider";
import { adminMessages } from "@/i18n/messages/admin";

export default function ManageUsers() {
  const messages = useTranslations(adminMessages);
  const currentUser = useManagementUser();
  const isSuperadmin = currentUser.data?.role === ManagementRole.superadmin;
  const apiContext = api.useContext();
  const usersQuery = api.users.getUsers.useQuery(undefined, {
    enabled: isSuperadmin,
  });
  const updateManagementRoleMutation =
    api.users.updateManagementRole.useMutation({
      onSuccess: () => apiContext.users.getUsers.invalidate(),
    });

  return (
    <ProtectedRoute>
      <PageHead title={messages.users} />
      <Layout>
        <ManagementToolbar />
        {currentUser.isLoading ? (
          <p className="text-center text-stone-600">{messages.loading}</p>
        ) : !isSuperadmin ? (
          <div className="surface-panel mx-auto max-w-xl p-6 text-center">
            <h1 className="eyebrow text-brand-secondary">
              {messages.noSuperadminTitle}
            </h1>
            <p className="mt-2 text-stone-600">
              {messages.noSuperadminDescription}
            </p>
          </div>
        ) : (
          <section>
            <h1 className="eyebrow text-brand-secondary sm:text-base">
              {messages.users}
            </h1>

            {usersQuery.isLoading ? (
              <p className="mt-4 text-stone-600">{messages.loadingUsers}</p>
            ) : usersQuery.error ? (
              <p role="alert" className="mt-4 text-red-700">
                {messages.loadUsersFailed}
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
              <p className="mt-4 text-stone-600">{messages.noUsers}</p>
            )}

            {updateManagementRoleMutation.error && (
              <p role="alert" className="mt-3 text-red-700">
                {messages.updateRoleFailed}
              </p>
            )}
          </section>
        )}
      </Layout>
    </ProtectedRoute>
  );
}
