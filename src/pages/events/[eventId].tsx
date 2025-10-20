import { useRouter } from "next/router";
import { api } from "@/utils/api";
import { Layout } from "@/features/layout/Layout";
import { Button } from "@/components/Button";
import { OriginalQuotaTitle } from "@/features/events/utils/utils";
import { SignupRow } from "@/features/events/components/SingupRow";
import { PageHead } from "@/features/layout/PageHead";
import { RegistrationDate } from "@/features/events/utils/utils";
import { pusherClient } from "@/utils/pusher";
import { useEffect, useState } from "react";
import { useUserStore } from "@/stores/userStore";
import { Input } from "@/components/Input";
import { FieldSet } from "@/components/FieldSet";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import HydrationZustand from "@/components/HydrationZustand";
import type { RouteOutput } from "@/types/types";
import { useAlert } from "@/features/alert/hooks/useAlert";
import Link from "next/link";

const formschema = z.object({
  email: z.string().email(),
  name: z.string().min(3),
});

function Registration({
  event,
}: {
  event: RouteOutput["events"]["getEventByID"];
}) {
  const router = useRouter();
  const { isRegistrationOpen } = RegistrationDate(event);

  const alert = useAlert();

  // use zustand store for persisted signup user
  const { user: storedUser, setUser, clearUser } = useUserStore();
  const [isEditingUserData, setIsEditingUserData] = useState(false);

  const createSignupMutation = api.signups.createSignup.useMutation();

  // store these just locally to prefill email & name for the user
  const {
    register,
    formState: { isSubmitting, errors, isValid },
    handleSubmit,
    reset,
  } = useForm({
    resolver: zodResolver(formschema),
    values: {
      name: storedUser?.name ?? "",
      email: storedUser?.email ?? "",
    },
    mode: "all",
  });

  // if no stored user, start in editing mode
  useEffect(() => {
    if (!storedUser) {
      setIsEditingUserData(true);
    }
  }, [storedUser]);

  const saveUserData = async (data: z.infer<typeof formschema>) => {
    try {
      setUser({ name: data.name, email: data.email });
      setIsEditingUserData(false);
    } catch (e) {
      console.error("Failed to save user data to store", e);
    }
  };

  const getHandleSignup = (quotaId: string) => {
    return async (data: z.infer<typeof formschema>) => {
      try {
        const result = await createSignupMutation.mutateAsync({
          quotaId,
          name: data.name,
          email: data.email,
        });
        if (result) {
          router.push(
            `/events/${event.id}/${result.signup.id}${result.isExistingSignup ? "?existing=true" : ""}`,
          );
        }
      } catch (error) {
        if (error instanceof Error)
          alert.warning(`${error.message}`, { timeoutMs: 10000 });
      }
    };
  };

  return (
    <div className="mb-8">
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-800">
          Ilmoittautuminen
        </h2>
        {isEditingUserData ? (
          <form
            className="space-y-2"
            onSubmit={handleSubmit(async (data) => {
              await saveUserData(data);
            })}
          >
            <p>
              Tallenna nimi ja sähköposti ennen ilmoittautumista. Huomaa, että
              ilmoittautua tapahtumaan vain kerran.
            </p>
            <FieldSet title="Name">
              <Input {...register("name")} placeholder="Your name" />
              <span className="text-sm text-gray-500">
                {event.signupsPublic ? "Nimi on julkinen tieto." : ""} Voit
                halutessasi ilmoittautua salanimellä tapahtumaan.
              </span>
            </FieldSet>

            <FieldSet title="Email">
              <Input {...register("email")} placeholder="you@example.com" />
            </FieldSet>

            <div className="flex gap-2">
              <Button type="submit" className="bg-green-600">
                Save
              </Button>
              <Button
                type="button"
                className="bg-gray-300 text-black"
                onClick={() => {
                  // Cancel editing: if we had stored data, revert to it; otherwise keep editing
                  if (storedUser) {
                    reset({
                      name: storedUser.name ?? "",
                      email: storedUser.email ?? "",
                    });
                    setIsEditingUserData(false);
                  } else {
                    // clear form
                    reset({ name: "", email: "" });
                  }
                }}
              >
                Cancel
              </Button>
            </div>
          </form>
        ) : (
          <div>
            <div className="flex items-center gap-4">
              <p className="text-md text-gray-600">
                <p className="mb-1">
                  Olet ilmoittautumassa nimellä{" "}
                  <span className="text-gray-900">{storedUser?.name}</span> ja
                  sähköpostilla{" "}
                  <span className="text-gray-900">{storedUser?.email}</span>
                  <button
                    onClick={() => setIsEditingUserData(true)}
                    className="ml-2 cursor-pointer border-none p-0 text-brand-primary hover:underline"
                  >
                    Vaihda
                  </button>
                </p>
              </p>
            </div>
            <div className="my-1 flex flex-col gap-1">
              {event.Quotas.filter((quota) => quota.id !== "queue").map(
                (quota) => (
                  <div
                    key={quota.id}
                    className="flex items-center justify-between rounded-lg border border-gray-200 p-4"
                  >
                    <div>
                      <h3 className="text-lg font-medium text-gray-700">
                        {quota.title}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {quota.size
                          ? `${quota.size} paikkaa yhteensä`
                          : `${quota.Signups.length} ilmoittautumista`}
                      </p>
                    </div>
                    <Button
                      className="rounded bg-blue-500 px-4 py-2 text-white transition duration-300 hover:bg-blue-600"
                      onClick={handleSubmit(getHandleSignup(quota.id))}
                      disabled={!isRegistrationOpen || !isValid || isSubmitting}
                      loading={
                        isSubmitting &&
                        createSignupMutation.variables?.quotaId === quota.id
                      }
                    >
                      Sign Up
                    </Button>
                  </div>
                ),
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function EventPage() {
  const router = useRouter();
  const eventId = Number(router.query.eventId);

  const {
    data: event,
    isLoading,
    refetch,
  } = api.events.getEventByID.useQuery(
    { eventId: eventId! },
    {
      enabled: !isNaN(eventId),
      staleTime: 0, // Always fetch fresh data
      cacheTime: 0, // Don't cache the data
    },
  );

  // Listen for raffle status updates
  useEffect(() => {
    const id = Number(router.query.eventId);
    if (!id || isNaN(id)) return;

    const channel = pusherClient.subscribe(`raffle-${id}`);
    // Refetch event data when raffle status changes
    channel.bind("status-update", () => {
      refetch();
    });

    channel.bind("simulation-complete", () => {
      refetch();
    });

    return () => {
      pusherClient.unsubscribe(`raffle-${id}`);
    };
  }, [router.query.eventId, refetch]);

  return (
    <>
      <PageHead title={event?.title || "Loading..."} />
      <Layout>
        <div className="m-4">
          <Link
                    href="/"
                    className="cursor-pointer border-none p-0 text-brand-primary hover:underline"
                  >
                    <span>&#8592; </span>
                    Takaisin etusivulle
                  </Link>
        </div>
        <div className="mx-auto max-w-4xl rounded-lg bg-white p-4 shadow-md">
        {isLoading || !event ? (
          <div className="h-xl">Loading...</div>
        ) : (
          <>
          <h1 className="mb-2 text-3xl font-bold text-gray-800">
            {event.title}
          </h1>

          {/* Event Details */}
          <div className="mb-8">
            <p className="text-lg">
              <strong>Ajankohta: </strong>
              {event.date.toLocaleDateString()}
            </p>
            {event.location && <p className="text-lg">
              <strong>Sijainti: </strong>
              {event.location}
            </p>}
            <hr className="my-4" />
            <p className="text-base leading-relaxed">{event.description}</p>
          </div>

          {/* Registration Section, render only on client-side after zustand load */}
          <HydrationZustand>
            {event && <Registration event={event} />}
          </HydrationZustand>

          {/* Terms Section */}
          <div className="mb-8 rounded-lg bg-gray-50 py-4">
            <h2 className="mb-4 text-lg font-semibold text-gray-800">
              Terms and Conditions
            </h2>
            <p className="mb-4 text-gray-700">
              Ilmoittautumisen sulkeuduttua ilmoittautuminen on sitova. Tämän
              jälkeen ilmoittautunut on velvollinen maksamaan osallistumismaksun
              tai löytämään paikalleen toisen osallistujan. Osallistumalla
              tapahtumaan sitoudut noudattamaan Athenen yhteisiä periaatteita.
            </p>
            <p className="text-gray-700">
              The sign up is binding when sign-up closes. After this, the person
              who has signed up is obligated to pay the participation fee or
              find another participant to attend in one&apos;s place.
              Athene&apos;s common principles are to be followed in the event.
            </p>
          </div>

          {/* Participants List */}
          {event.signupsPublic && (
            <div className="space-y-8">
              <h2 className="text-xl font-semibold text-gray-800">
                Registered Participants
              </h2>

              {event.Quotas.map(
                (quota) =>
                  !(quota.id == "queue" && quota.Signups.length == 0) && (
                    <div
                      key={quota.id}
                      className="rounded-lg border border-gray-200"
                    >
                      <div className="flex items-center border-b border-gray-200 bg-gray-50 p-4 text-lg font-medium">
                        <h3 className="w-30 text-wrap">{quota.title}</h3>
                        {quota.id !== "queue" && (
                          <>
                            <span className="text-md mx-5 w-40 font-normal text-gray-700">
                              {quota.Signups.length} / {quota.size ?? "∞"}
                            </span>
                            {quota.size && (
                              <div className="ml-auto h-2 w-60 overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
                                <div
                                  className={`h-full ${
                                    quota.Signups.length >= quota.size
                                      ? "bg-red-500"
                                      : quota.Signups.length / quota.size > 0.75
                                        ? "bg-yellow-500"
                                        : "bg-green-500"
                                  }`}
                                  style={{
                                    width: `${Math.min((quota.Signups.length / quota.size) * 100, 100)}%`,
                                  }}
                                ></div>
                              </div>
                            )}
                          </>
                        )}
                        {quota.id === "queue" && (
                          <span className="text-md ml-5 font-normal text-gray-700">
                            {quota.Signups.length}
                          </span>
                        )}
                      </div>
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
                              ).map((signup, index) => {
                                const rowStyle = signup.completedAt
                                  ? "px-6 py-2"
                                  : "px-6 py-2 text-gray-400";
                                return (
                                  <tr key={signup.id}>
                                    <td className={rowStyle}>{index + 1}.</td>
                                    <td className={rowStyle}>{signup.name}</td>
                                    <SignupRow
                                      signup={signup}
                                      rowStyle={rowStyle}
                                    />
                                    {quota.id === "queue" && (
                                      <td className={rowStyle}>
                                        {OriginalQuotaTitle(
                                          event.Quotas,
                                          signup.quotaId,
                                        )}
                                      </td>
                                    )}
                                  </tr>
                                );
                              })}
                            </tbody>
                          </table>
                        ) : (
                          <p className="px-6 py-4 text-gray-500">
                            No participants yet
                          </p>
                        )}
                      </div>
                    </div>
                  ),
              )}
            </div>
          )}
        </>
        )}
        </div>
      </Layout>
    </>
  );
}
