import { useRouter } from "next/router";
import { api } from "@/utils/api";
import { Layout } from "@/features/layout/Layout";
import { Button } from "@/components/Button";
import { env } from "@/env/client.mjs";
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
import { Check, UserRound } from "lucide-react";
import { Divider } from "@/components/Divider";
import { getEventImage } from "@/features/eventCard/eventCardImage";
import { BADGE_TONE_CLASS } from "@/features/eventCard/badgeTone";
import { QuotaBars } from "@/features/events/quotaBars/QuotaBars";
import { buildQuotaBars } from "@/features/events/quotaBars/quotaBarModel";
import { QUEUE_QUOTA_ID } from "@/features/events/utils/queueQuota";
import { useLocale, useTranslations } from "@/i18n/I18nProvider";
import { publicEventsMessages } from "@/i18n/messages/events";

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

function Registration({
  event,
  now,
}: {
  event: RouteOutput["events"]["getEventByID"];
  now: number | null;
}) {
  const router = useRouter();
  const locale = useLocale();
  const messages = useTranslations(publicEventsMessages);
  const apiContext = api.useContext();
  const { isRegistrationOpen, isRegistrationClosed } = RegistrationDate(
    event,
    now ?? undefined,
  );

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
    onError: () => alert.error(messages.registration.signupFailed),
  });
  const removeDemoSignupMutation = api.signups.removeDemoSignup.useMutation({
    onError: () => alert.error(messages.registration.signupFailed),
  });
  const showDemoControls =
    process.env.NODE_ENV === "development" &&
    env.NEXT_PUBLIC_ENABLE_DEMO_CONTROLS === "true";
  const signupStatus = signupStatusQuery.data;
  const hasExistingSignup =
    signupStatusQuery.isPending ||
    (signupStatus !== null && signupStatus !== undefined);

  const quotas = event.Quotas.filter((quota) => quota.id !== QUEUE_QUOTA_ID);
  const seatHoldingSignupCount = (quota: (typeof quotas)[number]) =>
    quota.seatHoldingSignupCount;
  // One source of truth for the capacity arithmetic: the bars draw this same
  // model, so the buttons and the bars can never disagree about whether a
  // signup still fits.
  const quotaBars = buildQuotaBars(event);
  const sharedPlacesAreFull =
    quotaBars.shared === null || quotaBars.shared.remaining === 0;

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
    alert.warning(messages.registration.completedWarning, {
      timeoutMs: 10000,
    });

  const requestSignupAccessEmail = async () => {
    try {
      await sendSignupAccessEmailMutation.mutateAsync({
        eventId: event.id,
        locale,
      });
      alert.success(messages.registration.editLinkSent, {
        timeoutMs: 10000,
      });
    } catch (error) {
      console.error(error);
      alert.error(messages.registration.editLinkFailed, {
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
        locale,
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
        alert.error(messages.registration.signupFailed, { timeoutMs: 10000 });
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
          locale,
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
          return alert.error(messages.registration.signupFailed, {
            timeoutMs: 10000,
          });

        alert.error(messages.registration.unknownError, { timeoutMs: 10000 });
      }
    };
  };

  return (
    <div>
      <div className="flex flex-col gap-9">
        {/* One card for the whole signup: what this is, when it closes, who
            you are, and the choice. Split across four blocks it repeated its
            own heading twice and left the deadline owned by nothing. */}
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-0.5">
            <h2 className="eyebrow text-brand-secondary">
              {messages.registration.title}
            </h2>
            <p className="text-brand-primary text-[13px] font-semibold">
              {formatRegistration(
                event.registrationStartDate,
                event.registrationEndDate,
                locale,
                messages.registration,
              )}
            </p>
          </div>

          {isEditingUserData && !isRegistrationClosed ? (
            <form
              className="surface-muted -mx-[5px] p-4 sm:mx-0"
              onSubmit={saveUserData}
            >
              <h3 className="label-caps text-brand-secondary text-[13px]">
                {messages.identity.completeTitle}
              </h3>
              <p className="text-brand-dark mt-1 text-sm">
                {messages.identity.completeDescription}
              </p>
              <p className="mt-2 text-xs leading-relaxed text-gray-600">
                {event.signupsPublic
                  ? messages.identity.publicPrivacy
                  : messages.identity.privatePrivacy}
              </p>

              <div className="mt-4 grid grid-cols-1 gap-3 lg:grid-cols-2">
                <Input
                  {...register("name")}
                  placeholder={messages.identity.name}
                  fullWidth
                  error={!!errors.name}
                  helperText={errors.name?.message}
                />
                <Input
                  {...register("email")}
                  type="email"
                  placeholder={messages.identity.emailPlaceholder}
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
                  {messages.identity.save}
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
                    {messages.identity.cancel}
                  </Button>
                )}
              </div>
            </form>
          ) : signupStatus?.state === "COMPLETED" ? (
            <div
              className="surface-muted text-brand-dark/80 -mx-[5px] px-3 py-2 text-sm sm:mx-0"
              role="status"
            >
              <p>
                <span className="font-medium text-gray-900">
                  {messages.registration.signupComplete}
                </span>
                <br />
                {messages.registration.completedWithEmail(
                  storedUser?.email ?? "",
                )}
                {isRegistrationClosed ? (
                  <>
                    <br />
                    {messages.registration.registrationClosedCannotEdit}
                  </>
                ) : (
                  !signupStatus.canEditDirectly && (
                    <> {messages.registration.editFromEmail}</>
                  )
                )}
              </p>
              {!isRegistrationClosed && (
                <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1">
                  {signupStatus.canEditDirectly && signupStatus.id ? (
                    <Link
                      href={`/events/${event.id}/${signupStatus.id}`}
                      className="text-brand-primary hover:underline"
                    >
                      {messages.registration.editSignup}
                    </Link>
                  ) : (
                    <button
                      type="button"
                      onClick={requestSignupAccessEmail}
                      disabled={sendSignupAccessEmailMutation.isPending}
                      className="text-brand-primary cursor-pointer border-none p-0 hover:underline disabled:cursor-wait disabled:opacity-60"
                    >
                      {sendSignupAccessEmailMutation.isPending
                        ? messages.registration.sendingLink
                        : messages.registration.sendEditLink}
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => setIsEditingUserData(true)}
                    className="text-brand-primary cursor-pointer border-none p-0 hover:underline"
                  >
                    {messages.registration.newSignup}
                  </button>
                </div>
              )}
            </div>
          ) : signupStatus?.state === "IN_PROGRESS" ? (
            <div
              className="surface-muted text-brand-dark/80 -mx-[5px] px-3 py-2 text-sm sm:mx-0"
              role="status"
            >
              <p>
                <span className="font-medium text-gray-900">
                  {messages.registration.signupInProgress}
                </span>
                <br />
                {messages.registration.inProgressWithEmail(
                  storedUser?.email ?? "",
                )}
                {isRegistrationClosed && (
                  <>
                    <br />
                    {messages.registration.registrationClosedCannotEdit}
                  </>
                )}
              </p>
              {!isRegistrationClosed && (
                <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1">
                  {signupStatus.canEditDirectly && signupStatus.id ? (
                    <Link
                      href={`/events/${event.id}/${signupStatus.id}`}
                      className="text-brand-primary hover:underline"
                    >
                      {messages.registration.finishSignup}
                    </Link>
                  ) : (
                    <button
                      type="button"
                      onClick={requestSignupAccessEmail}
                      disabled={sendSignupAccessEmailMutation.isPending}
                      className="text-brand-primary cursor-pointer border-none p-0 hover:underline disabled:cursor-wait disabled:opacity-60"
                    >
                      {sendSignupAccessEmailMutation.isPending
                        ? messages.registration.sendingLink
                        : messages.registration.sendEditLink}
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() => setIsEditingUserData(true)}
                    className="text-brand-primary cursor-pointer border-none p-0 hover:underline"
                  >
                    {messages.registration.newSignup}
                  </button>
                </div>
              )}
            </div>
          ) : isRegistrationClosed ? null : (
            /* Same shape as the header's identity panel: the green check and
             the uppercase heading say "this is settled" at a glance, and the
             values below are what you check before pressing the button. */
            <div className="surface-muted -mx-[5px] flex flex-col gap-2 p-3.5 sm:mx-0">
              <span className="label-caps text-brand-secondary">
                {messages.registration.detailsTitle}
              </span>
              {/* The badge sits beside the values it vouches for, not beside
                the heading — and that leaves the row's right end free for the
                action, level with the same two lines. */}
              <div className="flex items-center gap-2.5">
                <span
                  className="text-brand-dark/70 relative shrink-0"
                  aria-hidden
                >
                  <UserRound size={34} strokeWidth={2} />
                  {/* Inverted from the header's version: there the badge sits
                    on the green bar, where a pale disc carries. On the beige
                    panel the pale disc disappears, so the disc goes dark and
                    the mark light. */}
                  <span className="bg-brand-secondary ring-brand-beige absolute -top-1.5 -right-1.5 flex size-[18px] items-center justify-center rounded-full text-white ring-[3px]">
                    <Check size={11} strokeWidth={4} />
                  </span>
                </span>
                <p className="text-brand-dark min-w-0 flex-1 text-sm leading-snug">
                  <span className="font-bold">{storedUser?.name}</span>
                  <br />
                  <span className="text-brand-dark/70 break-all">
                    {storedUser?.email}
                  </span>
                </p>
                {/* No outline: inside a tinted panel the colour change is the
                  edge, the same way the app's nested surfaces work. */}
                <Button
                  type="button"
                  size="small"
                  color="neutral"
                  variant="filled"
                  className="shrink-0 bg-white enabled:hover:bg-stone-100 enabled:active:bg-stone-200"
                  onClick={() => setIsEditingUserData(true)}
                >
                  {messages.registration.changeIdentity}
                </Button>
              </div>
            </div>
          )}
          {/* A rule and a label between the identity panel and the buttons: a
            beige box running straight into a stack of green read as one
            undifferentiated block. The label carries the context and the
            button carries what varies — the quota names when there is a
            choice, the verb when there is only one quota. */}
          {((!hasExistingSignup && !isRegistrationClosed) ||
            showDemoControls) &&
            !isEditingUserData && (
              <div className="flex flex-col gap-3 pt-2">
                <h3 className="label-caps text-stone-500">
                  {messages.registration.signUp}
                </h3>
                <div className="flex flex-col gap-2">
                  {quotas.map((quota) => {
                    const protectedPlacesAreFull =
                      quota.size !== null &&
                      seatHoldingSignupCount(quota) >= quota.size;
                    const signupGoesToQueue =
                      protectedPlacesAreFull &&
                      (quota.sharedPlacesAllocation !== "IMMEDIATE" ||
                        sharedPlacesAreFull);

                    return (
                      <div key={quota.id} className="flex items-center gap-1">
                        {showDemoControls && (
                          <Button
                            type="button"
                            size="small"
                            className="min-w-8 px-2"
                            color="neutral"
                            variant="bordered"
                            title={messages.registration.removeDemoSignup(
                              quota.title,
                            )}
                            aria-label={messages.registration.removeDemoSignup(
                              quota.title,
                            )}
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
                        {hasExistingSignup || isRegistrationClosed ? (
                          // Nothing to click — already signed up, or the window
                          // has closed — but the demo controls still need to say
                          // which quota they act on.
                          <span className="min-w-0 grow truncate px-2 text-sm font-semibold text-stone-500">
                            {quota.title}
                          </span>
                        ) : (
                          /* Joining a queue is not the same act as taking a
                         place, so the button is not the same button: filled
                         means a place, outlined means a wait. In a list where
                         some quotas are full and some are not, that shows at
                         a glance — and "jonoon" rides along as its own small
                         label rather than as punctuation in the name. */
                          <Button
                            className="min-w-0 grow"
                            color="primary"
                            variant={signupGoesToQueue ? "bordered" : "filled"}
                            onClick={handleSubmit(getHandleSignup(quota.id))}
                            disabled={!isRegistrationOpen || isSubmitting}
                            loading={
                              isSubmitting &&
                              createSignupMutation.variables?.quotaId ===
                                quota.id
                            }
                          >
                            <span className="flex min-w-0 items-baseline justify-center gap-2">
                              <span className="truncate">{quota.title}</span>
                              {signupGoesToQueue && (
                                <span className="label-caps shrink-0 text-[11px] opacity-70">
                                  {messages.registration.joinQueue}
                                </span>
                              )}
                            </span>
                          </Button>
                        )}
                        {showDemoControls && (
                          <Button
                            type="button"
                            size="small"
                            className="min-w-8 px-2"
                            color="neutral"
                            variant="bordered"
                            title={messages.registration.addDemoSignup(
                              quota.title,
                            )}
                            aria-label={messages.registration.addDemoSignup(
                              quota.title,
                            )}
                            onClick={() =>
                              addDemoSignupMutation.mutate({
                                quotaId: quota.id,
                              })
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
                    );
                  })}
                </div>
              </div>
            )}
        </div>

        <QuotaBars event={event} />
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
              {messages.registration.conflictTitle}
            </h3>
            <p className="mt-2 text-sm text-gray-600">
              {signupConflict.existingSignup.isCompleted
                ? messages.registration.foundPreviousCompleted
                : messages.registration.foundPreviousIncomplete}
            </p>
            <div className="mt-4 space-y-2 text-sm">
              <p>
                <span className="font-medium">
                  {messages.registration.previous}
                </span>{" "}
                {signupConflict.existingSignup.quotaTitle} —{" "}
                {signupConflict.existingSignup.placement.type === "QUEUE"
                  ? messages.registration.inQueue
                  : messages.registration.inQuota}{" "}
                {signupConflict.existingSignup.placement.position}
              </p>
              <p>
                <span className="font-medium">{messages.registration.new}</span>{" "}
                {signupConflict.selectedQuotaTitle} —{" "}
                {signupConflict.selectedPlacement.type === "QUEUE"
                  ? messages.registration.inQueue
                  : messages.registration.inQuota}{" "}
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
                {messages.registration.keepPrevious}
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
                {messages.registration.chooseNewQuota}
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
  const locale = useLocale();
  const messages = useTranslations(publicEventsMessages);
  const eventId = Number(router.query.eventId);

  const loginUser = useManagementUser();
  const canEditEvent =
    loginUser.data?.role === ManagementRole.event_editor ||
    loginUser.data?.role === ManagementRole.superadmin;

  const {
    data: event,
    isLoading,
    error,
    refetch,
  } = api.events.getEventByID.useQuery(
    { eventId: eventId!, locale },
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
    return (
      <Layout>
        <PageHead title={messages.detail.unavailableTitle} />
        <div role="alert" className="surface-panel space-y-4 p-6">
          <p>
            {error?.data?.code === "FORBIDDEN" ||
            error?.data?.code === "UNAUTHORIZED"
              ? messages.detail.forbidden
              : error?.data?.code === "NOT_FOUND" || !event
                ? messages.detail.notFound
                : messages.detail.refreshFailed}
          </p>
          <Button onClick={() => void refetch()}>
            {messages.detail.retry}
          </Button>
          <Button.Link href="/">{messages.detail.backToEvents}</Button.Link>
        </div>
      </Layout>
    );
  }

  return (
    <>
      <PageHead title={event?.title || messages.detail.loading} />
      <Layout>
        <div className="w-full min-w-0">
          {error && (
            <div role="alert" className="surface-muted mb-4 p-4 text-sm">
              {messages.detail.staleData}
              <Button onClick={() => void refetch()}>
                {messages.detail.retry}
              </Button>
            </div>
          )}
          <Link
            href="/"
            className="text-brand-secondary hover:text-brand-dark focus-visible:ring-brand-secondary mb-3 flex w-fit min-w-0 items-center gap-2 rounded-full text-sm font-semibold transition-colors focus-visible:ring-2 focus-visible:outline-hidden"
          >
            <span className="shrink-0 text-base" aria-hidden>
              ←
            </span>
            <span className="min-w-0">{messages.detail.backToHome}</span>
          </Link>

          <div
            className={`w-full min-w-0 overflow-hidden ${
              event?.draft
                ? "rounded-card shadow-soft border border-amber-400 bg-amber-100"
                : "surface-panel"
            }`}
          >
            {/* Match the cards: paper follows the title, leaving the photo clear. */}
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
                  className={`label-caps sticker absolute top-4 right-4 z-10 max-w-[70%] truncate px-3 py-1.5 sm:text-[0.8125rem] ${BADGE_TONE_CLASS[event.badgeTone]}`}
                >
                  {event.badgeText}
                </span>
              )}

              {event && (
                <div className="absolute inset-x-0 bottom-0">
                  <div className="event-banner-caption flex flex-wrap items-center gap-3 px-4 pb-3 sm:px-5 lg:px-6">
                    <div className="event-banner-paper" aria-hidden />
                    <h1 className="display-title text-brand-dark text-3xl sm:text-4xl">
                      {event.title}
                    </h1>
                    {event.draft && (
                      <span className="label-caps rounded-control inline-flex items-center border border-amber-400 bg-amber-200 px-2.5 py-1 text-amber-950">
                        <Icon icon="draft" className="mr-1.5 h-3.5 w-3.5" />
                        {messages.detail.draft}
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
                        {messages.detail.editEvent}
                      </Button.Link>
                    </div>
                  )}

                  <div className="flex w-full flex-col gap-8 sm:flex-row sm:items-start sm:gap-8 lg:gap-10">
                    <div className="w-full min-w-0 space-y-1 text-sm sm:flex-1 sm:basis-0 sm:pr-2 sm:text-base">
                      <h2 className="eyebrow text-brand-secondary mb-3">
                        {messages.detail.information}
                      </h2>
                      <p>
                        <span className="text-brand-dark font-semibold">
                          {messages.detail.dateTime}{" "}
                        </span>
                        {formatEventDateTime(event.date, locale)}
                      </p>
                      {event.location && (
                        <p>
                          <span className="text-brand-dark font-semibold">
                            {messages.detail.location}{" "}
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
                      <div className="mt-12">
                        <ParticipantsTable event={event} />
                      </div>
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
