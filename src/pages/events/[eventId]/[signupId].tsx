import { useQueryParams } from "@/hooks/useQueryParams";
import { useRouter } from "next/router";
import { api } from "@/utils/api";
import { Controller, useForm } from "react-hook-form";
import type { z } from "zod";
import { createSignupFormSchema } from "../../../features/events/utils/signupFormSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/Input";
import { TextArea } from "@/components/TextArea";
import { Button } from "@/components/Button";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useServerDraft } from "@/features/events/hooks/useServerDraft";
import { signupDraftSnapshot } from "@/features/events/utils/signupDraft";
import { DraftChangeNotice } from "@/features/events/components/DraftChangeNotice";
import { isUnavailableError } from "@/features/events/utils/draftSync";
import { useAlert } from "@/features/alert/hooks/useAlert";
import { Layout } from "@/features/layout/Layout";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { ConfirmationDialog } from "@/components/ConfirmationDialog";
import { PageHead } from "@/features/layout/PageHead";
import { RegistrationDate } from "@/features/events/utils/utils";
import { useNow } from "@/hooks/useNow";
import Link from "next/link";
import {
  decodeCheckboxAnswer,
  encodeCheckboxAnswer,
  validateAndCanonicalizeQuestionAnswer,
} from "@/features/events/utils/questionAnswers";
import { useLocale, useTranslations } from "@/i18n/I18nProvider";
import { publicEventsMessages } from "@/i18n/messages/events";

