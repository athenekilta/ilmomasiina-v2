"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { addDays, set } from "date-fns";
import { useForm, useWatch } from "react-hook-form";
import type { z } from "zod";
import { Button } from "@/components/Button";
import { FieldSet } from "@/components/FieldSet";
import { TextArea } from "@/components/TextArea";
import { useAlert } from "@/features/alert/hooks/useAlert";
import { useQueryParams } from "@/hooks/useQueryParams";
import { api } from "@/utils/api";
import { nativeDate } from "@/utils/nativeDate";
import { nativeTime } from "@/utils/nativeTime";
import { useRouter } from "next/router";
import { BasicInfoFields } from "./BasicInfoFields";
import { Questions } from "./Questions";
import { Quotas } from "./Quotas";
import { SignupsTable } from "./SignupsTable";
import { ValidationSummary } from "./ValidationSummary";
import { eventFormSchema } from "../utils/eventFormSchema";

export type EventFormProps = {
  /**
   * If editing, provide the ID of the event that is being edited.
   */
  editId?: number;
};

type EventFormValues = z.input<typeof eventFormSchema>;

export function EventForm({ editId }: EventFormProps) {
  const createMutation = api.events.createEvent.useMutation();
  const updateMutation = api.events.updateEvent.useMutation();
  const router = useRouter();
  const { data: signups, isLoading: signUpsLoading } =
    api.signups.getSignupByEventIds.useQuery(
      {
        eventId: editId!,
      },
      {
        enabled: !!editId,
      },
    );

  const alert = useAlert();

  const { error: queryError } = useQueryParams();
  if (queryError) {
    alert.error("Error: " + queryError);
  }

  const { data: editEvent, isLoading } = api.events.getEventEditId.useQuery(
    {
      eventId: editId ?? NaN,
    },
    {
      enabled: !!editId,
    },
  );

  const {
    register,
    watch,
    handleSubmit,
    formState: { isSubmitting, errors },
    getValues,
    setValue,
    control,
  } = useForm<EventFormValues>({
    resolver: zodResolver(eventFormSchema),
    values: {
      ...(editEvent ? editEvent : {}),
      date: editEvent?.date
        ? nativeDate.form.stringify(editEvent.date)
        : nativeDate.form.stringify(addDays(new Date(), 7)),
      time: editEvent?.date
        ? nativeTime.stringify(
            set(new Date(editEvent.date), { seconds: 0, milliseconds: 0 }),
          )
        : nativeTime.stringify(set(new Date(), { hours: 12, minutes: 0 })),
      registrationStartDate: editEvent?.registrationStartDate
        ? nativeDate.form.stringify(editEvent.registrationStartDate)
        : nativeDate.form.stringify(addDays(new Date(), 1)),
      registrationEndDate: editEvent?.registrationEndDate
        ? nativeDate.form.stringify(editEvent.registrationEndDate)
        : nativeDate.form.stringify(addDays(new Date(), 5)),
      registrationEndTime: editEvent?.registrationEndDate
        ? nativeTime.stringify(
            set(new Date(editEvent.registrationEndDate), {
              seconds: 0,
              milliseconds: 0,
            }),
          )
        : nativeTime.stringify(set(new Date(), { hours: 23, minutes: 59 })),
      registrationStartTime: editEvent?.registrationStartDate
        ? nativeTime.stringify(
            set(new Date(editEvent.registrationStartDate), {
              seconds: 0,
              milliseconds: 0,
            }),
          )
        : nativeTime.stringify(set(new Date(), { hours: 12, minutes: 0 })),
      Quotas:
        editEvent?.Quotas.map((quota) => ({
          ...quota,
          signupCount:
            signups?.filter((signup) => signup.quotaId === quota.id).length || 0,
        })) || [],
      Questions: editEvent?.Questions || [],
      raffleEnabled: editEvent?.raffleEnabled || false,
      price: editEvent?.price || "",
      location: editEvent?.location || "",
      title: editEvent?.title || "",
      webpageUrl: editEvent?.webpageUrl || "",
      description: editEvent?.description || "",
      draft: editEvent?.draft ?? true,
      signupsPublic: editEvent?.signupsPublic ?? true,
      verificationEmail: editEvent?.verificationEmail || "",
    },
  });

  const combineDateAndTime = (dateValue: string, time: string) => {
    const date = nativeDate.form.parse(dateValue);
    if (!date) return undefined;

    const [hours, minutes] = time.split(":").map(Number);
    return set(date, {
      hours: hours ?? 0,
      minutes: minutes ?? 0,
      seconds: 0,
      milliseconds: 0,
    });
  };

  const onSubmit = handleSubmit(async (data) => {
    const date = combineDateAndTime(data.date, data.time);
    const registrationStartDate = combineDateAndTime(
      data.registrationStartDate,
      data.registrationStartTime,
    );
    const registrationEndDate = combineDateAndTime(
      data.registrationEndDate,
      data.registrationEndTime,
    );

    if (!date || !registrationStartDate || !registrationEndDate) return;

    const formData = {
      ...data,
      date,
      registrationStartDate,
      registrationEndDate,
    };

    if (editId) {
      await updateMutation.mutateAsync({
        ...formData,
        id: editId,
        quotas: data.Quotas,
        questions: data.Questions,
      });
      alert.success("Event updated successfully");
    } else {
      const event = await createMutation.mutateAsync({
        ...formData,
        quotas: data.Quotas,
        questions: data.Questions,
      });
      alert.success("Event created successfully");
      router.push(`/events/${event.id}/edit`);
    }
  });

  const isDraft = useWatch({ control, name: "draft" });

  if (editId && (signUpsLoading || isLoading)) {
    return (
      <div className="pointer-events-none absolute inset-0 z-50 flex flex-col items-center justify-center bg-brand-beige p-4 text-sm font-medium text-brand-dark">
        Loading...
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="relative">
      {Object.keys(errors).length > 0 && <ValidationSummary errors={errors} />}
      <div className="flex flex-col gap-4 px-0 sm:px-1">
        <div className="flex flex-row flex-wrap items-start justify-between gap-3">
          <h1 className="text-2xl font-semibold text-brand-dark sm:text-3xl">
            {editId ? "Muokkaa tapahtumaa" : "Luo uusi tapahtuma"}
          </h1>

          <div className="flex flex-wrap gap-2">
            {!editId ? (
              <Button type="submit" loading={isSubmitting}>
                Tallenna luonnoksena
              </Button>
            ) : (
              <>
                <Button type="submit" loading={isSubmitting} color="primary">
                  Tallenna muutokset
                </Button>
                <Button
                  type="submit"
                  onClick={() => setValue("draft", !isDraft)}
                  loading={isSubmitting}
                  variant="bordered"
                >
                  {isDraft ? "Julkaise" : "Muuta luonnokseksi"}
                </Button>
                <Button.Link
                  type="button"
                  variant="text"
                  href={`/events/${editId}`}
                >
                  Siirry ilmosivulle
                </Button.Link>
              </>
            )}
          </div>
        </div>
        <BasicInfoFields
          control={control}
          register={register}
          watch={watch}
          setValue={setValue}
          errors={errors}
        />
        <Quotas
          getValues={getValues}
          setValue={setValue}
          watch={watch}
          errors={errors}
          eventId={editEvent?.id}
          editId={editId}
        />

        <Questions
          getValues={getValues}
          setValue={setValue}
          watch={watch}
          errors={errors}
          eventId={editEvent?.id}
          signupCount={signups ? signups.length : 0}
        />

        <FieldSet title="Vahvistusviesti sähköpostiin">
          <TextArea {...register("verificationEmail")} rows={5} />
        </FieldSet>
        <div title="Ilmoittautuneet">
          {signups && editId ? (
            <SignupsTable
              signups={signups}
              eventId={editId}
              eventName={editEvent?.title}
            />
          ) : (
            <p> Ei Ilmoittautuneita</p>
          )}
        </div>
      </div>
    </form>
  );
}
