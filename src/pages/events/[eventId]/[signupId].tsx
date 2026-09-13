import { useQueryParams } from "@/hooks/useQueryParams";
import { useRouter } from "next/router";
import { api } from "@/utils/api";
import { Controller, useForm } from "react-hook-form";
import type { z } from "zod";
import { signupFormSchema } from "../../../features/events/utils/signupFormSchema";
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
import Link from "next/link";
import {
  decodeCheckboxAnswer,
  encodeCheckboxAnswer,
  validateAndCanonicalizeQuestionAnswer,
} from "@/features/events/utils/questionAnswers";

function EditSignup() {
  const router = useRouter();
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
    window.history.replaceState(null, "", window.location.pathname + window.location.search);
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
    },
    {
      enabled:
        accessReady && !!eventId && !!signupId && deleteMutation.isIdle,
    },
  );

  const { data: signup, isLoading, error } = signupQuery;
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
  } = useForm<z.infer<typeof signupFormSchema>>({
    resolver: zodResolver(signupFormSchema),
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
        alerts.error(
          "Uusimpien tietojen lataus epäonnistui. Omat vastauksesi säilytettiin.",
        );
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
      deleteMutation.isPending
    )
      return;
    clearErrors("answers");
    const canonicalAnswers: { questionId: string; answer: string }[] = [];
    let hasAnswerError = false;
    sortedQuestions.forEach((question, index) => {
      const result = validateAndCanonicalizeQuestionAnswer(
        question,
        values.answers[index]?.answer ?? "",
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
      });
      try {
        await utils.signups.getSignupByID.cancel({
          eventId: eventId!,
          signupId: signupId!,
        });
        const saved = await utils.signups.getSignupByID.fetch(
          { eventId: eventId!, signupId: signupId! },
          { staleTime: 0 },
        );
        draft.adopt(signupDraftSnapshot(saved));
        setNeedsReload(false);
      } catch {
        setNeedsReload(true);
        alerts.warning(
          "Ilmo tallennettiin, mutta uusimpia tietoja ei voitu ladata.",
        );
      }
      alerts.success("Ilmo onnistui");
      await router.push(`/events/${eventId}`);
    } catch (error) {
      if (error instanceof Error) {
        alerts.error(error.toString());
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
      deleteMutation.isPending
    )
      return;
    operationPending.current = true;
    try {
      await deleteMutation.mutateAsync({
        signupId: signupId!,
      });
      alerts.success("Ilmo onnistui");
      await router.push(`/events/${eventId}`);
    } catch (error) {
      alerts.error(
        "Ilmon poisto epäonnistui. Päivitä tiedot ja yritä uudelleen.",
      );
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
        <PageHead title="Ilmo" />
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
        <PageHead title="Ilmo" />
        <div className="mx-auto w-full max-w-2xl min-w-0 px-1 sm:px-0">
          <div className="surface-panel p-8 text-center sm:p-10">
            <p className="text-brand-dark text-base font-medium">
              {accessError
                ? "Ilmoittautumislinkki ei ole voimassa."
                : error?.data?.code === "FORBIDDEN" ||
                    error?.data?.code === "UNAUTHORIZED"
                  ? "Sinulla ei ole oikeutta nähdä tätä ilmoa."
                  : "Ilmoa ei löytynyt, se on poistettu tai sen lataus epäonnistui. Tallentamattomia vastauksia ei lähetetty."}
            </p>
            {!deleteMutation.isSuccess && (
              <Button
                type="button"
                onClick={() => void signupQuery.refetch()}
                className="mt-4"
              >
                Yritä uudelleen
              </Button>
            )}
            {eventId != null && (
              <Button.Link
                href={`/events/${eventId}`}
                className="mt-6 inline-flex"
                color="primary"
              >
                Takaisin tapahtumaan
              </Button.Link>
            )}
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <PageHead title={`${signup.event.title} — Ilmo`} />
      <div className="mx-auto w-full max-w-2xl min-w-0 px-1 sm:px-0">
        <div className="surface-panel p-5 sm:p-7">
          <Link
            href={`/events/${eventId}`}
            className="text-brand-secondary hover:text-brand-dark -mx-0.5 mb-6 flex min-w-0 items-center gap-2 border-b border-stone-200 pb-4 text-sm font-semibold transition-colors"
          >
            <span className="shrink-0 text-base" aria-hidden>
              ←
            </span>
            <span className="min-w-0">Takaisin tapahtumaan</span>
          </Link>

          <header className="mb-6">
            <h1 className="text-brand-dark text-xl font-extrabold tracking-tight uppercase sm:text-2xl">
              {signup.completedAt === null ? "Viimeistele ilmo" : "Muokkaa ilmoa"}
            </h1>
            <p className="text-brand-primary mt-2 text-sm font-semibold sm:text-base">
              {signup.event.title}
            </p>
          </header>

          {isExistingSignup && signup.completedAt === null && (
            <div
              className="rounded-inner mb-6 border border-amber-300/80 bg-amber-50 px-4 py-3 text-sm leading-relaxed text-amber-950"
              role="status"
            >
              Löysimme jo sinun vahvistamattoman ilmosi tähän tapahtumaan.
              Täydennä tai muokkaa tietoja alla ja vahvista lopuksi.
              <br />
              Väärä kiintiö? Poista ilmo ja tee uusi.
            </div>
          )}

          <div className="mb-8 grid gap-3 sm:grid-cols-2">
            <div className="surface-muted p-4">
              <p className="text-brand-secondary text-[0.65rem] font-bold tracking-widest uppercase">
                Kiintiö
              </p>
              <p className="text-brand-dark mt-1.5 text-base font-semibold">
                {signup.Quota.title}
              </p>
            </div>
            <div className="surface-muted p-4">
              <p className="text-brand-secondary text-[0.65rem] font-bold tracking-widest uppercase">
                {signup.placement.type === "QUEUE" ? "Jonossa" : "Kiintiössä"}
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
              <p>
                Tietojen päivitys epäonnistui. Omat vastauksesi säilytettiin.
              </p>
              <Button type="button" onClick={() => void signupQuery.refetch()}>
                Yritä uudelleen
              </Button>
            </div>
          )}
          <form onSubmit={onSubmit} className="space-y-0">
            <fieldset
              disabled={isSubmitting || deleteMutation.isPending || isReloading}
              inert={isSubmitting || deleteMutation.isPending || isReloading}
              className="min-w-0 border-0 p-0"
            >
              <input type="hidden" {...register("name")} />
              <input type="hidden" {...register("email")} />

              <section className="surface-muted mb-8 p-4 sm:p-5">
                <h2 className="text-brand-secondary mb-4 text-[0.65rem] font-bold tracking-widest uppercase">
                  Osallistuja
                </h2>
                <dl className="space-y-3 text-sm">
                  <div>
                    <dt className="text-brand-secondary font-medium">Nimi</dt>
                    <dd className="text-brand-dark mt-0.5 font-semibold">
                      {signup.name}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-brand-secondary font-medium">
                      Sähköposti
                    </dt>
                    <dd className="text-brand-dark mt-0.5 font-semibold break-all">
                      {signup.email}
                    </dd>
                  </div>
                </dl>
                <p className="text-brand-secondary mt-4 text-xs leading-relaxed">
                  Nimeä ja sähköpostia ei voi muuttaa tässä vaiheessa.
                </p>
              </section>

              {sortedQuestions.length > 0 && (
                <section className="mb-8">
                  <h2 className="text-brand-secondary mb-5 text-[0.65rem] font-bold tracking-widest uppercase">
                    Kysymykset
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
                              pakollinen
                            </span>
                          ) : null}
                          {question.public ? (
                            <span className="text-brand-secondary text-xs font-semibold">
                              julkinen
                            </span>
                          ) : null}
                        </legend>
                        {question.public ? (
                          <p className="text-brand-secondary mb-2 text-xs leading-relaxed">
                            Tämä vastaus näkyy tapahtuman julkisessa
                            osallistujalistassa.
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
                                  const optionId = `answer-${question.id}-${optionIdx}`;
                                  const selections =
                                    question.type === "checkbox"
                                      ? decodeCheckboxAnswer(
                                          field.value,
                                        ).filter((selection) =>
                                          question.options.includes(selection),
                                        )
                                      : [];
                                  return (
                                    <label
                                      key={option}
                                      htmlFor={optionId}
                                      className="text-brand-dark flex cursor-pointer items-start gap-2 text-sm"
                                    >
                                      <input
                                        id={optionId}
                                        ref={
                                          optionIdx === 0
                                            ? field.ref
                                            : undefined
                                        }
                                        name={field.name}
                                        type={question.type}
                                        value={option}
                                        checked={
                                          question.type === "radio"
                                            ? field.value === option
                                            : selections.includes(option)
                                        }
                                        onBlur={field.onBlur}
                                        onChange={() => {
                                          if (question.type === "radio") {
                                            field.onChange(option);
                                            return;
                                          }
                                          const nextSelections =
                                            selections.includes(option)
                                              ? selections.filter(
                                                  (selection) =>
                                                    selection !== option,
                                                )
                                              : [...selections, option];
                                          field.onChange(
                                            encodeCheckboxAnswer(
                                              nextSelections,
                                              question.options,
                                            ),
                                          );
                                        }}
                                        className="accent-brand-secondary mt-0.5 size-4"
                                      />
                                      <span>{option}</span>
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
                  Ehdot
                </h2>
                <p className="text-sm leading-relaxed text-gray-700">
                  Ilmoittautumisen sulkeuduttua ilmoittautuminen on sitova.
                  Tämän jälkeen ilmoittautunut on velvollinen maksamaan
                  osallistumismaksun tai löytämään paikalleen toisen
                  osallistujan. Osallistumalla tapahtumaan sitoudut noudattamaan{" "}
                  <a
                    href="https://athene.fi/periaatteet/"
                    target="_blank"
                    rel="noreferrer"
                    className="text-brand-darkgreen font-medium underline-offset-2 hover:underline"
                  >
                    Athenen yhteisiä periaatteita
                  </a>
                  .
                </p>
              </div>

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
                  Vahvista ilmo
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
                    {deleteMutation.isPending ? "Poistetaan…" : "Poista ilmo"}
                  </button>
                </p>
              </div>
            </fieldset>
          </form>

          {showDeleteConfirm && (
            <ConfirmationDialog
              title="Poista ilmoittautuminen?"
              message="Haluatko varmasti poistaa ilmosi? Tätä ei voi perua."
              confirmLabel="Poista ilmo"
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