function EditSignup() {
  const router = useRouter();
  const now = useNow();
  const locale = useLocale();
  const messages = useTranslations(publicEventsMessages);
  const formSchema = useMemo(
    () => createSignupFormSchema(messages.validation.signup),
    [messages.validation.signup],
  );
  const { eventId, signupId } = useQueryParams();
  const { existing } = router.query;
  const updateMutation = api.signups.updateSignup.useMutation();
  const deleteMutation = api.signups.deleteSignup.useMutation();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [needsReload, setNeedsReload] = useState(false);
  const [isReloading, setIsReloading] = useState(false);
  const [accessReady, setAccessReady] = useState(false);
  const [accessError, setAccessError] = useState(false);
  const accessRedemptionStarted = useRef(false);
  const operationPending = useRef(false);
  const utils = api.useUtils();

  const alerts = useAlert();

  const isExistingSignup = existing === "true";

  useEffect(() => {
    if (!router.isReady || accessRedemptionStarted.current) return;
    accessRedemptionStarted.current = true;

    const token = new URLSearchParams(window.location.hash.slice(1)).get(
      "token",
    );
    window.history.replaceState(
      null,
      "",
      window.location.pathname + window.location.search,
    );
    if (!token) {
      setAccessReady(true);
      return;
    }

    void fetch("/api/token/redeem", {
      method: "POST",
      credentials: "same-origin",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token }),
    })
      .then((response) => {
        if (!response.ok) throw new Error("Invalid link");
        setAccessReady(true);
      })
      .catch(() => setAccessError(true));
  }, [router.isReady]);

  const signupQuery = api.signups.getSignupByID.useQuery(
    {
      signupId: signupId!,
      eventId: eventId!,
      locale,
    },
    {
      enabled: accessReady && !!eventId && !!signupId && deleteMutation.isIdle,
    },
  );

  const { data: signup, isLoading, error } = signupQuery;
  const isSignupEditingClosed =
    !!signup &&
    RegistrationDate(signup.event, now ?? undefined).isRegistrationClosed;
  const incoming = useMemo(
    () => (signup && !error ? signupDraftSnapshot(signup) : undefined),
    [signup, error],
  );

  const {
    handleSubmit,
    register,
    control,
    setError,
    clearErrors,
    reset,
    formState: { errors, isDirty, isSubmitting },
  } = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { name: "", email: "", answers: [] },
  });

  const onAdopt = useCallback(
    (snapshot: NonNullable<typeof incoming>) => reset(snapshot.values),
    [reset],
  );
  const draft = useServerDraft({
    incoming,
    dirty: isDirty || needsReload,
    busy: isSubmitting || deleteMutation.isPending || isReloading,
    onAdopt,
  });
  const sortedQuestions = draft.baseline?.questions ?? [];
  const reloadDraft = async () => {
    if (operationPending.current || isSubmitting) return;
    operationPending.current = true;
    setIsReloading(true);
    try {
      const result = await signupQuery.refetch();
      if (result.error || !result.data) {
        alerts.error(messages.signup.reloadFailed);
        return;
      }
      draft.adopt(signupDraftSnapshot(result.data));
      setNeedsReload(false);
    } finally {
      operationPending.current = false;
      setIsReloading(false);
    }
  };

  const onSubmit = handleSubmit(async (values) => {
    if (
      operationPending.current ||
      draft.changedElsewhere ||
      needsReload ||
      error ||
      deleteMutation.isPending ||
      isSignupEditingClosed
    )
      return;
    clearErrors("answers");
    const canonicalAnswers: { questionId: string; answer: string }[] = [];
    let hasAnswerError = false;
    sortedQuestions.forEach((question, index) => {
      const result = validateAndCanonicalizeQuestionAnswer(
        question,
        values.answers[index]?.answer ?? "",
        messages.validation.answers,
      );
      if (!result.success) {
        setError(`answers.${index}.answer`, {
          type: "manual",
          message: result.message,
        });
        hasAnswerError = true;
        return;
      }
      canonicalAnswers.push({
        questionId: question.id,
        answer: result.answer,
      });
    });
    if (hasAnswerError) return;

    operationPending.current = true;
    try {
      await updateMutation.mutateAsync({
        signupId: signupId!,
        answers: canonicalAnswers,
        locale,
      });
      try {
        await utils.signups.getSignupByID.cancel({
          eventId: eventId!,
          signupId: signupId!,
          locale,
        });
        const saved = await utils.signups.getSignupByID.fetch(
          { eventId: eventId!, signupId: signupId!, locale },
          { staleTime: 0 },
        );
        draft.adopt(signupDraftSnapshot(saved));
        setNeedsReload(false);
      } catch {
        setNeedsReload(true);
        alerts.warning(messages.signup.savedButReloadFailed);
      }
      alerts.success(messages.signup.saved);
      await router.push(`/events/${eventId}`);
    } catch (error) {
      if (error instanceof Error) {
        alerts.error(messages.signup.saveFailed);
      }
      console.error(error);
    } finally {
      operationPending.current = false;
    }
  });

  const handleDelete = async () => {
    if (
      operationPending.current ||
      error ||
      isSubmitting ||
      deleteMutation.isPending ||
      isSignupEditingClosed
    )
      return;
    operationPending.current = true;
    try {
      await deleteMutation.mutateAsync({
        signupId: signupId!,
      });
      alerts.success(messages.signup.deleted);
      await router.push(`/events/${eventId}`);
    } catch (error) {
      alerts.error(messages.signup.deleteFailed);
      deleteMutation.reset();
      void signupQuery.refetch();
      console.error(error);
    } finally {
      operationPending.current = false;
    }
  };

  if (
    (!accessReady && !accessError) ||
    isLoading ||
    (!draft.baseline && signup && !error)
  ) {
    return (
      <>
        <PageHead title={messages.signup.pageTitle} />
        <div className="mx-auto w-full max-w-2xl min-w-0 px-1 sm:px-0">
          <div className="surface-panel flex justify-center py-20 sm:py-24">
            <LoadingSpinner />
          </div>
        </div>
      </>
    );
  }

  if (
    accessError ||
    isUnavailableError(error) ||
    !signup ||
    deleteMutation.isSuccess
  ) {
    return (
      <>
        <PageHead title={messages.signup.pageTitle} />
        <div className="mx-auto w-full max-w-2xl min-w-0 px-1 sm:px-0">
          <div className="surface-panel p-8 text-center sm:p-10">
            <p className="text-brand-dark text-base font-medium">
              {accessError
                ? messages.signup.invalidLink
                : error?.data?.code === "FORBIDDEN" ||
                    error?.data?.code === "UNAUTHORIZED"
                  ? messages.signup.forbidden
                  : messages.signup.unavailable}
            </p>
            {!deleteMutation.isSuccess && (
              <Button
                type="button"
                onClick={() => void signupQuery.refetch()}
                className="mt-4"
              >
                {messages.signup.retry}
              </Button>
            )}
            {eventId != null && (
              <Button.Link
                href={`/events/${eventId}`}
                className="mt-6 inline-flex"
                color="primary"
              >
                {messages.signup.backToEvent}
              </Button.Link>
            )}
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <PageHead
        title={`${signup.event.title} — ${messages.signup.pageTitle}`}
      />
      <div className="mx-auto w-full max-w-2xl min-w-0 px-1 sm:px-0">
        <div className="surface-panel p-5 sm:p-7">
          <Link
            href={`/events/${eventId}`}
            className="text-brand-secondary hover:text-brand-dark -mx-0.5 mb-6 flex min-w-0 items-center gap-2 border-b border-stone-200 pb-4 text-sm font-semibold transition-colors"
          >
            <span className="shrink-0 text-base" aria-hidden>
              ←
            </span>
            <span className="min-w-0">{messages.signup.backToEvent}</span>
          </Link>

          <header className="mb-6">
            <h1 className="display-title text-brand-dark text-2xl sm:text-3xl">
              {isSignupEditingClosed
                ? messages.signup.detailsTitle
                : signup.completedAt === null
                  ? messages.signup.finishTitle
                  : messages.signup.editTitle}
            </h1>
            <p className="event-title text-brand-secondary mt-2 text-base sm:text-lg">
              {signup.event.title}
            </p>
          </header>

          {isSignupEditingClosed && (
            <div
              className="rounded-inner mb-6 border border-amber-300/80 bg-amber-50 px-4 py-3 text-sm leading-relaxed text-amber-950"
              role="status"
            >
              {messages.signup.editingClosed}
            </div>
          )}

          {isExistingSignup &&
            signup.completedAt === null &&
            !isSignupEditingClosed && (
              <div
                className="rounded-inner mb-6 border border-amber-300/80 bg-amber-50 px-4 py-3 text-sm leading-relaxed text-amber-950"
                role="status"
              >
                {messages.signup.existingIncomplete}
                <br />
                {messages.signup.wrongQuota}
              </div>
            )}

          <div className="mb-8 grid gap-3 sm:grid-cols-2">
            <div className="surface-muted p-4">
              <p className="label-caps text-brand-secondary">
                {messages.signup.quota}
              </p>
              <p className="text-brand-dark mt-1.5 text-base font-semibold">
                {signup.Quota.title}
              </p>
            </div>
            <div className="surface-muted p-4">
              <p className="label-caps text-brand-secondary">
                {signup.placement.type === "QUEUE"
                  ? messages.signup.inQueue
                  : messages.signup.inQuota}
              </p>
              <p className="text-brand-dark mt-1.5 text-base font-semibold tabular-nums">
                {signup.placement.position}
              </p>
            </div>
          </div>

          {(draft.changedElsewhere || needsReload) && (
            <DraftChangeNotice
              onReload={() => void reloadDraft()}
              disabled={
                isSubmitting ||
                deleteMutation.isPending ||
                isReloading ||
                signupQuery.isFetching
              }
            />
          )}
          {error && (
            <div role="alert" className="surface-muted mb-4 p-4 text-sm">
              <p>{messages.signup.updateFailed}</p>
              <Button type="button" onClick={() => void signupQuery.refetch()}>
                {messages.signup.retry}
              </Button>
            </div>
          )}
          <form onSubmit={onSubmit} className="space-y-0">
            <fieldset
              disabled={
                isSubmitting ||
                deleteMutation.isPending ||
                isReloading ||
                isSignupEditingClosed
              }
              inert={
                isSubmitting ||
                deleteMutation.isPending ||
                isReloading ||
                isSignupEditingClosed
              }
              className="min-w-0 border-0 p-0"
            >
              <input type="hidden" {...register("name")} />
              <input type="hidden" {...register("email")} />

              <section className="surface-muted mb-8 p-4 sm:p-5">
                <h2 className="label-caps text-brand-secondary mb-4">
                  {messages.signup.participant}
                </h2>
                <dl className="space-y-3 text-sm">
                  <div>
                    <dt className="text-brand-secondary font-medium">
                      {messages.signup.name}
                    </dt>
                    <dd className="text-brand-dark mt-0.5 font-semibold">
                      {signup.name}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-brand-secondary font-medium">
                      {messages.signup.email}
                    </dt>
                    <dd className="text-brand-dark mt-0.5 font-semibold break-all">
                      {signup.email}
                    </dd>
                  </div>
                </dl>
                <p className="text-brand-secondary mt-4 text-xs leading-relaxed">
                  {messages.signup.identityLocked}
                </p>
              </section>

              {sortedQuestions.length > 0 && (
                <section className="mb-8">
                  <h2 className="label-caps text-brand-secondary mb-5">
                    {messages.signup.questions}
                  </h2>
                  <div className="space-y-6">
                    {sortedQuestions.map((question, idx) => (
                      <fieldset
                        key={question.id}
                        className="min-w-0 border-0 p-0"
                      >
                        <legend className="text-brand-dark mb-2 flex flex-wrap items-baseline gap-x-1 text-sm font-semibold">
                          <span>{question.question}</span>
                          {question.required ? (
                            <span className="text-danger text-xs font-bold">
                              {messages.signup.required}
                            </span>
                          ) : null}
                          {question.public ? (
                            <span className="text-brand-secondary text-xs font-semibold">
                              {messages.signup.public}
                            </span>
                          ) : null}
                        </legend>
                        {question.public ? (
                          <p className="text-brand-secondary mb-2 text-xs leading-relaxed">
                            {messages.signup.publicAnswer}
                          </p>
                        ) : null}
                        <input
                          type="hidden"
                          {...register(`answers.${idx}.questionId`)}
                        />
                        {question.type === "text" ? (
                          <Input
                            {...register(`answers.${idx}.answer`)}
                            fullWidth
                            id={`answers.${idx}.answer`}
                            error={!!errors?.answers?.[idx]?.answer}
                            helperText={errors?.answers?.[idx]?.answer?.message}
                          />
                        ) : question.type === "textarea" ? (
                          <TextArea
                            {...register(`answers.${idx}.answer`)}
                            rows={4}
                            fullWidth
                            id={`answers.${idx}.answer`}
                            error={!!errors?.answers?.[idx]?.answer}
                            helperText={errors?.answers?.[idx]?.answer?.message}
                          />
                        ) : (
                          <Controller
                            control={control}
                            name={`answers.${idx}.answer`}
                            render={({ field }) => (
                              <div
                                className="space-y-2"
                                aria-describedby={
                                  errors?.answers?.[idx]?.answer
                                    ? `answers.${idx}.error`
                                    : undefined
                                }
                                aria-invalid={!!errors?.answers?.[idx]?.answer}
                              >
                                {question.options.map((option, optionIdx) => {
                                  const inputId = `answer-${question.id}-${option.id}`;
                                  const optionIds = question.options.map(
                                    (item) => item.id,
                                  );
                                  const selections =
                                    question.type === "checkbox"
                                      ? decodeCheckboxAnswer(
                                          field.value,
                                        ).filter((selection) =>
                                          optionIds.includes(selection),
                                        )
                                      : [];
                                  return (
                                    <label
                                      key={option.id}
                                      htmlFor={inputId}
                                      className="text-brand-dark flex cursor-pointer items-start gap-2 text-sm"
                                    >
                                      <input
                                        id={inputId}
                                        ref={
                                          optionIdx === 0
                                            ? field.ref
                                            : undefined
                                        }
                                        name={field.name}
                                        type={question.type}
                                        value={option.id}
                                        checked={
                                          question.type === "radio"
                                            ? field.value === option.id
                                            : selections.includes(option.id)
                                        }
                                        onBlur={field.onBlur}
                                        onChange={() => {
                                          if (question.type === "radio") {
                                            field.onChange(option.id);
                                            return;
                                          }
                                          const nextSelections =
                                            selections.includes(option.id)
                                              ? selections.filter(
                                                  (selection) =>
                                                    selection !== option.id,
                                                )
                                              : [...selections, option.id];
                                          field.onChange(
                                            encodeCheckboxAnswer(
                                              nextSelections,
                                              question.options,
                                            ),
                                          );
                                        }}
                                        className="accent-brand-secondary mt-0.5 size-4"
                                      />
                                      <span>{option.label}</span>
                                    </label>
                                  );
                                })}
                                {errors?.answers?.[idx]?.answer?.message ? (
                                  <p
                                    id={`answers.${idx}.error`}
                                    className="text-danger text-sm"
                                  >
                                    {errors.answers[idx].answer.message}
                                  </p>
                                ) : null}
                              </div>
                            )}
                          />
                        )}
                      </fieldset>
                    ))}
                  </div>
                </section>
              )}

              <div className="surface-muted mb-8 p-4 sm:p-5">
                <h2 className="text-brand-dark mb-3 text-sm font-semibold">
                  {messages.signup.termsTitle}
                </h2>
                <p className="text-sm leading-relaxed text-gray-700">
                  {messages.signup.termsBeforeLink}{" "}
                  <a
                    href="https://athene.fi/periaatteet/"
                    target="_blank"
                    rel="noreferrer"
                    className="text-brand-darkgreen font-medium underline-offset-2 hover:underline"
                  >
                    {messages.signup.principles}
                  </a>
                  .
                </p>
              </div>

              {!isSignupEditingClosed && (
                <div className="space-y-4 border-t border-stone-200 pt-6">
                  <Button
                    type="submit"
                    color="primary"
                    className="w-full py-2.5 text-[0.95rem]"
                    loading={isSubmitting}
                    disabled={
                      draft.changedElsewhere ||
                      needsReload ||
                      !!error ||
                      deleteMutation.isPending
                    }
                  >
                    {messages.signup.confirm}
                  </Button>
                  <p className="text-center text-xs text-stone-500 sm:text-left">
                    <button
                      type="button"
                      className="text-danger font-medium underline-offset-2 transition-colors hover:text-rose-800 hover:underline disabled:cursor-not-allowed disabled:opacity-40"
                      onClick={() => setShowDeleteConfirm(true)}
                      disabled={
                        deleteMutation.isPending || isSubmitting || !!error
                      }
                    >
                      {deleteMutation.isPending
                        ? messages.signup.deleting
                        : messages.signup.delete}
                    </button>
                  </p>
                </div>
              )}
            </fieldset>
          </form>

          {showDeleteConfirm && (
            <ConfirmationDialog
              title={messages.signup.deleteTitle}
              message={messages.signup.deleteMessage}
              confirmLabel={messages.signup.delete}
              onConfirmAction={handleDelete}
              onCancelAction={() => setShowDeleteConfirm(false)}
              pending={deleteMutation.isPending}
            />
          )}
        </div>
      </div>
    </>
  );
}

export default function SignupPage() {
  const { eventId, signupId, isReady } = useQueryParams();
  return (
    <Layout>{isReady && <EditSignup key={`${eventId}:${signupId}`} />}</Layout>
  );
}
