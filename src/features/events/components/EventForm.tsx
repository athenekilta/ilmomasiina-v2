"use client";

import { eventFormSchema } from "../utils/eventFormSchema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryParams } from "@/hooks/useQueryParams";
import { api } from "@/utils/api";
import { useEffect, useState } from "react";
import { addDays, set } from "date-fns";
import type { Quota, Question } from "@prisma/client";
import { useAlert } from "@/features/alert/hooks/useAlert";
import { FieldSet } from "@/components/FieldSet";
import { Input } from "@/components/Input";
import { Button } from "@/components/Button";
import { Switch } from "@/components/Switch";
import { QuotaRow } from "./QuotaRow";
import cuid from "cuid";
import { DragDropContext, Draggable, Droppable } from "@hello-pangea/dnd";
import type { DragUpdate } from "@hello-pangea/dnd";
import { RichTextEditor } from "./RichTextEditor";
import { QuestionRow } from "./QuestionRow";
import { TextArea } from "@/components/TextArea";
import { nativeDate } from "@/utils/nativeDate";
import { nativeTime } from "@/utils/nativeTime";
import { useRouter } from "next/router";
import { ValidationSummary } from "./ValidationSummary";

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
  const signups = api.signups.getSignupByEventIds.useQuery(
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
  const {
    register,
    watch,
    handleSubmit,
    formState: { isSubmitting, errors },
    getValues,
    setValue,
  } = useForm({
    resolver: zodResolver(eventFormSchema),
    defaultValues: {
      title: "",
      date: nativeDate.stringify(addDays(new Date(), 7)) as unknown as Date,
      time: nativeTime.stringify(
        set(new Date(), { hours: 12, minutes: 0 }),
      ) as unknown as Date,
      registrationStartDate: nativeDate.stringify(
        addDays(new Date(), 1),
      ) as unknown as Date,
      registrationStartTime: nativeTime.stringify(
        set(new Date(), { hours: 12, minutes: 0 }),
      ) as unknown as Date,
      registrationEndDate: nativeDate.stringify(
        addDays(new Date(), 5),
      ) as unknown as Date,
      registrationEndTime: nativeTime.stringify(
        set(new Date(), { hours: 23, minutes: 59 }),
      ) as unknown as Date,
      description: "",
      location: "",
      price: "",
      webpageUrl: "",
      draft: true,
      signupsPublic: true,
      verificationEmail: "",
      quotas: [] as Quota[],
      questions: [] as Question[],
      raffleEnabled: false,
    },
  });

  const [isInitialized, setIsInitialized] = useState(false);
  const editEvent = api.events.getEventEditId.useQuery(
    {
      eventId: editId ?? NaN,
    },
    {
      enabled: !!editId,
      async onSuccess(data) {
        if (isInitialized || !data) return;
        const formValues = getValues();

        if (!formValues.title) setValue("title", data.title);
        if (!formValues.date) setValue("date", data.date);
        if (!formValues.time) setValue("time", getTimeFromDate(data.date));
        if (!formValues.registrationStartDate)
          setValue("registrationStartDate", data.registrationStartDate);
        if (!formValues.registrationEndDate)
          setValue("registrationEndDate", data.registrationEndDate);
        if (!formValues.description && data.description)
          setValue("description", data.description);
        if (!formValues.location && data.location)
          setValue("location", data.location);
        if (!formValues.price && data.price) setValue("price", data.price);
        if (!formValues.webpageUrl && data.webpageUrl)
          setValue("webpageUrl", data.webpageUrl);
        if (!formValues.draft) setValue("draft", data.draft);
        if (!formValues.signupsPublic)
          setValue("signupsPublic", data.signupsPublic);
        if (!formValues.verificationEmail && data.verificationEmail)
          setValue("verificationEmail", data.verificationEmail);
        if (formValues.quotas.length === 0) setValue("quotas", data.Quotas);
        if (formValues.questions.length === 0) setValue("questions", data.Questions);
        if (!formValues.raffleEnabled)
          setValue("raffleEnabled", data.raffleEnabled);
        setIsInitialized(true);
      },
    },
  );

  const getTimeFromDate = (date: Date) => {
    return set(new Date(), {
      hours: date.getHours(),
      minutes: date.getMinutes(),
    });
  };

  const combineDates = (date: Date, time: string) => {
    const combined = new Date(date);
    // time is in format HH:mm
    const [hours, minutes] = time.split(":").map(Number);

    combined.setHours(hours ?? 0);
    combined.setMinutes(minutes ?? 0);
    return combined;
  };

  const createQuota = () => {
    const quotas = getValues("quotas");
    const id = cuid();
    const sortId = quotas.length + 1;
    setValue("quotas", [
      ...quotas,
      {
        id,
        title: "",
        size: null,
        sortId,
        eventId: editEvent.data?.id ?? NaN,
      },
    ]);
  };

  const createQuestion = () => {
    const questions = getValues("questions");
    const id = cuid();
    const sortId = questions.length + 1;
    setValue("questions", [
      ...questions,
      {
        id,
        question: "",
        type: "text",
        required: false,
        sortId,
        options: [],
        public: false,
        eventId: editEvent.data?.id ?? NaN,
      },
    ]);
  };

  const deleteQuestion = (id: string) => {
    const questions = getValues("questions");
    setValue(
      "questions",
      questions.filter((question: Question) => question.id !== id),
    );
  };

  const createPublicQueue = () => {
    const quotas = getValues("quotas");
    const sortId = quotas.length + 1;
    setValue("quotas", [
      ...quotas,
      {
        id: "public-quota",
        title: "Avoin kiintiö",
        size: null,
        sortId,
        eventId: editEvent.data?.id ?? NaN,
      },
    ]);
  };

  console.log(editId)

  useEffect(() => {
    if (watch("quotas").length === 0 && editId === undefined) {
      createQuota();
    }
  }, [watch("quotas"), createQuota, watch, editId]);

  const deleteQuota = (id: string) => {
    const quotas = getValues("quotas");
    setValue(
      "quotas",
      quotas.filter((quota: Quota) => quota.id !== id),
    );
  };

  const onSubmit = handleSubmit(async (data) => {
    console.log("handleSubmit", data);
    console.log(data.time);
    console.log(getValues("time"));
    const formData = {
      ...data,
      date: combineDates(
        new Date(data.date),
        getValues("time") as unknown as string,
      ),
      // registrationStartDate: combineDates(
      //   new Date(data.registrationStartDate),
      //   getValues("registrationStartTime")
      // ),
      // registrationEndDate: combineDates(
      //   new Date(data.registrationEndDate),
      //   getValues("registrationEndTime")
      // ),
    };
    if (editId) {
      await updateMutation.mutateAsync({ ...formData, id: editId });
      alert.success("Event updated successfully");
    } else {
      const event = await createMutation.mutateAsync(data);
      alert.success("Event created successfully");
      router.push(`/events/${event.id}/edit`);
    }
  });

  const onDragEndQuota = (result: DragUpdate) => {
    if (!result.destination) return;

    const quotas = getValues("quotas");

    const [removed] = quotas.splice(result.source.index, 1);
    if (!removed) {
      console.error("Could not find quota to remove");
      return;
    }

    quotas.splice(result.destination.index, 0, removed);
    // Update sortId
    quotas.forEach((quota, index) => {
      quota.sortId = index + 1;
    });

    setValue("quotas", quotas);
  };

  const onDragEndQuestions = (result: DragUpdate) => {
    if (!result.destination) return;
    console.log(result);
  };

  if (editId && !isInitialized && !editEvent.isLoading) {
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
              </>
            )}
          </div>
        </div>
        <FieldSet title="Nimi">
          <Input
            {...register("title")}
            error={!!errors.title}
            helperText={errors.title?.message}
          />
        </FieldSet>
        <FieldSet title="Aika">
          <div className="max-w-3/4 flex flex-row gap-6">
            <Input
              {...register("date")}
              type="date"
              error={!!errors.date}
              helperText={errors.date?.message}
              className="w-1/2"
            />
            <Input
              {...register("time")}
              type="time"
              error={!!errors.time}
              helperText={errors.time?.message}
              className="w-1/2"
            />
          </div>
        </FieldSet>
        <FieldSet title="Registration start time">
          <div className="max-w-3/4 flex flex-row gap-6">
            <Input
              {...register("registrationStartDate")}
              type="date"
              error={!!errors.registrationStartDate}
              helperText={errors.registrationStartDate?.message}
              className="w-1/2"
            />
            <Input
              {...register("registrationStartTime")}
              type="time"
              error={!!errors.registrationStartTime}
              helperText={errors.registrationStartTime?.message}
              className="w-1/2"
            />
          </div>
        </FieldSet>
        <FieldSet title="Registration end time">
          <div className="max-w-3/4 flex flex-row gap-6">
            <Input
              {...register("registrationEndDate")}
              type="date"
              error={!!errors.registrationEndDate}
              helperText={errors.registrationEndDate?.message}
              className="w-1/2"
            />
            <Input
              {...register("registrationEndTime")}
              type="time"
              error={!!errors.registrationEndTime}
              helperText={errors.registrationEndTime?.message}
              className="w-1/2"
            />
          </div>
        </FieldSet>
        <FieldSet title="Ilmoittautumiset julkisia">
          <Switch
            value={watch("signupsPublic")}
            onChange={(value) => setValue("signupsPublic", value)}
          />
        </FieldSet>
        <FieldSet title="Paikka">
          <Input
            {...register("location")}
            error={!!errors.location}
            helperText={errors.location?.message}
          />
        </FieldSet>
        <FieldSet title="Hinta">
          <Input
            {...register("price")}
            error={!!errors.price}
            helperText={errors.price?.message}
          />
        </FieldSet>
        <FieldSet title="Webbisivu">
          <Input
            {...register("webpageUrl")}
            error={!!errors.webpageUrl}
            helperText={errors.webpageUrl?.message}
          />
        </FieldSet>
        <FieldSet title="Kuvaus">
          <RichTextEditor
            value={watch("description")}
            onChange={(value) => setValue("description", value)}
          />
        </FieldSet>
        <FieldSet title="Jonot">
          <div className="mb-5 mt-2 flex flex-row gap-4">
            <Button onClick={() => createQuota()} type="button">
              Lisää jono
            </Button>
            <Button
              type="button"
              onClick={() => createPublicQueue()}
              disabled={
                !!watch("quotas").find((quota) => quota.id === "public-quota")
              }
            >
              Lisää avoin jono
            </Button>
          </div>
          
          {errors.quotas && (
            <div className="mb-4 rounded-md bg-red-50 p-3">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-700">
                    {typeof errors.quotas.message === 'string' ? errors.quotas.message : "Please add at least one valid quota"}
                  </p>
                </div>
              </div>
            </div>
          )}
          
          <DragDropContext onDragEnd={onDragEndQuota}>
            <Droppable droppableId="quotas">
              {(droppableProvided) => (
                <div
                  ref={droppableProvided.innerRef}
                  {...droppableProvided.droppableProps}
                  className="space-y-4"
                >
                  {watch("quotas").map((quota, index) => (
                    <Draggable
                      key={quota.id}
                      draggableId={quota.id}
                      index={index}
                    >
                      {(draggableProvided) => (
                        <div
                          ref={draggableProvided.innerRef}
                          {...draggableProvided.draggableProps}
                          {...draggableProvided.dragHandleProps}
                        >
                          <QuotaRow
                            key={quota.id}
                            quota={quota}
                            quotasLength={watch("quotas").length}
                            onChange={(value) => {
                              const quotas = getValues("quotas");
                              quotas[index] = value;
                              setValue("quotas", quotas);
                            }}
                            deleteQuota={deleteQuota}
                          />
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {droppableProvided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        </FieldSet>

        <FieldSet title="Kysymykset">
          <div className="mb-5 mt-2 flex flex-row gap-4">
            <Button onClick={() => createQuestion()} type="button">
              Lisää Kysymys
            </Button>
          </div>
          <DragDropContext onDragEnd={onDragEndQuestions}>
            <Droppable droppableId="quotas">
              {(droppableProvided) => (
                <div
                  ref={droppableProvided.innerRef}
                  {...droppableProvided.droppableProps}
                  className="space-y-4"
                >
                  {watch("questions").map((question, index) => (
                    <Draggable
                      key={question.id}
                      draggableId={question.id}
                      index={index}
                    >
                      {(draggableProvided) => (
                        <div
                          ref={draggableProvided.innerRef}
                          {...draggableProvided.draggableProps}
                          {...draggableProvided.dragHandleProps}
                        >
                          <QuestionRow
                            key={question.id}
                            question={question}
                            onChange={(value) => {
                              const questions = getValues("questions");
                              questions[index] = value;
                              setValue("questions", questions);
                            }}
                            deleteQuestion={deleteQuestion}
                          />
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {droppableProvided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        </FieldSet>

        <FieldSet title="Vahvistusviesti sähköpostiin">
          <TextArea {...register("verificationEmail")} rows={5} />
        </FieldSet>

        <FieldSet title="Raffle Mode">
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <Switch
                value={watch("raffleEnabled")}
                onChange={(value) => setValue("raffleEnabled", value)}
              />
              <span className="text-sm text-gray-600">
                Enable 30-second raffle registration window
              </span>
            </div>
            {watch("raffleEnabled") && (
              <div className="rounded-lg bg-blue-50 p-4">
                <p className="text-sm text-blue-800">
                  When enabled, registration will open a 30-second window where
                  everyone can register interest. After the window closes,
                  positions will be randomly assigned to all registrants. This
                  helps prevent server load from everyone clicking at the same
                  time.
                </p>
              </div>
            )}
          </div>
        </FieldSet>

        <FieldSet title="Ilmoittautuneet">
          {signups.data ? (
            <div>
              <p>{signups.data[0]?.name}</p>
            </div>
          ) : (
            <p> Ei Ilmoittautuneita</p>
          )}
        </FieldSet>
      </div>
    </form>
  );
}
