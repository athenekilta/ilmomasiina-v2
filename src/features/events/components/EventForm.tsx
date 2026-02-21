"use client";

import { eventFormSchema } from "../utils/eventFormSchema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryParams } from "@/hooks/useQueryParams";
import { api } from "@/utils/api";
import { addDays, set } from "date-fns";
import { useAlert } from "@/features/alert/hooks/useAlert";
import { FieldSet } from "@/components/FieldSet";
import { Button } from "@/components/Button";
import { TextArea } from "@/components/TextArea";
import { nativeDate } from "@/utils/nativeDate";
import { nativeTime } from "@/utils/nativeTime";
import { useRouter } from "next/router";
import { ValidationSummary } from "./ValidationSummary";
import { SignupsTable } from "./SignupsTable";
import { BasicInfoFields } from "./BasicInfoFields";
import { Questions } from "./Questions";
import { Quotas } from "./Quotas";

export type EventFormProps = {
  /**
   * If editing, provide the ID of the event that is being edited.
   */
  editId?: number;
};

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
  } = useForm({
    resolver: zodResolver(eventFormSchema),
    values: {
      ...(editEvent ? editEvent : {}),
      date: editEvent?.date
        ? (nativeDate.stringify(editEvent.date) as unknown as Date)
        : (nativeDate.stringify(addDays(new Date(), 7)) as unknown as Date),
      time: editEvent?.date
        ? nativeTime.stringify(
            set(new Date(editEvent.date), { seconds: 0, milliseconds: 0 }),
          )
        : nativeTime.stringify(set(new Date(), { hours: 12, minutes: 0 })),
      registrationStartDate: editEvent?.registrationStartDate
        ? (nativeDate.stringify(
            editEvent.registrationStartDate,
          ) as unknown as Date)
        : (nativeDate.stringify(addDays(new Date(), 1)) as unknown as Date),
      registrationEndDate: editEvent?.registrationEndDate
        ? (nativeDate.stringify(
            editEvent.registrationEndDate,
          ) as unknown as Date)
        : (nativeDate.stringify(addDays(new Date(), 5)) as unknown as Date),
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
            signups?.filter((s) => s.quotaId === quota.id).length || 0,
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

  const combineDates = (date: Date, time: string) => {
    const combined = new Date(date);
    // time is in format HH:mm
    const [hours, minutes] = time.split(":").map(Number);

    combined.setHours(hours ?? 0);
    combined.setMinutes(minutes ?? 0);
    return combined;
  };

  const onSubmit = handleSubmit(async (data) => {
    console.log("handleSubmit", data);
    console.log(getValues("time"));
    if (!data.date) return;
    const formData = {
      ...data,
      date: combineDates(new Date(data.date), getValues("time")),
      registrationStartDate: combineDates(
        new Date(data.registrationStartDate),
        getValues("registrationStartTime"),
      ),
      registrationEndDate: combineDates(
        new Date(data.registrationEndDate),
        getValues("registrationEndTime"),
      ),
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

  if (editId && (signUpsLoading || isLoading)) {
    return (
      <div className="pointer-events-none absolute inset-0 z-50 flex flex-col items-center bg-white/70 p-6">
        Loading...
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="relative">
      {Object.keys(errors).length > 0 && <ValidationSummary errors={errors} />}
      <div className="flex flex-col gap-6 px-11">
        <div className="flex flex-row justify-between">
          <h1 className="text-4xl font-semibold text-black">
            {editId ? "Muokkaa tapahtumaa" : "Luo uusi tapahtuma"}
          </h1>

          <div className="flex gap-4">
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
                  onClick={() => setValue("draft", !watch("draft"))}
                  loading={isSubmitting}
                  variant="bordered"
                >
                  {watch("draft") ? "Julkaise" : "Muuta luonnokseksi"}
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
