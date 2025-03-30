import { useRouter } from "next/router";
import { api } from "@/utils/api";
import { Layout } from "@/features/layout/Layout";
import { Button } from "@/components/Button";
import { OriginalQuotaTitle } from "@/features/events/utils/utils";
import { SignupRow } from "@/features/events/components/SingupRow";
import { PageHead } from "@/features/layout/PageHead";
import { RegistrationDate } from "@/features/events/utils/utils";
import { RaffleSignup } from "@/features/raffle/RaffleSignup";
import { pusherClient } from "@/utils/pusher";
import { useEffect } from "react";

export default function EventPage() {
  const router = useRouter();
  const eventId = Number(router.query.eventId);
  const createSignupMutation = api.signups.createSignup.useMutation();

  const handleSignup = async (quotaId: string) => {
    const result = await createSignupMutation.mutateAsync({ quotaId });
    if (result) {
      router.push(`/events/${eventId}/${result.id}`);
    }
  };

  const { data: event, isLoading, refetch } = api.events.getEventByID.useQuery(
    { eventId: eventId! },
    { 
      enabled: !isNaN(eventId),
      staleTime: 0, // Always fetch fresh data
      cacheTime: 0  // Don't cache the data
    }
  );

  // Listen for raffle status updates
  useEffect(() => {
    const id = Number(router.query.eventId);
    if (!id || isNaN(id)) return;

    const channel = pusherClient.subscribe(`raffle-${id}`);
    // Refetch event data when raffle status changes
    channel.bind('status-update', () => {
      refetch();
    });

    channel.bind('simulation-complete', () => {
      refetch();
    });

    return () => {
      pusherClient.unsubscribe(`raffle-${id}`);
    };
  }, [router.query.eventId, refetch]);

  if (isLoading || !event) {
    return <div>Loading...</div>;
  }

  const { isRegistrationOpen } = RegistrationDate(event);

  return (
    <>
      <PageHead title={event?.title || "Loading..."} />
      <Layout>
        <div className="mx-auto mt-5 max-w-4xl rounded-lg bg-white p-4 shadow-md">
          <h1 className="mb-2 text-3xl font-bold text-gray-800">
            {event.title}
          </h1>

          {/* Event Details */}
          <div className="mb-8">
            <p className="text-lg">
              <strong>Ajankohta: </strong>
              {event.date.toLocaleDateString()}
            </p>
            <p className="text-lg">
              <strong>Sijainti: </strong>
              {event.location}
            </p>
            <hr className="my-4" />
            <p className="text-base leading-relaxed">{event.description}</p>
            {!!event.openQuotaSize && (
              <p className="text-base">
                <strong className="font-semibold">Open Quota Size: </strong>
                {event.openQuotaSize}
              </p>
            )}
          </div>

          {/* Registration Section */}
          <div className="mb-8">
            {event.raffleEnabled ? (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-gray-800">
                  Raffle Registration
                </h2>
                {(() => {
                  const firstQuota = event.Quotas.filter(q => q.id !== "queue")[0];
                  if (!firstQuota) return null;
                  
                  return (
                    <>
                      <RaffleSignup
                        key={firstQuota.id}
                        eventId={event.id}
                        quotaId={firstQuota.id}
                        raffleStartTime={event.raffleStartTime}
                        raffleEndTime={event.raffleEndTime}
                      />
                      
                      {/* Show normal signup buttons if raffle has ended */}
                      {event.raffleEndTime && new Date() > new Date(event.raffleEndTime) && (
                        <div className="mt-8 space-y-4">
                          <h2 className="text-xl font-semibold text-gray-800">
                            Regular Registration
                          </h2>
                          {event.Quotas.filter((quota) => quota.id !== "queue").map(
                            (quota) => (
                              <div key={quota.id} className="flex items-center justify-between rounded-lg border border-gray-200 p-4">
                                <div>
                                  <h3 className="text-lg font-medium text-gray-700">
                                    {quota.title}
                                  </h3>
                                  <p className="text-sm text-gray-500">
                                    {quota.size} spots available
                                  </p>
                                </div>
                                <Button
                                  className="rounded bg-blue-500 px-4 py-2 text-white transition duration-300 hover:bg-blue-600"
                                  onClick={() => handleSignup(quota.id)}
                                  disabled={!isRegistrationOpen}
                                >
                                  Sign Up
                                </Button>
                              </div>
                            ),
                          )}
                        </div>
                      )}
                    </>
                  );
                })()}
              </div>
            ) : (
              <div className="space-y-4">
                <h2 className="text-xl font-semibold text-gray-800">
                  Registration
                </h2>
                {event.Quotas.filter((quota) => quota.id !== "queue").map(
                  (quota) => (
                    <div key={quota.id} className="flex items-center justify-between rounded-lg border border-gray-200 p-4">
                      <div>
                        <h3 className="text-lg font-medium text-gray-700">
                          {quota.title}
                        </h3>
                        <p className="text-sm text-gray-500">
                          {quota.size? (
                            `${quota.size} total spots`
                          ) : (
                            `${quota.Signups.length} registrations`
                          )}
                        </p>
                      </div>
                      <Button
                        className="rounded bg-blue-500 px-4 py-2 text-white transition duration-300 hover:bg-blue-600"
                        onClick={() => handleSignup(quota.id)}
                        disabled={!isRegistrationOpen}
                      >
                        Sign Up
                      </Button>
                    </div>
                  ),
                )}
              </div>
            )}
          </div>

          {/* Terms Section */}
          <div className="mb-8 rounded-lg bg-gray-50 p-4">
            <h2 className="mb-4 text-lg font-semibold text-gray-800">Terms and Conditions</h2>
            <p className="mb-4 text-gray-700">
              Ilmoittautumisen sulkeuduttua ilmoittautuminen on sitova. Tämän
              jälkeen ilmoittautunut on velvollinen maksamaan osallistumismaksun
              tai löytämään paikalleen toisen osallistujan. Osallistumalla
              tapahtumaan sitoudut noudattamaan Athenen yhteisiä periaatteita.
            </p>
            <p className="text-gray-700">
              The sign up is binding when sign-up closes. After this, the person
              who has signed up is obligated to pay the participation fee or find
              another participant to attend in one&apos;s place. Athene&apos;s common
              principles are to be followed in the event.
            </p>
          </div>

          {/* Participants List */}
          {event.signupsPublic && (
            <div className="space-y-8">
              <h2 className="text-xl font-semibold text-gray-800">
                Registered Participants
              </h2>
              {event.Quotas.map((quota) => (
                (!(quota.id == 'queue' && quota.Signups.length == 0) &&
                <div key={quota.id} className="rounded-lg border border-gray-200">
                  <h3 className="border-b border-gray-200 bg-gray-50 p-4 text-lg font-medium">
                    {quota.title}
                  </h3>
                  <div className="overflow-x-auto p-4">
                    {quota.Signups.length > 0 ? (
                      <table className="min-w-full divide-y divide-gray-200 text-sm">
                        <thead>
                          <tr className="bg-gray-50">
                            <th className="px-6 py-3 text-left font-medium text-gray-900">
                              Sija
                            </th>
                            <th className="px-6 py-3 text-left font-medium text-gray-900">
                              Nimi
                            </th>
                            <th className="py-3 text-left font-medium text-gray-900">
                              Ilmoittautumisaika
                            </th>
                            {quota.id === "queue" && (
                              <th className="px-6 py-3 text-left font-medium text-gray-900">
                                Quota
                              </th>
                            )}
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                          {quota.Signups.slice(
                            0,
                            quota.size || quota.Signups.length,
                          ).map((signup, index) => (
                            <tr key={signup.id}>
                              <td className="px-6 py-4">{index + 1}.</td>
                              <td className="px-6 py-4">{signup.name}</td>
                              <SignupRow signup={signup} />
                              {quota.id === "queue" && (
                                <td className="px-6 py-4">
                                  {OriginalQuotaTitle(
                                    event.Quotas,
                                    signup.quotaId,
                                  )}
                                </td>
                              )}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    ) : (
                      <p className="px-6 py-4 text-gray-500">No participants yet</p>
                    )}
                  </div>
                </div>
                )))}
            </div>
          )}
        </div>
      </Layout>
    </>
  );
}
