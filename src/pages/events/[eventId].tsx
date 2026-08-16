import { useRouter } from "next/router";
import { api } from "@/utils/api";
import { Layout } from "@/features/layout/Layout";
import { Button } from "@/components/Button";
import { ParticipantsTable } from "@/features/events/components/ParticipantsTable";
import { PageHead } from "@/features/layout/PageHead";
import { RegistrationDate } from "@/features/events/utils/utils";
import { useEffect, useState } from "react";
import { useUser } from "@/features/auth/hooks/useUser";
import { Input } from "@/components/Input";
import { FieldSet } from "@/components/FieldSet";
import HydrationZustand from "@/components/HydrationZustand";
import { useGuestIdentityForm } from "@/features/events/hooks/useGuestIdentityForm";
import type { RouteOutput } from "@/types/types";
import { useAlert } from "@/features/alert/hooks/useAlert";
import Link from "next/link";
import { formatEventDateTime, formatRegistration } from "@/utils/format";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { TRPCClientError } from "@trpc/client";
import { Icon } from "@/components/Icon";
import { Divider } from "@/components/Divider";

const quotaSegmentColors = [
  "bg-brand-primary",
  "bg-brand-secondary",
  "bg-amber-500",
  "bg-emerald-600",
  "bg-sky-600",
  "bg-violet-600",
];

