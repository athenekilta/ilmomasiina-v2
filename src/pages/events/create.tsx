import { ProtectedRoute } from "@/features/auth/components/ProtectedRoute";
import { EventForm } from "@/features/events/components/EventForm";
import { Layout } from "@/features/layout/Layout";
import { PageHead } from "@/features/layout/PageHead";

export default function CreateEvent() {
  return (
    <ProtectedRoute adminOnly={true}>
      <PageHead title="Create event" />
      <Layout>
        <div className="-mx-6 mt-16 flex flex-col  gap-16 rounded-xl bg-white p-12 sm:mx-auto">
          <EventForm />
        </div>
      </Layout>
    </ProtectedRoute>
  );
}
