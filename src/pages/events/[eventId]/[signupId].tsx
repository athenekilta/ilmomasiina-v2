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

export default function SignupPage() {
  const router = useRouter();
  const { eventId, signupId } = useQueryParams();
  const { existing } = router.query;
  const updateMutation = api.signups.updateSignup.useMutation();
  const deleteMutation = api.signups.deleteSignup.useMutation();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

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
    } catch (error) {
      console.error(error);
    }
    router.push(`/events/${eventId}`);
  });

  const handleDelete = async () => {
    try {
      await deleteMutation.mutateAsync({
        signupId: signupId!,
      });
      router.push(`/events/${eventId}`);
    } catch (error) {
      console.error(error);
    }
  };

  if (isLoading) return <div>Loading...</div>;
  if (isError || !signup) {
    return <div>Error loading signup details or not found.</div>;
  }

  return (
    <div className="rounded-lg bg-white p-5 shadow-lg">
      <h2 className="mb-4 text-xl font-bold">Signup Form</h2>
      {isExistingSignup && (
        <p className="text-md mb-4 text-orange-600">
          You already have an existing unconfirmed signup. A new signup was not
          created. Edit and confirm the existing signup below.
        </p>
      )}
      <p>Quota: {signup.Quota.title}</p>
      <p>
        Place: {signup.indexOfSignupInQuota} / {signup.Quota.size}
      </p>
      <form onSubmit={onSubmit} className="space-y-4">
        <fieldset className="flex flex-1 flex-col gap-2">
          <label htmlFor="name" className="flex items-center">
            Nimi / Name:
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
            Email:
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

        <div className="flex justify-between pt-4">
          <Button
            type="submit"
            color="primary"
            disabled={updateMutation.isLoading}
          >
            {updateMutation.isLoading ? "Saving..." : "Save Changes"}
          </Button>

          <Button
            type="button"
            color="danger"
            onClick={() => setShowDeleteConfirm(true)}
            disabled={deleteMutation.isLoading}
          >
            {deleteMutation.isLoading ? "Deleting..." : "Delete Signup"}
          </Button>
        </div>
      </form>

      {/* Delete Confirmation Dialog */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
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
                disabled={deleteMutation.isLoading}
              >
                {deleteMutation.isLoading ? "Deleting..." : "Delete"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
