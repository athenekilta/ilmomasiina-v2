import { useRouter } from "next/router";
import { api } from "@/utils/api";
import { Layout } from "@/features/layout/Layout";
import { Button } from "@/components/Button";
import { ParticipantsTable } from "@/features/events/components/ParticipantsTable";
import { MarkdownContent } from "@/features/events/components/MarkdownContent";
import { PageHead } from "@/features/layout/PageHead";
import { RegistrationDate } from "@/features/events/utils/utils";
import { useEffect, useState } from "react";
import { useNow } from "@/hooks/useNow";
import { isUnavailableError } from "@/features/events/utils/draftSync";
import { useManagementUser } from "@/features/auth/hooks/useManagementUser";
import { ManagementRole } from "@/generated/prisma";
import { Input } from "@/components/Input";


import { useGuestIdentityForm } from "@/features/events/hooks/useGuestIdentityForm";
import type { RouteOutput } from "@/types/types";
import { useAlert } from "@/features/alert/hooks/useAlert";
import Link from "next/link";
import { formatEventDateTime, formatRegistration } from "@/utils/format";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { TRPCClientError } from "@trpc/client";
import { Icon } from "@/components/Icon";
import { Divider } from "@/components/Divider";
import { getEventImage } from "@/features/eventCard/eventCardImage";
import { BADGE_TONE_CLASS } from "@/features/eventCard/badgeTone";

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
  now,
}: {
  event: RouteOutput["events"]["getEventByID"];
  now: number | null;
}) {
  const router = useRouter();
  const apiContext = api.useContext();
  const { isRegistrationOpen } = RegistrationDate(event, now ?? undefined);

  const alert = useAlert();

  const {
    register,
    formState: { isSubmitting, isValid, errors },
    handleSubmit,
    reset,
    storedUser,
    isIdentityLoading,
    setUser,
  } = useGuestIdentityForm();
  const [isEditingUserData, setIsEditingUserData] = useState(false);
  const [signupConflict, setSignupConflict] =
    useState<SignupConflictChoice | null>(null);

  const createSignupMutation = api.signups.createSignup.useMutation();
  const sendSignupAccessEmailMutation =
    api.signups.sendMySignupAccessEmail.useMutation();
  const signupStatusQuery = api.signups.getMySignupStatus.useQuery(
    { eventId: event.id },
    { enabled: !isIdentityLoading },
  );

  const resolveSignupConflictMutation =
    api.signups.resolveSignupConflict.useMutation();
  const addDemoSignupMutation = api.signups.addDemoSignup.useMutation({
    onError: (error) => alert.error(error.message),
  });
  const removeDemoSignupMutation = api.signups.removeDemoSignup.useMutation({
    onError: (error) => alert.error(error.message),
  });
  const showDemoControls = process.env.NODE_ENV === "development";
  const signupStatus = signupStatusQuery.data;
  const hasExistingSignup =
    signupStatusQuery.isPending ||
    (signupStatus !== null && signupStatus !== undefined);

  const quotas = event.Quotas.filter((quota) => quota.id !== "queue");
  const finiteQuotas = quotas.filter(
    (quota): quota is typeof quota & { size: number } => quota.size !== null,
  );
  const hasUnlimitedQuota = finiteQuotas.length !== quotas.length;
  const seatHoldingSignupCount = (quota: (typeof quotas)[number]) =>
    quota.seatHoldingSignupCount;
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
    if (!isIdentityLoading && !storedUser) {
      setIsEditingUserData(true);
    }
  }, [isIdentityLoading, storedUser]);

  const saveUserData = handleSubmit(async (data) => {
    try {
      await setUser({ name: data.name, email: data.email });
      await apiContext.signups.getMySignupStatus.invalidate({
        eventId: event.id,
      });
      setIsEditingUserData(false);
    } catch (e) {
      console.error("Failed to save user session identity", e);
    }
  });

  const showCompletedSignupWarning = () =>
    alert.warning(
      "Tällä sähköpostilla on jo ilmo. Muokkaa olemassa olevaa ilmoa sähköpostiin tulleen linkin kautta",
      { timeoutMs: 10000 },
    );

  const requestSignupAccessEmail = async () => {
    try {
      await sendSignupAccessEmailMutation.mutateAsync({ eventId: event.id });
      alert.success(
        "Ilmon muokkauslinkki lähetetty sähköpostiin",
        { timeoutMs: 10000 },
      );
    } catch (error) {
      console.error(error);
      alert.error("Linkin lähettäminen epäonnistui. Yritä uudelleen.", {
        timeoutMs: 10000,
      });
    }
  };


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

      await router.push(`/events/${event.id}/${result.signup.id}`);
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
          await apiContext.userSession.getIdentity.invalidate();
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
          <form className="surface-muted mb-3 p-4" onSubmit={saveUserData}>
            <h3 className="text-brand-secondary text-base font-extrabold tracking-wide uppercase sm:text-lg">
              Täydennä ilmotietosi
            </h3>
            <p className="text-brand-dark mt-1 text-sm">
              Aseta nimi ja sähköposti ennen ilmoa. Huomaa, että voit ilmota
              tapahtumaan vain kerran.
            </p>
            <p className="mt-2 text-xs leading-relaxed text-gray-600">
              {event.signupsPublic && <span>Nimi on julkinen tieto. </span>}
              Voit halutessasi ilmota salanimellä tapahtumaan.
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
        ) : signupStatus?.state === "COMPLETED" ? (
          <div
            className="surface-muted text-brand-dark/80 mb-3 px-3 py-2 text-sm"
            role="status"
          >
            <p>
              <span className="font-medium text-gray-900">Ilmo kunnossa!</span>
              <br />
              Olet ilmonnut sähköpostilla{" "}
              <span className="text-gray-900">{storedUser?.email}</span>.
              {!signupStatus.canEditDirectly &&
                " Muokkaa ilmoa sähköpostista löytyvällä linkillä."}
            </p>
            <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1">
              {signupStatus.canEditDirectly && signupStatus.id ? (
                <Link
                  href={`/events/${event.id}/${signupStatus.id}`}
                  className="text-brand-primary hover:underline"
                >
                  Muokkaa ilmoa
                </Link>
              ) : (
                <button
                  type="button"
                  onClick={requestSignupAccessEmail}
                  disabled={sendSignupAccessEmailMutation.isPending}
                  className="text-brand-primary cursor-pointer border-none p-0 hover:underline disabled:cursor-wait disabled:opacity-60"
                >
                  {sendSignupAccessEmailMutation.isPending
                    ? "Lähetetään linkkiä…"
                    : "Lähetä muokkauslinkki"}
                </button>
              )}
              <button
                type="button"
                onClick={() => setIsEditingUserData(true)}
                className="text-brand-primary cursor-pointer border-none p-0 hover:underline"
              >
                Uusi ilmo
              </button>
            </div>
          </div>
        ) : signupStatus?.state === "IN_PROGRESS" ? (
          <div
            className="surface-muted text-brand-dark/80 mb-3 px-3 py-2 text-sm"
            role="status"
          >
            <p>
              <span className="font-medium text-gray-900">Ilmo kesken!</span>
              <br />
              Sinulla on keskeneräinen ilmoittautuminen sähköpostilla{" "}
              <span className="text-gray-900">{storedUser?.email}</span>.
            </p>
            <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1">
              {signupStatus.canEditDirectly && signupStatus.id ? (
                <Link
                  href={`/events/${event.id}/${signupStatus.id}`}
                  className="text-brand-primary hover:underline"
                >
                  Viimeistele ilmo
                </Link>
              ) : (
                <button
                  type="button"
                  onClick={requestSignupAccessEmail}
                  disabled={sendSignupAccessEmailMutation.isPending}
                  className="text-brand-primary cursor-pointer border-none p-0 hover:underline disabled:cursor-wait disabled:opacity-60"
                >
                  {sendSignupAccessEmailMutation.isPending
                    ? "Lähetetään linkkiä…"
                    : "Lähetä muokkauslinkki"}
                </button>
              )}

              <button
                type="button"
                onClick={() => setIsEditingUserData(true)}
                className="text-brand-primary cursor-pointer border-none p-0 hover:underline"
              >
                Uusi ilmo
              </button>
            </div>
          </div>
        ) : (
          <p className="surface-muted text-brand-dark/80 mb-3 px-3 py-2 text-sm">
            Hei{" "}
            <span className="font-medium text-gray-900">
              {storedUser?.name}
            </span>
            , olet ilmoamassa sähköpostilla{" "}
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
                    {quota.title}: {seatHoldingSignupCount(quota)} ilmonnutta
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
                        title={`${quota.title}: ${signupCount} ilmonnutta`}
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
                    <p className="text-xs text-gray-600 tabular-nums">
                      {showExactAvailablePlaces
                        ? `${signupCount} / ${quota.size} ilmonnutta`
                        : `${signupCount} ilmonnutta`}
                      {quota.waitlistedSignupCount > 0 &&
                        ` · ${quota.waitlistedSignupCount} jonossa`}
                    </p>
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
                    {!hasExistingSignup && (
                      <Button
                        size="small"
                        className="shrink-0 px-3"
                        color="primary"
                        onClick={handleSubmit(getHandleSignup(quota.id))}
                        disabled={!isRegistrationOpen || isSubmitting}
                        loading={
                          isSubmitting &&
                          createSignupMutation.variables?.quotaId === quota.id
                        }
                      >
                        {signupGoesToQueue ? "Ilmoa jonoon" : "Ilmoa"}
                      </Button>
                    )}
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
              ilmon.
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

/* Unmounts itself when the file is missing, so the sand background shows
   through instead of the browser's broken-image glyph. */
function EventBannerImage({
  src,
  fallback,
}: {
  src: string;
  fallback: string;
}) {
  const [failures, setFailures] = useState(0);

  if (failures > 1) return null;

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={failures ? fallback : src}
      alt=""
      aria-hidden
      className="absolute inset-0 h-full w-full object-cover"
      onError={() => setFailures((count) => count + 1)}
    />
  );
}

