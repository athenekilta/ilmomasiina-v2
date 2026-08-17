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
import { useMemo, useState } from "react";
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

  const alerts = useAlert();

  const isExistingSignup = existing === "true";

  const {
    data: signup,
    isLoading,
    isError,
  } = api.signups.getSignupByID.useQuery(
    {
      signupId: signupId!,
      eventId: eventId!,
    },
    {
      enabled: !!eventId && !!signupId && deleteMutation.isIdle,
    },
  );

  const sortedQuestions = useMemo(() => {
    const qs = signup?.questions;
    if (!qs?.length) return [];
    return [...qs].sort((a, b) => a.sortId - b.sortId);
  }, [signup]);

  const {
    handleSubmit,
    register,
    control,
    setError,
    clearErrors,
    formState: { errors },
  } = useForm<z.infer<typeof signupFormSchema>>({
    resolver: zodResolver(signupFormSchema),
    values: signup
      ? {
          name: signup.name,
          email: signup.email,
          answers: sortedQuestions.map((q) => {
            const existing = signup.answers.find((a) => a.questionId === q.id);
            let answer = existing?.answer ?? "";
            if (q.type === "checkbox") {
              answer = encodeCheckboxAnswer(
                decodeCheckboxAnswer(answer).filter((selection) =>
                  q.options.includes(selection),
                ),
                q.options,
              );
            } else if (q.type === "radio" && !q.options.includes(answer)) {
              answer = "";
            }
            return {
              questionId: q.id,
              answer,
            };
          }),
        }
      : undefined,
  });

  const onSubmit = handleSubmit(async (values) => {
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

    try {
      await updateMutation.mutateAsync({
        signupId: signupId!,
        answers: canonicalAnswers,
      });
      alerts.success("Ilmoittautuminen onnistui");
      router.push(`/events/${eventId}`);
    } catch (error) {
      if (error instanceof Error) {
        alerts.error(error.toString());
      }
      console.error(error);
    }
  });

  const handleDelete = async () => {
    try {
      await deleteMutation.mutateAsync({
        signupId: signupId!,
      });
      alerts.success("Ilmoittautuminen onnistui");
      router.push(`/events/${eventId}`);
    } catch (error) {
      console.error(error);
    }
  };

  if (isLoading) {
    return (
      <>
        <PageHead title="Ilmoittautuminen" />
        <div className="mx-auto w-full max-w-2xl min-w-0 px-1 sm:px-0">
          <div className="surface-panel flex justify-center py-20 sm:py-24">
            <LoadingSpinner />
          </div>
        </div>
      </>
    );
  }

  if (isError || !signup) {
    return (
      <>
        <PageHead title="Ilmoittautuminen" />
        <div className="mx-auto w-full max-w-2xl min-w-0 px-1 sm:px-0">
          <div className="surface-panel p-8 text-center sm:p-10">
            <p className="text-brand-dark text-base font-medium">
              Ilmoittautumista ei löytynyt tai sen lataus epäonnistui.
            </p>
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
              Viimeistele ilmoittautuminen
            </h1>
            <p className="text-brand-primary mt-2 text-sm font-semibold sm:text-base">
              {signup.event.title}
            </p>
          </header>

          {isExistingSignup && (
            <div
              className="rounded-inner mb-6 border border-amber-300/80 bg-amber-50 px-4 py-3 text-sm leading-relaxed text-amber-950"
              role="status"
            >
              Löysimme jo sinun vahvistamattoman ilmoittautumisen tähän
              tapahtumaan. Täydennä tai muokkaa tietoja alla ja vahvista
              lopuksi.
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

          <form onSubmit={onSubmit} className="space-y-0">
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
                                    ? decodeCheckboxAnswer(field.value).filter(
                                        (selection) =>
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
                                        optionIdx === 0 ? field.ref : undefined
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
                Ilmoittautumisen sulkeuduttua ilmoittautuminen on sitova. Tämän
                jälkeen ilmoittautunut on velvollinen maksamaan
                osallistumismaksun tai löytämään paikalleen toisen osallistujan.
                Osallistumalla tapahtumaan sitoudut noudattamaan{" "}
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
                loading={updateMutation.isPending}
              >
                Vahvista ilmoittautuminen
              </Button>
              <p className="text-center text-xs text-stone-500 sm:text-left">
                <button
                  type="button"
                  className="text-danger font-medium underline-offset-2 transition-colors hover:text-rose-800 hover:underline disabled:cursor-not-allowed disabled:opacity-40"
                  onClick={() => setShowDeleteConfirm(true)}
                  disabled={
                    deleteMutation.isPending || updateMutation.isPending
                  }
                >
                  {deleteMutation.isPending
                    ? "Poistetaan…"
                    : "Poista ilmoittautuminen"}
                </button>
              </p>
            </div>
          </form>

          {showDeleteConfirm && (
            <ConfirmationDialog
              title="Poista ilmoittautuminen?"
              message="Haluatko varmasti poistaa ilmoittautumisesi? Tätä ei voi perua."
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
  return (
    <Layout>
      <EditSignup />
    </Layout>
  );
}