function Registration({
  event,
}: {
  event: RouteOutput["events"]["getEventByID"];
}) {
  const router = useRouter();
  const { isRegistrationOpen } = RegistrationDate(event);

  const alert = useAlert();

  const {
    register,
    formState: { isSubmitting, isValid, errors },
    handleSubmit,
    reset,
    storedUser,
    setUser,
  } = useGuestIdentityForm();
  const [isEditingUserData, setIsEditingUserData] = useState(false);

  const createSignupMutation = api.signups.createSignup.useMutation();
  const addDemoSignupMutation = api.signups.addDemoSignup.useMutation({
    onError: (error) => alert.error(error.message),
  });
  const removeDemoSignupMutation = api.signups.removeDemoSignup.useMutation({
    onError: (error) => alert.error(error.message),
  });
  const showDemoControls = process.env.NODE_ENV === "development";

  const quotas = event.Quotas.filter((quota) => quota.id !== "queue");
  const finiteQuotas = quotas.filter(
    (quota): quota is typeof quota & { size: number } => quota.size !== null,
  );
  const hasUnlimitedQuota = finiteQuotas.length !== quotas.length;
  const seatHoldingSignupCount = (quota: (typeof quotas)[number]) =>
    quota.Signups.filter(
      (signup) =>
        signup.status === "CONFIRMED" || signup.status === "IN_PROGRESS",
    ).length;
  const totalCapacity =
    finiteQuotas.reduce((sum, quota) => sum + quota.size, 0) +
    event.extraCapacity;
  const occupiedPlaces = finiteQuotas.reduce(
    (sum, quota) => sum + seatHoldingSignupCount(quota),
    0,
  );
  const protectedPlacesInUse = finiteQuotas.reduce(
    (sum, quota) => sum + Math.min(seatHoldingSignupCount(quota), quota.size),
    0,
  );
  const sharedPlacesInUse = Math.max(occupiedPlaces - protectedPlacesInUse, 0);
  const sharedPlacesRemaining = Math.max(
    event.extraCapacity - sharedPlacesInUse,
    0,
  );
  const sharedPlacesAreFull = sharedPlacesRemaining === 0;
  const quotaCapacitySegments = finiteQuotas.map((quota, index) => {
    const signupCount = seatHoldingSignupCount(quota);
    const protectedPlacesUsed = Math.min(signupCount, quota.size);
    const sharedPlacesUsed = Math.max(signupCount - quota.size, 0);

    return {
      quota,
      protectedPlacesUsed,
      sharedPlacesUsed,
      color: quotaSegmentColors[index % quotaSegmentColors.length]!,
    };
  });

  // if no stored user, start in editing mode
  useEffect(() => {
    if (!storedUser) {
      setIsEditingUserData(true);
    }
  }, [storedUser]);

  const saveUserData = handleSubmit(async (data) => {
    try {
      setUser({ name: data.name, email: data.email });
      setIsEditingUserData(false);
    } catch (e) {
      console.error("Failed to save user data to store", e);
    }
  });

  const getHandleSignup = (quotaId: string) => {
    return async (data: { name: string; email: string }) => {
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
    <div className="mb-5">
      <div>
        <h2 className="text-brand-dark mb-1 text-lg font-semibold">Ilmo</h2>
        <p className="text-brand-primary mb-1 text-sm font-medium">
          {formatRegistration(
            event.registrationStartDate,
            event.registrationEndDate,
          )}
        </p>
        <div className="surface-muted mb-3 space-y-2 p-3 text-sm">
          {hasUnlimitedQuota ? (
            <>
              <p className="text-brand-dark font-semibold">
                Paikkamäärää ei ole rajattu
              </p>
              <ul className="space-y-0.5 text-xs text-gray-600">
                {quotas.map((quota) => (
                  <li key={quota.id}>
                    {quota.title}: {seatHoldingSignupCount(quota)}{" "}
                    ilmoittautunutta
                  </li>
                ))}
              </ul>
            </>
          ) : (
            <>
              <div className="flex items-baseline justify-between gap-3">
                <p className="text-brand-dark font-semibold">
                  Paikkoja yhteensä: {totalCapacity}
                </p>
                <span className="shrink-0 text-xs text-gray-600 tabular-nums">
                  {occupiedPlaces} / {totalCapacity} varattu
                </span>
              </div>

              <div
                className="flex h-3 overflow-hidden rounded-full bg-stone-200"
                role="img"
                aria-label={`${occupiedPlaces} / ${totalCapacity} paikkaa varattu`}
              >
                {quotaCapacitySegments.map(
                  ({ quota, protectedPlacesUsed, sharedPlacesUsed, color }) => {
                    const segmentSize = quota.size + sharedPlacesUsed;

                    return (
                      <div
                        key={quota.id}
                        className="flex h-full shrink-0 border-r border-white last:border-r-0"
                        style={{
                          width: `${(segmentSize / totalCapacity) * 100}%`,
                        }}
                        title={`${quota.title}: ${protectedPlacesUsed} / ${quota.size} kiintiöpaikkaa${sharedPlacesUsed ? ` + ${sharedPlacesUsed} jaettua paikkaa` : ""}`}
                      >
                        <div
                          className="h-full bg-stone-200"
                          style={{
                            width: `${(quota.size / segmentSize) * 100}%`,
                          }}
                        >
                          <div
                            className={`h-full ${color}`}
                            style={{
                              width: `${(protectedPlacesUsed / quota.size) * 100}%`,
                            }}
                          />
                        </div>
                        {sharedPlacesUsed > 0 && (
                          <div
                            className={`h-full ${color}`}
                            style={{
                              width: `${(sharedPlacesUsed / segmentSize) * 100}%`,
                            }}
                          />
                        )}
                      </div>
                    );
                  },
                )}
                {event.extraCapacity > 0 && (
                  <div
                    className="h-full shrink-0 bg-stone-200"
                    style={{
                      width: `${(sharedPlacesRemaining / totalCapacity) * 100}%`,
                    }}
                    title={`Jaettuja paikkoja jäljellä: ${sharedPlacesRemaining}`}
                  />
                )}
              </div>

              <div className="flex items-center gap-3 overflow-x-auto pb-0.5 text-xs text-gray-600">
                {quotaCapacitySegments.map(({ quota, color }) => (
                  <span
                    key={quota.id}
                    className="flex shrink-0 items-center gap-1.5"
                  >
                    <span
                      className={`h-2.5 w-2.5 rounded-sm ${color}`}
                      aria-hidden
                    />
                    {quota.title}
                  </span>
                ))}
                {event.extraCapacity > 0 && (
                  <span className="flex shrink-0 items-center gap-1.5">
                    <span
                      className="h-2.5 w-2.5 rounded-sm bg-stone-200"
                      aria-hidden
                    />
                    Jaetut paikat
                  </span>
                )}
              </div>
            </>
          )}
        </div>
        {isEditingUserData ? (
          <form className="space-y-2" onSubmit={saveUserData}>
            <h3 className="text-md">
              Aseta nimi ja sähköposti ennen ilmoittautumista. Huomaa, että voit
              ilmoittautua tapahtumaan vain kerran.
            </h3>
            <div className="text-sm">
              <FieldSet title="Nimi">
                <p className="mb-2 text-xs leading-relaxed text-gray-600">
                  {event.signupsPublic ? (
                    <span>Nimi on julkinen tieto. </span>
                  ) : null}
                  Voit halutessasi ilmoittautua salanimellä tapahtumaan.
                </p>
                <div className="pb-6">
                  <Input
                    {...register("name")}
                    placeholder="Your name"
                    fullWidth
                    error={!!errors.name}
                    helperText={errors.name?.message}
                  />
                </div>
              </FieldSet>
            </div>
            <div className="text-sm">
              <FieldSet title="Sähköposti">
                <div className="pb-6">
                  <Input
                    {...register("email")}
                    type="email"
                    placeholder="you@example.com"
                    fullWidth
                    error={!!errors.email}
                    helperText={errors.email?.message}
                  />
                </div>
              </FieldSet>
            </div>

            <div className="mt-6 flex gap-2">
              <Button
                type="submit"
                className="bg-secondary"
                disabled={!isValid || isSubmitting}
              >
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
            <div className="mt-2.5 flex flex-col gap-2">
              {quotas.map((quota) => {
                const signupCount = seatHoldingSignupCount(quota);
                const protectedPlacesAreFull =
                  quota.size !== null && signupCount >= quota.size;
                const showExactAvailablePlaces =
                  quota.size !== null &&
                  (quota.sharedPlacesAllocation === "NEVER" ||
                    event.extraCapacity === 0);
                const signupGoesToQueue =
                  protectedPlacesAreFull &&
                  (quota.sharedPlacesAllocation !== "IMMEDIATE" ||
                    sharedPlacesAreFull);

                return (
                  <div
                    key={quota.id}
                    className="surface-muted flex items-center justify-between gap-3 p-2 sm:px-3 sm:py-2"
                  >
                    <div className="min-w-0">
                      <h3 className="text-brand-dark truncate text-sm font-semibold">
                        {quota.title}
                      </h3>
                      {showExactAvailablePlaces ? (
                        signupGoesToQueue ? (
                          <p className="text-brand-danger text-xs font-medium">
                            Täynnä – ilmoittaudut jonoon
                          </p>
                        ) : (
                          <p className="text-xs text-gray-600 tabular-nums">
                            {signupCount} / {quota.size} ilmoittautunutta
                          </p>
                        )
                      ) : (
                        <p className="text-xs text-gray-600 tabular-nums">
                          {signupCount} ilmoittautunutta
                        </p>
                      )}
                    </div>
                    <div className="flex shrink-0 items-center gap-1">
                      {showDemoControls && (
                        <Button
                          type="button"
                          size="small"
                          className="min-w-8 px-2"
                          color="neutral"
                          variant="bordered"
                          title={`Poista demoilmo kiintiöstä ${quota.title}`}
                          aria-label={`Poista demoilmo kiintiöstä ${quota.title}`}
                          onClick={() =>
                            removeDemoSignupMutation.mutate({
                              quotaId: quota.id,
                            })
                          }
                          disabled={
                            addDemoSignupMutation.isPending ||
                            removeDemoSignupMutation.isPending
                          }
                          loading={
                            removeDemoSignupMutation.isPending &&
                            removeDemoSignupMutation.variables?.quotaId ===
                              quota.id
                          }
                        >
                          −1
                        </Button>
                      )}
                      <Button
                        size="small"
                        className="shrink-0 px-3"
                        color="primary"
                        onClick={handleSubmit(getHandleSignup(quota.id))}
                        disabled={
                          !isRegistrationOpen || !isValid || isSubmitting
                        }
                        loading={
                          isSubmitting &&
                          createSignupMutation.variables?.quotaId === quota.id
                        }
                      >
                        {signupGoesToQueue ? "Ilmoo jonoon" : "Ilmoo"}
                      </Button>
                      {showDemoControls && (
                        <Button
                          type="button"
                          size="small"
                          className="min-w-8 px-2"
                          color="neutral"
                          variant="bordered"
                          title={`Lisää demoilmo kiintiöön ${quota.title}`}
                          aria-label={`Lisää demoilmo kiintiöön ${quota.title}`}
                          onClick={() =>
                            addDemoSignupMutation.mutate({ quotaId: quota.id })
                          }
                          disabled={
                            addDemoSignupMutation.isPending ||
                            removeDemoSignupMutation.isPending
                          }
                          loading={
                            addDemoSignupMutation.isPending &&
                            addDemoSignupMutation.variables?.quotaId ===
                              quota.id
                          }
                        >
                          +1
                        </Button>
                      )}
                    </div>
                  </div>
                );
              })}
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

  const { data: event, isLoading } = api.events.getEventByID.useQuery(
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
        <div className="mx-auto w-full max-w-5xl min-w-0">
          <div
            className={`w-full min-w-0 p-4 sm:p-5 lg:p-6 ${
              event?.draft
                ? "rounded-control shadow-soft border border-amber-400 bg-amber-100"
                : "surface-panel"
            }`}
          >
            <Link
              href="/"
              className="text-brand-secondary hover:text-brand-dark -mx-1 mb-5 flex min-w-0 items-center gap-2 border-b border-stone-200 pb-4 text-sm font-semibold transition-colors sm:mx-0"
            >
              <span className="shrink-0 text-base" aria-hidden>
                ←
              </span>
              <span className="min-w-0">Takaisin etusivulle</span>
            </Link>

            {isLoading || !event ? (
              <div className="flex justify-center py-16">
                <LoadingSpinner />
              </div>
            ) : (
              <>
                <div className="mb-6 flex flex-wrap items-start justify-between gap-3">
                  <div className="flex flex-wrap items-center gap-3">
                    <h1 className="text-brand-dark text-2xl font-extrabold uppercase sm:text-3xl">
                      {event.title}
                    </h1>
                    {event.draft && (
                      <span className="rounded-control inline-flex items-center border border-amber-400 bg-amber-200 px-2.5 py-1 text-xs font-bold tracking-wide text-amber-950 uppercase">
                        <Icon icon="draft" className="mr-1.5 h-3.5 w-3.5" />
                        Luonnos
                      </span>
                    )}
                  </div>
                  {isAdmin && (
                    <Button.Link href={`/events/${event.id}/edit`}>
                      Muokkaa tapahtumaa
                    </Button.Link>
                  )}
                </div>

                <div className="flex w-full flex-col gap-8 sm:flex-row sm:items-start sm:gap-8 lg:gap-10">
                  <div className="w-full min-w-0 space-y-1 text-sm sm:flex-1 sm:basis-0 sm:pr-2 sm:text-base">
                    <h2 className="text-brand-secondary mb-3 text-xs font-bold tracking-widest uppercase">
                      Tiedot
                    </h2>
                    <p>
                      <span className="text-brand-dark font-semibold">
                        Ajankohta:{" "}
                      </span>
                      {formatEventDateTime(event.date)}
                    </p>
                    {event.location && (
                      <p>
                        <span className="text-brand-dark font-semibold">
                          Sijainti:{" "}
                        </span>
                        {event.location}
                      </p>
                    )}
                    <Divider spacingY="md" />
                    <div className="prose prose-sm text-brand-dark max-w-none text-base leading-relaxed">
                      {event.description}
                    </div>
                  </div>

                  <div className="w-full min-w-0 border-t border-stone-200 pt-8 sm:flex-1 sm:basis-0 sm:border-t-0 sm:border-l sm:border-stone-200 sm:pt-0 sm:pl-6 lg:pl-8">
                    <HydrationZustand>
                      {event && <Registration event={event} />}
                    </HydrationZustand>
                  </div>
                </div>

                {event.signupsPublic && (
                  <>
                    <Divider spacingY="lg" />
                    <ParticipantsTable event={event} />
                  </>
                )}
              </>
            )}
          </div>
        </div>
      </Layout>
    </>
  );
}
