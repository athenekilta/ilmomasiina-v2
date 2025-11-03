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

  if (isLoading)
    return (
      <div>
        <LoadingSpinner />
      </div>
    );

  if (isError || !signup) {
    return <div>Error loading signup details or not found.</div>;
  }

  return (
    <div className="bg-brand-light rounded-lg p-5 shadow-lg">
      <h2 className="mb-4 text-xl font-bold">Muokkaa ilmoa</h2>
      {isExistingSignup && (
        <p className="text-md text-brand-danger mb-4">
          Sinulla on jo <b>vahvistamaton</b> ilmoittautuminen, muokkaat nyt tätä
          ilmoittautumista.
        </p>
      )}
      <p>Kiintiö: {signup.Quota.title}</p>
      <p>
        Sija: {signup.indexOfSignupInQuota + 1} / {signup.Quota.size}
      </p>
      <form onSubmit={onSubmit} className="space-y-4">
        <fieldset className="flex flex-1 flex-col gap-2">
          <label htmlFor="name" className="flex items-center">
            Nimi:
          </label>
          <Input
            {...register("name")}
            disabled={true}
            error={!!errors?.name}
            helperText={errors?.name?.message}
          />
        </fieldset>
        <fieldset className="flex flex-1 flex-col gap-2">
          <label htmlFor="email" className="flex items-center">
            Sähköposti:
          </label>
          <Input
            {...register("email")}
            disabled={true}
            error={!!errors?.email}
            helperText={errors?.email?.message}
          />
        </fieldset>

        {signup.questions.map((question, idx) => (
          <fieldset key={question.id} className="flex flex-1 flex-col gap-2">
            <label
              htmlFor={`questions.${idx}.answer`}
              className="flex items-center"
            >
              {question.question}{" "}
              {question.required && <span className="text-red-500"> *</span>}
            </label>
            <Input
              {...register(`answers.${idx}.answer`)}
              error={!!errors?.answers?.[question.sortId]?.answer}
              helperText={errors?.answers?.[question.sortId]?.answer?.message}
            />
          </fieldset>
        ))}

        <div className="my-4">
          <h2 className="mb-2 text-lg font-semibold">Ehdot</h2>
          <p>
            Ilmoittautumisen sulkeuduttua ilmoittautuminen on sitova. Tämän
            jälkeen ilmoittautunut on velvollinen maksamaan osallistumismaksun
            tai löytämään paikalleen toisen osallistujan. Osallistumalla
            tapahtumaan sitoudut noudattamaan{" "}
            <a
              href="https://athene.fi/periaatteet/"
              target="_blank"
              className="text-brand-darkgreen"
            >
              {" "}
              Athenen yhteisiä periaatteita.
            </a>
          </p>
        </div>

        <div className="flex justify-between pt-4">
          <Button
            type="submit"
            color="primary"
            disabled={updateMutation.isPending}
          >
            {updateMutation.isPending ? "Saving..." : "Save Changes"}
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

      {/* Delete Confirmation Dialog */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-brand-light w-full max-w-md rounded-lg p-6 shadow-xl">
            <h3 className="mb-4 text-lg font-semibold">Confirm Deletion</h3>
            <p className="mb-6 text-gray-600">
              Are you sure you want to delete your signup? This action cannot be
              undone.
            </p>
            <div className="flex justify-end space-x-4">
              <Button
                color="secondary"
                onClick={() => setShowDeleteConfirm(false)}
              >
                Cancel
              </Button>
              <Button
                color="danger"
                onClick={handleDelete}
                disabled={deleteMutation.isPending}
              >
                {deleteMutation.isPending ? "Deleting..." : "Delete"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function SignupPage() {
  return (
    <Layout>
      <div className="m-4">
        <EditSignup />
      </div>
    </Layout>
  );
}
