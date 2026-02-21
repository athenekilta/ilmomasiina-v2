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
import { useUser } from "@/features/auth/hooks/useUser";
import { Input } from "@/components/Input";
import { FieldSet } from "@/components/FieldSet";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import HydrationZustand from "@/components/HydrationZustand";
import type { RouteOutput } from "@/types/types";
import { useAlert } from "@/features/alert/hooks/useAlert";
import Link from "next/link";
import { formatRegistration } from "@/utils/format";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { TRPCClientError } from "@trpc/client";
import { nativeDate } from "@/utils/nativeDate";

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
  const { user: storedUser, setUser } = useUserStore();
  const [isEditingUserData, setIsEditingUserData] = useState(false);

  const createSignupMutation = api.signups.createSignup.useMutation();

  // store these just locally to prefill email & name for the user
  const {
    register,
    formState: { isSubmitting, isValid },
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
        console.error(error);
        if (error instanceof TRPCClientError && error.data.code === "CONFLICT")
          // TODO: move to separate alert page here which allows to request link again
          return alert.warning(
            "Tällä sähköpostilla on jo vahvistettu ilmo. Muokkaa olemassa olevaa ilmoa sähköpostiin tulleen linkin kautta",
            { timeoutMs: 10000 },
          );
        if (error instanceof Error)
          return alert.error(`${error.message}`, { timeoutMs: 10000 });

        alert.error("An unknown error occurred: " + error, {
          timeoutMs: 10000,
        });
      }
    };
  };

  return (
    <div className="mb-8">
      <div className="">
        <h2 className="mb-1 text-xl font-semibold text-gray-800">Ilmo</h2>
        <p className="text-brand-primary mb-2 font-medium">
          {formatRegistration(
            event.registrationStartDate,
            event.registrationEndDate,
          )}
        </p>
        {isEditingUserData ? (
          <form
            className="space-y-2"
            onSubmit={handleSubmit(async (data) => {
              await saveUserData(data);
            })}
          >
            <h3 className="text-md">
              Aseta nimi ja sähköposti ennen ilmoittautumista. Huomaa, että voit
              ilmoittautua tapahtumaan vain kerran.
            </h3>
            <div className="text-sm">
              <FieldSet title="Nimi">
                <Input {...register("name")} placeholder="Your name" />
                <span className="text-xs text-gray-600">
                  {event.signupsPublic ? "Nimi on julkinen tieto." : ""} Voit
                  halutessasi ilmoittautua salanimellä tapahtumaan.
                </span>
              </FieldSet>
            </div>
            <div className="text-sm">
              <FieldSet title="Sähköposti">
                <Input {...register("email")} placeholder="you@example.com" />
              </FieldSet>
            </div>

            <div className="flex gap-2">
              <Button type="submit" className="bg-green-600">
                Tallenna
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
                Peruuta
              </Button>
            </div>
          </form>
        ) : (
          <div>
            <p className="mb-1 text-sm text-gray-600">
              Hei{" "}
              <span className="font-medium text-gray-900">
                {storedUser?.name}
              </span>
              , olet ilmoomassa sähköpostilla{" "}
              <span className="text-gray-900">{storedUser?.email}</span>.{" "}
              <button
                onClick={() => setIsEditingUserData(true)}
                className="text-brand-primary cursor-pointer border-none p-0 hover:underline"
              >
                Vaihda
              </button>
            </p>
            <div className="my-4 flex flex-col gap-1">
              {event.Quotas.filter((quota) => quota.id !== "queue").map(
                (quota) => (
                  <div
                    key={quota.id}
                    className="flex items-center justify-between rounded-lg bg-white p-4 shadow"
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
                      className="ml-2 rounded-sm bg-blue-500 px-4 py-2 text-white transition duration-300"
                      onClick={handleSubmit(getHandleSignup(quota.id))}
                      disabled={!isRegistrationOpen || isSubmitting}
                      loading={
                        isSubmitting &&
                        createSignupMutation.variables?.quotaId === quota.id
                      }
                    >
                      Ilmoo
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

  const loginUser = useUser();
  const isAdmin = loginUser.data?.role === "admin";

  const {
    data: event,
    isLoading,
    refetch,
  } = api.events.getEventByID.useQuery(
    { eventId: eventId! },
    {
      enabled: !isNaN(eventId),
      staleTime: 0, // Always fetch fresh data
      gcTime: 0, // Don't cache the data
    },
  );

  return (
    <>
      <PageHead title={event?.title || "Loading..."} />
      <Layout>
        <div className="mx-4">
          <div className="my-4">
            <Link
              href="/"
              className="text-brand-primary cursor-pointer border-none p-0 hover:underline"
            >
              <span>&#8592; </span>
              Takaisin etusivulle
            </Link>
          </div>

          <div className="bg-brand-light mb-10 rounded-lg p-4 shadow-md">
            {isLoading || !event ? (
              <div>
                <LoadingSpinner />
              </div>
            ) : (
              <>
                {isAdmin && (
                  <div className="mb-6 flex justify-start">
                    <Button.Link href={`/events/${event.id}/edit`}>
                      Muokkaa tapahtumaa
                    </Button.Link>
                  </div>
                )}
                <h1 className="mb-2 text-3xl font-bold text-gray-800">
                  {event.title}
                </h1>

                {/* Event Details */}
                <div className="mb-8">
                  <p className="text-lg">
                    <strong>Ajankohta: </strong>
                    {nativeDate.stringify(event.date)}
                  </p>
                  {event.location && (
                    <p className="text-lg">
                      <strong>Sijainti: </strong>
                      {event.location}
                    </p>
                  )}
                  <hr className="my-4" />
                  <p className="text-base leading-relaxed">
                    {event.description}
                  </p>
                </div>

                {/* Registration Section, render only on client-side after zustand load */}
                <HydrationZustand>
                  {event && <Registration event={event} />}
                </HydrationZustand>

                {/* Participants List */}
                {event.signupsPublic && (
                  <div className="space-y-8">
                    <h2 className="text-xl font-semibold text-gray-800">
                      Ilmonneet
                    </h2>

                    {event.Quotas.map(
                      (quota) =>
                        !(quota.id == "queue" && quota.Signups.length == 0) && (
                          <div
                            key={quota.id}
                            className="rounded-lg border border-gray-200 bg-white"
                          >
                            <div className="flex items-center border-b border-gray-200 p-4 text-lg font-medium">
                              <h3 className="w-30 text-wrap">{quota.title}</h3>
                              {quota.id !== "queue" && (
                                <>
                                  <span className="text-md mx-5 w-40 font-normal text-gray-700">
                                    {quota.Signups.length} / {quota.size ?? "∞"}
                                  </span>
                                  {quota.size && (
                                    <div className="bg-brand-beige ml-auto h-2 w-60 overflow-hidden rounded-full">
                                      <div
                                        className={`h-full ${
                                          quota.Signups.length >= quota.size
                                            ? "bg-red-500"
                                            : quota.Signups.length /
                                                  quota.size >
                                                0.75
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
                            <div className="overflow-x-auto">
                              {quota.Signups.length > 0 ? (
                                <table className="min-w-full text-sm">
                                  <thead>
                                    <tr className="border-b border-gray-200">
                                      <th className="px-6 py-3 text-left font-medium text-gray-900">
                                        Sija
                                      </th>
                                      <th className="px-6 py-3 text-left font-medium text-gray-900">
                                        Nimi
                                      </th>
                                      <th className="px-6 py-3 text-left font-medium text-gray-900">
                                        Ilmoittautumisaika
                                      </th>
                                      {quota.id === "queue" && (
                                        <th className="px-6 py-3 text-left font-medium text-gray-900">
                                          Kiintiö
                                        </th>
                                      )}
                                    </tr>
                                  </thead>
                                  <tbody className="divide-y divide-gray-200">
                                    {quota.Signups.map((signup, index) => {
                                      const rowStyle = signup.completedAt
                                        ? "px-6 py-2"
                                        : "px-6 py-2 text-gray-400";
                                      return (
                                        <tr key={signup.id}>
                                          <td className={rowStyle}>
                                            {index + 1}.
                                          </td>
                                          <td className={rowStyle}>
                                            {signup.name}
                                          </td>
                                          <SignupRow
                                            signup={signup}
                                            rowStyle={rowStyle}
                                          />
                                          {quota.id === "queue" && (
                                            <td className={rowStyle}>
                                              {OriginalQuotaTitle(
                                                event.Quotas,
                                                signup.originalQuotaId,
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
                                  Ei vielä osallistujia
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
        </div>
      </Layout>
    </>
  );
}
