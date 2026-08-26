import { ProtectedRoute } from "@/features/auth/components/ProtectedRoute";
import { EventForm } from "@/features/events/components/EventForm";
import { Layout } from "@/features/layout/Layout";
import { PageHead } from "@/features/layout/PageHead";

export default function CreateEvent() {
  return (
    <ProtectedRoute eventEditorOnly>
      <PageHead title="Create event" />
      <Layout>
        <div className="surface-panel mx-auto mt-4 w-full max-w-3xl sm:mt-6">
          <EventForm />
        </div>
      </Layout>
    </ProtectedRoute>
  );
}
