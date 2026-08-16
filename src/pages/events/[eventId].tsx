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

type SignupConflictChoice = {
  candidateSignupId: string;
  existingSignup: {
    quotaTitle: string;
    isCompleted: boolean;
    placement: {
      type: "QUEUE" | "QUOTA";
      position: number;
    };
  };
  selectedQuotaTitle: string;
  selectedPlacement: {
    type: "QUEUE" | "QUOTA";
    position: number;
  };
};

const quotaSegmentColors = [
  { className: "bg-brand-primary" },
  { className: "bg-[#66859a]" },
  { className: "bg-[#a18452]" },
  { className: "bg-[#806f91]" },
  { className: "bg-[#a56f63]" },
  { className: "bg-[#568b85]" },
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
  const [signupConflict, setSignupConflict] =
    useState<SignupConflictChoice | null>(null);

  const createSignupMutation = api.signups.createSignup.useMutation();
  const resolveSignupConflictMutation =
    api.signups.resolveSignupConflict.useMutation();
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

    return {
      quota,
      signupCount,
      reservedPlacesRemaining: quota.size - protectedPlacesUsed,
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

  const showCompletedSignupWarning = () =>
    alert.warning(
      "Tällä sähköpostilla on jo vahvistettu ilmo. Muokkaa olemassa olevaa ilmoa sähköpostiin tulleen linkin kautta",
      { timeoutMs: 10000 },
    );

  const resolveSignupConflict = async (choice: "NEW" | "EXISTING") => {
    if (!signupConflict) return;

    try {
      const result = await resolveSignupConflictMutation.mutateAsync({
        candidateSignupId: signupConflict.candidateSignupId,
        choice,
      });
      setSignupConflict(null);

      if (!result.canContinue) {
        showCompletedSignupWarning();
        return;
      }

      await router.push(
        `/events/${event.id}/${result.signup.id}${result.isExistingSignup ? "?existing=true" : ""}`,
      );
    } catch (error) {
      console.error(error);
      if (error instanceof Error) {
        alert.error(error.message, { timeoutMs: 10000 });
      }
    }
  };

  const getHandleSignup = (quotaId: string) => {
    return async (data: { name: string; email: string }) => {
      try {
        const result = await createSignupMutation.mutateAsync({
          quotaId,
          name: data.name,
          email: data.email,
        });
        if (result) {
          if ("requiresSignupChoice" in result && result.requiresSignupChoice) {
            setSignupConflict({
              candidateSignupId: result.signup.id,
              existingSignup: result.existingSignup,
              selectedQuotaTitle: result.selectedQuotaTitle,
              selectedPlacement: result.selectedPlacement,
            });
            return;
          }

          await router.push(
            `/events/${event.id}/${result.signup.id}${result.isExistingSignup ? "?existing=true" : ""}`,
          );
        }
      } catch (error) {
        console.error(error);
        if (error instanceof TRPCClientError && error.data.code === "CONFLICT")
          // TODO: move to separate alert page here which allows to request link again
          return showCompletedSignupWarning();
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
        {isEditingUserData ? (
          <form
            className="rounded-card mb-3 border border-stone-200 bg-white p-4"
            onSubmit={saveUserData}
          >
            <h3 className="text-brand-secondary text-base font-bold tracking-tight sm:text-lg">
              Konfiguroi ilmo-identiteettisi
            </h3>
            <p className="text-brand-dark mt-1 text-sm">
              Aseta nimi ja sähköposti ennen ilmoittautumista. Huomaa, että voit
              ilmoittautua tapahtumaan vain kerran.
            </p>
            <p className="mt-2 text-xs leading-relaxed text-gray-600">
              {event.signupsPublic && <span>Nimi on julkinen tieto. </span>}
              Voit halutessasi ilmoittautua salanimellä tapahtumaan.
            </p>

            <div className="mt-4 grid grid-cols-1 gap-3 lg:grid-cols-2">
              <Input
                {...register("name")}
                placeholder="Nimi"
                fullWidth
                error={!!errors.name}
                helperText={errors.name?.message}
              />
              <Input
                {...register("email")}
                type="email"
                placeholder="sinä@example.com"
                fullWidth
                error={!!errors.email}
                helperText={errors.email?.message}
              />
            </div>

            <div className="mt-3 flex flex-wrap gap-2">
              <Button
                type="submit"
                variant="filled"
                color="primary"
                disabled={!isValid || isSubmitting}
              >
                Tallenna
              </Button>
              {storedUser && (
                <Button
                  type="button"
                  color="neutral"
                  variant="bordered"
                  onClick={() => {
                    reset({
                      name: storedUser.name ?? "",
                      email: storedUser.email ?? "",
                    });
                    setIsEditingUserData(false);
                  }}
                >
                  Peruuta
                </Button>
              )}
            </div>
          </form>
        ) : (
          <p className="surface-panel border-l-brand-primary mb-3 border-l-2 px-3 py-2 text-sm text-gray-600">
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
        )}
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

              <div>
                <div
                  className="flex h-3 overflow-hidden rounded-full bg-stone-200"
                  role="img"
                  aria-label={`${occupiedPlaces} / ${totalCapacity} paikkaa varattu`}
                >
                  {quotaCapacitySegments
                    .filter(({ signupCount }) => signupCount > 0)
                    .map(({ quota, signupCount, color }) => (
                      <div
                        key={`occupied-${quota.id}`}
                        className={`h-full shrink-0 border-r border-white last:border-r-0 ${color.className}`}
                        style={{
                          width: `${(signupCount / totalCapacity) * 100}%`,
                        }}
                        title={`${quota.title}: ${signupCount} ilmoittautunutta`}
                      />
                    ))}
                </div>
                <div className="flex h-0.5 overflow-hidden rounded-full">
                  <div
                    className="h-full shrink-0"
                    style={{
                      width: `${(occupiedPlaces / totalCapacity) * 100}%`,
                    }}
                  />
                  {quotaCapacitySegments
                    .filter(
                      ({ reservedPlacesRemaining }) =>
                        reservedPlacesRemaining > 0,
                    )
                    .map(({ quota, reservedPlacesRemaining, color }) => (
                      <div
                        key={`reserved-${quota.id}`}
                        className={`h-full shrink-0 ${color.className}`}
                        style={{
                          width: `${(reservedPlacesRemaining / totalCapacity) * 100}%`,
                        }}
                        title={`${quota.title}: ${reservedPlacesRemaining} kiintiöpaikkaa jäljellä`}
                      />
                    ))}
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-gray-600">
                {quotaCapacitySegments.map(({ quota, color }) => (
                  <span
                    key={quota.id}
                    className="flex shrink-0 items-center gap-1.5"
                  >
                    <span
                      className={`h-2.5 w-2.5 rounded-sm ${color.className}`}
                      aria-hidden
                    />
                    {quota.title}
                  </span>
                ))}
                <span className="flex shrink-0 items-center gap-1.5">
                  <span className="flex h-2.5 w-4 items-end" aria-hidden>
                    <span className="bg-brand-primary h-0.5 w-full rounded-full" />
                  </span>
                  Kiintiölle varatut paikat
                </span>
              </div>
            </>
          )}
        </div>
        {!isEditingUserData && (
          <div className="flex flex-col gap-2">
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
                      <p className="text-xs text-gray-600 tabular-nums">
                        {signupCount} / {quota.size} ilmoittautunutta
                      </p>
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
                      disabled={!isRegistrationOpen || !isValid || isSubmitting}
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
                          addDemoSignupMutation.variables?.quotaId === quota.id
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
        )}
      </div>

      {signupConflict && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="signup-conflict-title"
        >
          <div className="surface-panel shadow-card w-full max-w-md p-6">
            <h3
              id="signup-conflict-title"
              className="text-brand-dark text-lg font-bold"
            >
              Vaihda kiintiötä?
            </h3>
            <p className="mt-2 text-sm text-gray-600">
              Löysimme tällä sähköpostilla aiemman{" "}
              {signupConflict.existingSignup.isCompleted
                ? "vahvistetun"
                : "vahvistamattoman"}{" "}
              ilmoittautumisen.
            </p>
            <div className="mt-4 space-y-2 text-sm">
              <p>
                <span className="font-medium">Aiempi:</span>{" "}
                {signupConflict.existingSignup.quotaTitle} —{" "}
                {signupConflict.existingSignup.placement.type === "QUEUE"
                  ? "Jonossa"
                  : "Kiintiössä"}{" "}
                {signupConflict.existingSignup.placement.position}
              </p>
              <p>
                <span className="font-medium">Uusi:</span>{" "}
                {signupConflict.selectedQuotaTitle} —{" "}
                {signupConflict.selectedPlacement.type === "QUEUE"
                  ? "Jonossa"
                  : "Kiintiössä"}{" "}
                {signupConflict.selectedPlacement.position}
              </p>
            </div>

            <div className="mt-5 flex flex-col gap-2 sm:flex-row sm:justify-end">
              <Button
                type="button"
                variant="bordered"
                color="neutral"
                className="w-full sm:w-auto"
                onClick={() => resolveSignupConflict("EXISTING")}
                disabled={resolveSignupConflictMutation.isPending}
                loading={
                  resolveSignupConflictMutation.isPending &&
                  resolveSignupConflictMutation.variables?.choice === "EXISTING"
                }
              >
                Pidä aiempi ilmo
              </Button>
              <Button
                type="button"
                color="primary"
                className="w-full sm:w-auto"
                onClick={() => resolveSignupConflict("NEW")}
                disabled={resolveSignupConflictMutation.isPending}
                loading={
                  resolveSignupConflictMutation.isPending &&
                  resolveSignupConflictMutation.variables?.choice === "NEW"
                }
              >
                Valitse uusi kiintiö
              </Button>
            </div>
          </div>
        </div>
      )}
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
