import { useQueryParams } from "@/hooks/useQueryParams";
import { useRouter } from "next/router";
import { api } from "@/utils/api";
import { useForm } from "react-hook-form";
import type { z } from "zod";
import { signupFormSchema } from "../../../features/events/utils/signupFormSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/Input";
import { useUser } from "@/features/auth/hooks/useUser";
import { Button } from "@/components/Button";
import { useState } from "react";

export default function SignupPage() {
  const router = useRouter();
  const user = useUser();
  const { eventId, signupId } = useQueryParams();
  const updateMutation = api.signups.updateSignup.useMutation();
  const deleteMutation = api.signups.deleteSignup.useMutation();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const {
    handleSubmit,
    register,
    setValue,
    getValues,
    formState: {  errors },
  } = useForm<z.TypeOf<typeof signupFormSchema>>({
    resolver: zodResolver(signupFormSchema),
    defaultValues: {
      name: user.data?.name || "",
      email: user.data?.emailVerified ? user.data.email || "" : "",
    },
  });

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
      enabled: !!eventId && !!signupId,
      async onSuccess(data) {
        const formValues = getValues();
        // Set the name and email if they are not already set
        if (!formValues.name && data?.name) setValue("name", data.name);
        if (!formValues.email && data?.email) setValue("email", data.email);

        if (data) {
          data.questions.forEach((question, idx) => {
            setValue(`answers.${idx}.questionId`, question.id);
            const answer = data.answers.find(
              (a) => a.questionId === question.id
            );
            if (answer) {
              setValue(`answers.${idx}.answer`, answer.answer);
            }
          });
        }
      },
    }
  );

  const onSubmit = handleSubmit(async (values) => {
    console.log("values", values);
    try {
      await updateMutation.mutateAsync({
        signupId: signupId!,
        answers: values.answers.map((ans) => ({
          questionId: ans.questionId,
          answer: ans.answer,
        })),
        name: values.name,
        email: values.email,
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
  if (isError || !signup){
    return <div>Error loading signup details or not found.</div>;
  }

  return (
    <div className="rounded-lg bg-white p-5 shadow-lg">
      <h2 className="mb-4 text-xl font-bold">Signup Form</h2>
      <form onSubmit={onSubmit} className="space-y-4">
        <fieldset className="flex flex-1 flex-col gap-2">
          <label htmlFor="name" className="flex items-center ">
            Nimi / Name: <span className="text-red-500"> *</span>
          </label>
          <Input
            {...register("name")}
            error={!!errors?.name}
            helperText={errors?.name?.message}
          />
        </fieldset>
        <fieldset className="flex flex-1 flex-col gap-2">
          <label htmlFor="email" className="flex items-center">
            Email: <span className="text-red-500"> *</span>
          </label>
          <Input
            {...register("email")}
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
              Are you sure you want to delete your signup? This action cannot be undone.
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
