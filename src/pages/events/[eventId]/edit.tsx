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
        <div className="-mx-6 mt-16 flex flex-col gap-16 rounded-xl bg-white p-12 sm:mx-auto">
          {isReady && <EventForm editId={eventId} />}
        </div>
      </Layout>
    </ProtectedRoute>
  );
}
