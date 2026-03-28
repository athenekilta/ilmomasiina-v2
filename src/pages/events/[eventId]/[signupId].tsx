import { useQueryParams } from "@/hooks/useQueryParams";
import { useRouter } from "next/router";
import { api } from "@/utils/api";
import { useForm } from "react-hook-form";
import type { z } from "zod";
import { signupFormSchema } from "../../../features/events/utils/signupFormSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/Input";
import { Button } from "@/components/Button";
import { useMemo, useState } from "react";
import { useAlert } from "@/features/alert/hooks/useAlert";
import { Layout } from "@/features/layout/Layout";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { ConfirmationDialog } from "@/components/ConfirmationDialog";
import { PageHead } from "@/features/layout/PageHead";
import Link from "next/link";

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
            return {
              questionId: q.id,
              answer: existing ? existing.answer : "",
            };
          }),
        }
      : undefined,
  });

  const onSubmit = handleSubmit(async (values) => {
    clearErrors("answers");
    let hasRequiredError = false;
    sortedQuestions.forEach((q, i) => {
      if (q.required && !(values.answers[i]?.answer?.trim() ?? "")) {
        setError(`answers.${i}.answer`, {
          type: "manual",
          message: "Vastaus on pakollinen",
        });
        hasRequiredError = true;
      }
    });
    if (hasRequiredError) return;

    try {
      await updateMutation.mutateAsync({
        signupId: signupId!,
        answers: values.answers.map((ans) => ({
          questionId: ans.questionId,
          answer: ans.answer,
        })),
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
              className="rounded-control mb-6 border border-amber-300/80 bg-amber-50 px-4 py-3 text-sm leading-relaxed text-amber-950"
              role="status"
            >
              Sinulla on jo <strong>vahvistamaton</strong> ilmoittautuminen
              tähän tapahtumaan. Täydennä tai muokkaa tietoja alla ja vahvista
              lopuksi.
            </div>
          )}

          <div className="mb-8 grid gap-3 sm:grid-cols-2">
            <div className="surface-muted rounded-control border border-stone-200/90 p-4">
              <p className="text-brand-secondary text-[0.65rem] font-bold tracking-widest uppercase">
                Kiintiö
              </p>
              <p className="text-brand-dark mt-1.5 text-base font-semibold">
                {signup.Quota.title}
              </p>
            </div>
            <div className="surface-muted rounded-control border border-stone-200/90 p-4">
              <p className="text-brand-secondary text-[0.65rem] font-bold tracking-widest uppercase">
                Sija
              </p>
              <p className="text-brand-dark mt-1.5 text-base font-semibold tabular-nums">
                {signup.indexOfSignupInQuota + 1}
                {signup.Quota.size != null ? ` / ${signup.Quota.size}` : ""}
              </p>
            </div>
          </div>

          <form onSubmit={onSubmit} className="space-y-0">
            <input type="hidden" {...register("name")} />
            <input type="hidden" {...register("email")} />

            <section className="rounded-control mb-8 border border-stone-200 bg-white/50 p-4 sm:p-5">
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
                      <label
                        htmlFor={`answers.${idx}.answer`}
                        className="text-brand-dark mb-2 flex flex-wrap items-baseline gap-x-1 text-sm font-semibold"
                      >
                        <span>{question.question}</span>
                        {question.required ? (
                          <span className="text-xs font-bold text-red-600">
                            pakollinen
                          </span>
                        ) : null}
                        {question.public ? (
                          <span className="text-brand-secondary text-xs font-semibold">
                            julkinen
                          </span>
                        ) : null}
                      </label>
                      {question.public ? (
                        <p className="text-brand-secondary mb-2 text-xs leading-relaxed">
                          Tämä vastaus näkyy tapahtuman julkisessa
                          osallistujalistassa.
                        </p>
                      ) : null}
                      <Input
                        {...register(`answers.${idx}.answer`)}
                        fullWidth
                        id={`answers.${idx}.answer`}
                        error={!!errors?.answers?.[idx]?.answer}
                        helperText={errors?.answers?.[idx]?.answer?.message}
                      />
                    </fieldset>
                  ))}
                </div>
              </section>
            )}

            <div className="surface-muted rounded-control mb-8 border border-stone-200 p-4 sm:p-5">
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

            <div className="border-stone-200 space-y-4 border-t pt-6">
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
                  disabled={deleteMutation.isPending || updateMutation.isPending}
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
