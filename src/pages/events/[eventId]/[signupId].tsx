import { useQueryParams } from "@/hooks/useQueryParams";
import { useRouter } from "next/router";
import { api } from "@/utils/api";
import { useForm } from "react-hook-form";
import type { z } from "zod";
import { signupFormSchema } from "../../../features/events/utils/signupFormSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/Input";
import { Button } from "@/components/Button";
import { useState } from "react";
import { useAlert } from "@/features/alert/hooks/useAlert";
import { Layout } from "@/features/layout/Layout";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { ConfirmationDialog } from "@/components/ConfirmationDialog";

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

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<z.TypeOf<typeof signupFormSchema>>({
    resolver: zodResolver(signupFormSchema),
    // transform answers such that possible missing answers are filled
    values: signup
      ? {
          ...signup,
          answers: signup.questions.map((q) => {
            const existing = signup.answers.find(
              (a) => a.questionId === q.id,
            );
            return {
              questionId: q.id,
              answer: existing ? existing.answer : "",
            };
          }),
        }
      : undefined,
  });

  const onSubmit = handleSubmit(async (values) => {
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
      <div className="mx-auto w-full max-w-2xl">
        <div className="surface-panel flex justify-center py-16">
          <LoadingSpinner />
        </div>
      </div>
    );
  }

  if (isError || !signup) {
    return (
      <div className="mx-auto w-full max-w-2xl">
        <div className="surface-panel p-6 text-center sm:p-8">
          <p className="text-brand-dark font-medium">
            Error loading signup details or not found.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-2xl">
      <div className="surface-panel p-4 sm:p-5">
        <h1 className="text-brand-dark mb-4 text-lg font-bold tracking-tight sm:text-xl">
          Muokkaa ilmoa
        </h1>
        {isExistingSignup && (
          <p className="text-md text-brand-danger mb-4">
            Sinulla on jo <b>vahvistamaton</b> ilmoittautuminen, muokkaat nyt
            tätä ilmoittautumista.
          </p>
        )}
        <p className="text-sm text-gray-700">
          <span className="font-medium text-brand-dark">Kiintiö:</span>{" "}
          {signup.Quota.title}
        </p>
        <p className="text-sm text-gray-700">
          <span className="font-medium text-brand-dark">Sija:</span>{" "}
          {signup.indexOfSignupInQuota + 1}
          {signup.Quota.size != null ? ` / ${signup.Quota.size}` : ""}
        </p>

        <form onSubmit={onSubmit} className="mt-5 space-y-4">
          <fieldset className="flex min-w-0 flex-1 flex-col gap-2">
            <label htmlFor="name" className="flex items-center text-sm font-medium text-brand-dark">
              Nimi:
            </label>
            <Input
              {...register("name")}
              disabled={true}
              fullWidth
              error={!!errors?.name}
              helperText={errors?.name?.message}
            />
          </fieldset>
          <fieldset className="flex min-w-0 flex-1 flex-col gap-2">
            <label
              htmlFor="email"
              className="flex items-center text-sm font-medium text-brand-dark"
            >
              Sähköposti:
            </label>
            <Input
              {...register("email")}
              disabled={true}
              fullWidth
              error={!!errors?.email}
              helperText={errors?.email?.message}
            />
          </fieldset>

          {signup.questions.map((question, idx) => (
            <fieldset
              key={question.id}
              className="flex min-w-0 flex-1 flex-col gap-2"
            >
              <label
                htmlFor={`questions.${idx}.answer`}
                className="flex items-center text-sm font-medium text-brand-dark"
              >
                {question.question}{" "}
                {question.required && (
                  <span className="text-red-500"> *</span>
                )}
              </label>
              <Input
                {...register(`answers.${idx}.answer`)}
                fullWidth
                error={!!errors?.answers?.[question.sortId]?.answer}
                helperText={
                  errors?.answers?.[question.sortId]?.answer?.message
                }
              />
            </fieldset>
          ))}

          <div className="surface-muted my-4 rounded-control border border-stone-200 p-3">
            <h2 className="text-brand-dark mb-2 text-sm font-semibold">
              Ehdot
            </h2>
            <p className="text-sm leading-relaxed text-gray-700">
              Ilmoittautumisen sulkeuduttua ilmoittautuminen on sitova. Tämän
              jälkeen ilmoittautunut on velvollinen maksamaan osallistumismaksun
              tai löytämään paikalleen toisen osallistujan. Osallistumalla
              tapahtumaan sitoudut noudattamaan{" "}
              <a
                href="https://athene.fi/periaatteet/"
                target="_blank"
                rel="noreferrer"
                className="text-brand-darkgreen font-medium underline-offset-2 hover:underline"
              >
                {" "}
                Athenen yhteisiä periaatteita.
              </a>
            </p>
          </div>

          <div className="border-stone-200 flex flex-col gap-3 border-t pt-4 sm:flex-row sm:items-center sm:justify-between">
            <Button
              type="submit"
              color="primary"
              disabled={updateMutation.isPending}
            >
              {updateMutation.isPending ? "Saving..." : "Ilmottaudu"}
            </Button>

            <Button
              type="button"
              color="danger"
              onClick={() => setShowDeleteConfirm(true)}
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending ? "Deleting..." : "Delete Signup"}
            </Button>
          </div>
        </form>

        {showDeleteConfirm && (
          <ConfirmationDialog
            message="Are you sure you want to delete your signup? This action cannot be undone."
            onConfirmAction={handleDelete}
            onCancelAction={() => setShowDeleteConfirm(false)}
            pending={deleteMutation.isPending}
          />
        )}
      </div>
    </div>
  );
}

export default function SignupPage() {
  return (
    <Layout>
      <EditSignup />
    </Layout>
  );
}
