import { ProtectedRoute } from "@/features/auth/components/ProtectedRoute";
import { EventForm } from "@/features/events/components/EventForm";
import { Layout } from "@/features/layout/Layout";
import { PageHead } from "@/features/layout/PageHead";
import { useQueryParams } from "@/hooks/useQueryParams";

export default function EditEventPage() {
  const { eventId, isReady } = useQueryParams();

  return (
    <ProtectedRoute adminOnly>
      <PageHead title="Edit event" />
      <Layout>
        <div className="surface-panel mx-auto mt-4 w-full max-w-3xl p-4 sm:mt-6 sm:p-6">
          {isReady && <EventForm editId={eventId} />}
        </div>
      </Layout>
    </ProtectedRoute>
  );
}