export default function EventPage() {
  const now = useNow();
  const router = useRouter();
  const eventId = Number(router.query.eventId);

  const loginUser = useManagementUser();
  const canEditEvent =
    loginUser.data?.role === ManagementRole.event_editor ||
    loginUser.data?.role === ManagementRole.superadmin;

  const { data: event, isLoading, error, refetch } = api.events.getEventByID.useQuery(
    { eventId: eventId! },
    {
      enabled: !isNaN(eventId),
      staleTime: 0, // Always fetch fresh data
      gcTime: 0, // Don't cache the data
    },
  );

  // Hype has nothing left to sell once the doors are shut — same rule the
  // cards on the front page follow.
  const registrationClosed = event
    ? RegistrationDate(event, now ?? undefined).isRegistrationClosed
    : false;

  if (isUnavailableError(error) || (!isLoading && !event)) {
    return <Layout><PageHead title="Tapahtuma ei ole saatavilla" />
      <div role="alert" className="surface-panel space-y-4 p-6">
        <p>{error?.data?.code === "FORBIDDEN" || error?.data?.code === "UNAUTHORIZED"
          ? "Sinulla ei ole oikeutta nähdä tätä tapahtumaa."
          : error?.data?.code === "NOT_FOUND" || !event
            ? "Tapahtumaa ei löytynyt tai se ei ole enää saatavilla."
            : "Tapahtuman päivitys epäonnistui. Yritä uudelleen."}</p>
        <Button onClick={() => void refetch()}>Yritä uudelleen</Button>
        <Button.Link href="/">Takaisin tapahtumiin</Button.Link>
      </div>
    </Layout>;
  }

  return (
    <>
      <PageHead title={event?.title || "Loading..."} />
      <Layout>
        <div className="mx-auto w-full max-w-5xl min-w-0">
          {error && <div role="alert" className="surface-muted mb-4 p-4 text-sm">
            Tapahtuman päivitys epäonnistui. Näytetyt tiedot voivat olla vanhentuneita.
            <Button onClick={() => void refetch()}>Yritä uudelleen</Button>
          </div>}
          <Link
            href="/"
            className="text-brand-secondary hover:text-brand-dark focus-visible:ring-brand-secondary mb-3 flex w-fit min-w-0 items-center gap-2 rounded-full text-sm font-semibold transition-colors focus-visible:ring-2 focus-visible:outline-hidden"
          >
            <span className="shrink-0 text-base" aria-hidden>
              ←
            </span>
            <span className="min-w-0">Takaisin etusivulle</span>
          </Link>

          <div
            className={`w-full min-w-0 overflow-hidden ${
              event?.draft
                ? "rounded-card shadow-soft border border-amber-400 bg-amber-100"
                : "surface-panel"
            }`}
          >
            {/* Shared with the cards, with a longer fade for wider banners. */}
            <div className="event-banner event-banner--detail bg-brand-sand relative aspect-[5/2] w-full overflow-hidden">
              {event && (
                <EventBannerImage
                  key={event.imageId ?? "placeholder"}
                  src={getEventImage(event.id, event.imageId)}
                  fallback={getEventImage(event.id)}
                />
              )}

              {event?.badgeText && !registrationClosed && (
                <span
                  className={`shadow-card absolute top-4 right-4 z-10 max-w-[70%] truncate rounded-full px-3 py-1.5 text-xs font-bold tracking-wide uppercase sm:text-[0.8125rem] ${BADGE_TONE_CLASS[event.badgeTone]}`}
                >
                  {event.badgeText}
                </span>
              )}

              {event && (
                <div className="absolute inset-x-0 bottom-0">
                  <div className="event-banner-fade" aria-hidden />
                  <div className="event-banner-caption flex flex-wrap items-center gap-3 px-4 pb-3 sm:px-5 lg:px-6">
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
                </div>
              )}
            </div>

            <div className="min-w-0 p-4 sm:p-5 lg:p-6">
              {isLoading || !event ? (
                <div className="flex justify-center py-16">
                  <LoadingSpinner />
                </div>
              ) : (
                <>
                  {canEditEvent && (
                    <div className="mb-6 flex justify-end">
                      <Button.Link href={`/events/${event.id}/edit`}>
                        Muokkaa tapahtumaa
                      </Button.Link>
                    </div>
                  )}

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
                      {event.description && (
                        <MarkdownContent value={event.description} />
                      )}
                    </div>

                    <div className="w-full min-w-0 border-t border-stone-200 pt-8 sm:flex-1 sm:basis-0 sm:border-t-0 sm:border-l sm:border-stone-200 sm:pt-0 sm:pl-6 lg:pl-8">
                      {event && (
                        <Registration key={event.id} event={event} now={now} />
                      )}
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
        </div>
      </Layout>
    </>
  );
}
