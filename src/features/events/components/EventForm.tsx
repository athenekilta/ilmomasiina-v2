"use client";

import { useCallback, useMemo, useRef, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { set } from "date-fns";
import { useForm, useWatch, type UseFormSetValue } from "react-hook-form";
import { Button } from "@/components/Button";
import { FieldSet } from "@/components/FieldSet";
import { TextArea } from "@/components/TextArea";
import { useAlert } from "@/features/alert/hooks/useAlert";
import { useQueryParams } from "@/hooks/useQueryParams";
import { api } from "@/utils/api";
import { nativeDate } from "@/utils/nativeDate";
import {
  eventDraftSnapshot,
  eventDraftValues,
  type EventFormValues,
} from "../utils/eventDraft";
import { useServerDraft } from "../hooks/useServerDraft";
import { DraftChangeNotice } from "./DraftChangeNotice";
import { getDraftUpdate, isUnavailableError } from "../utils/draftSync";
import { useRouter } from "next/router";
import { Divider } from "@/components/Divider";
import { BasicInfoFields } from "./BasicInfoFields";
import { EventImageBanner } from "./EventImageFields";
import { useEventImageSelection } from "../hooks/useEventImageSelection";
import { Questions } from "./Questions";
import { Quotas } from "./Quotas";
import { SignupsTable } from "./SignupsTable";
import { ValidationSummary } from "./ValidationSummary";
import {
  eventFormSchema,
  normalizeQuestionOptions,
} from "../utils/eventFormSchema";

export type EventFormProps = {
  /**
   * If editing, provide the ID of the event that is being edited.
   */
  editId?: number;
};

export function EventForm({ editId }: EventFormProps) {
  const creationRequestId = useRef<string | null>(null);
  const submitting = useRef(false);
  const utils = api.useUtils();
  const createMutation = api.events.createEvent.useMutation();
  const updateMutation = api.events.updateEvent.useMutation();
  const router = useRouter();
  const signupsQuery = api.signups.getSignupByEventIds.useQuery(
    {
      eventId: editId!,
    },
    {
      enabled: !!editId,
    },
  );

  const { data: signups, error: signupsError } = signupsQuery;
  const retryQueries = () =>
    Promise.all([eventQuery.refetch(), signupsQuery.refetch()]);
  const alert = useAlert();

  const { error: queryError } = useQueryParams();
  if (queryError) {
    alert.error("Error: " + queryError);
  }

  const eventQuery = api.events.getEventEditId.useQuery(
    {
      eventId: editId ?? NaN,
    },
    {
      enabled: !!editId,
      refetchOnWindowFocus: false,
    },
  );
  const { data: editEvent, isLoading, error: eventError } = eventQuery;
  const [imageBaseline, setImageBaseline] = useState<string | null>(null);
  const [needsReload, setNeedsReload] = useState(false);
  const [isReloading, setIsReloading] = useState(false);

  const {
    register,
    watch,
    handleSubmit,
    formState: { isSubmitting, isDirty, errors },
    getValues,
    setValue: setFormValue,
    reset,
    control,
  } = useForm<EventFormValues>({
    resolver: zodResolver(eventFormSchema),
    defaultValues: eventDraftValues(),
  });

  const busy = isSubmitting || isReloading;
  const imageSelection = useEventImageSelection(imageBaseline, busy);

  // Custom controls and drag/drop use setValue rather than registered inputs.
  const setValue: UseFormSetValue<EventFormValues> = useCallback(
    (name, value, options) => {
      if (submitting.current) return;
      setFormValue(name, value, { shouldDirty: true, ...options });
    },
    [setFormValue],
  );
  const incoming = useMemo(
    () =>
      editEvent && !eventError ? eventDraftSnapshot(editEvent) : undefined,
    [editEvent, eventError],
  );
  const onAdopt = useCallback(
    (snapshot: NonNullable<typeof incoming>) => {
      reset(snapshot.values);
      setImageBaseline(snapshot.imageId);
    },
    [reset],
  );
  const draft = useServerDraft({
    incoming,
    dirty: isDirty || imageSelection.isDirty || needsReload,
    busy,
    onAdopt,
  });
  const reloadDraft = async () => {
    if (submitting.current || busy) return;
    submitting.current = true;
    setIsReloading(true);
    try {
      const [result, signupResult] = await retryQueries();
      if (result.error || !result.data || signupResult.error) {
        alert.error(
          "Uusimpien tietojen lataus epäonnistui. Omat muutoksesi säilytettiin.",
        );
        return;
      }
      draft.adopt(eventDraftSnapshot(result.data));
      imageSelection.markSaved();
      setNeedsReload(false);
    } finally {
      submitting.current = false;
      setIsReloading(false);
    }
  };
  const staleData = !!eventError || !!signupsError || (!!editId && !signups);
  const saveBlocked =
    draft.changedElsewhere || needsReload || staleData || isReloading;

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
    if (saveBlocked) return;
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

    const questions = data.Questions.map(normalizeQuestionOptions);
    const formData = {
      ...data,
      date,
      registrationStartDate,
      registrationEndDate,
    };

    if (submitting.current || imageSelection.isDecoding) return;
    submitting.current = true;
    try {
      const imageChange = await imageSelection.uploadForSave();
      if (editId) {
        // Uploading can take long enough for a remote edit to arrive. Never
        // submit the old draft over an edit already observed by this client.
        const latest = utils.events.getEventEditId.getData({ eventId: editId });
        if (
          !latest ||
          getDraftUpdate(
            draft.baseline,
            eventDraftSnapshot(latest),
            true,
            false,
          ) === "conflict"
        ) {
          setNeedsReload(true);
          alert.warning(
            "Tietoja muutettiin kuvan latauksen aikana. Lataa uusimmat tiedot ennen tallentamista.",
          );
          return;
        }
        const event = await updateMutation.mutateAsync({
          ...formData,
          ...imageChange,
          id: editId,
          quotas: data.Quotas,
          questions,
        });
        // The mutation response need not contain canonical questions/quotas.
        // Keep the draft and image baseline until a full saved snapshot arrives.
        try {
          await utils.events.getEventEditId.cancel({ eventId: editId });
          const saved = await utils.events.getEventEditId.fetch(
            { eventId: editId },
            { staleTime: 0 },
          );
          draft.adopt(eventDraftSnapshot(saved));
          imageSelection.markSaved();
          setNeedsReload(false);
        } catch {
          setNeedsReload(true);
          alert.warning(
            "Tapahtuma tallennettiin, mutta uusimpia tietoja ei voitu ladata. Lataa tiedot ennen uutta tallennusta.",
          );
        }
        alert.success("Event updated successfully");
        if (event.notificationWarning)
          alert.warning(
            "Tapahtuma tallennettiin, mutta jonopaikan sähköposti-ilmoitusten lähetys epäonnistui.",
          );
      } else {
        creationRequestId.current ??= crypto.randomUUID();
        const event = await createMutation.mutateAsync({
          ...formData,
          ...imageChange,
          creationRequestId: creationRequestId.current,
          quotas: data.Quotas,
          questions,
        });
        alert.success("Event created successfully");
        await router.push(`/events/${event.id}/edit`);
      }
      // Cache refresh failure must not turn a committed save into a save error.
      void Promise.all([
        utils.events.getEventEditId.invalidate(),
        utils.events.getEvents.invalidate(),
        utils.events.getEventsAdmin.invalidate(),
        utils.events.getEventByID.invalidate(),
      ]).catch(() => undefined);
    } catch (error) {
      if ((error as { data?: { code?: string } })?.data?.code === "CONFLICT") {
        setNeedsReload(true);
        void retryQueries();
      }
      if (
        error &&
        typeof error === "object" &&
        "data" in error &&
        (error.data as { code?: string } | undefined)?.code === "BAD_REQUEST"
      ) {
        imageSelection.forgetUpload();
      }
      alert.error(
        error instanceof Error
          ? error.message
          : "Tapahtuman tallennus epäonnistui.",
      );
    } finally {
      submitting.current = false;
    }
  });

  const isDraft = useWatch({ control, name: "draft" });
  const badgeText = useWatch({ control, name: "badgeText" });
  const badgeTone = useWatch({ control, name: "badgeTone" }) ?? "GREEN";
  const seatHoldingSignupCounts = (signups ?? []).reduce<
    Record<string, number>
  >((counts, signup) => {
    if (signup.status === "CONFIRMED" || signup.status === "IN_PROGRESS") {
      counts[signup.quotaId] = (counts[signup.quotaId] ?? 0) + 1;
    }
    return counts;
  }, {});

  const signupCounts = (signups ?? []).reduce<Record<string, number>>(
    (counts, signup) => {
      counts[signup.quotaId] = (counts[signup.quotaId] ?? 0) + 1;
      return counts;
    },
    {},
  );

  if (
    editId &&
    (isUnavailableError(eventError) ||
      isUnavailableError(signupsError) ||
      (!isLoading && !editEvent))
  ) {
    return (
      <div role="alert" className="space-y-3 p-6">
        <p>
          Tapahtumaa ei löytynyt, sen lataus epäonnistui tai sinulla ei ole
          muokkausoikeutta. Tallentamattomia muutoksia ei lähetetty.
        </p>
        <Button
          type="button"
          disabled={eventQuery.isFetching || signupsQuery.isFetching}
          onClick={() => void retryQueries()}
        >
          Yritä uudelleen
        </Button>
        <Button.Link href="/">Takaisin tapahtumiin</Button.Link>
      </div>
    );
  }

  if (editId && (isLoading || !draft.baseline)) {
    return (
      <div className="bg-brand-beige text-brand-dark pointer-events-none absolute inset-0 z-50 flex flex-col items-center justify-center p-4 text-sm font-medium">
        Loading...
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="relative">
      {(draft.changedElsewhere || needsReload) && (
        <DraftChangeNotice
          onReload={() => void reloadDraft()}
          disabled={busy || eventQuery.isFetching || signupsQuery.isFetching}
        />
      )}
      {(eventError || signupsError) && (
        <div role="alert" className="text-danger p-4">
          <p>
            Tietojen päivitys epäonnistui. Omat muutoksesi säilytettiin.
            Tallennus on estetty, kunnes tiedot saadaan päivitettyä.
          </p>
          <Button
            type="button"
            disabled={busy || eventQuery.isFetching || signupsQuery.isFetching}
            onClick={() => void retryQueries()}
          >
            Yritä uudelleen
          </Button>
        </div>
      )}
      <fieldset disabled={busy} inert={busy} className="min-w-0 border-0 p-0">
        {Object.keys(errors).length > 0 && (
          <ValidationSummary errors={errors} />
        )}
        <EventImageBanner
          selection={imageSelection}
          disabled={busy}
          eventId={editId}
          badgeText={badgeText}
          badgeTone={badgeTone}
        />
        <div className="flex flex-col gap-6 p-4 sm:px-7 sm:py-6">
          <div className="flex flex-row flex-wrap items-start justify-between gap-3">
            <h1 className="text-brand-dark text-2xl font-semibold sm:text-3xl">
              {editId ? "Muokkaa tapahtumaa" : "Luo uusi tapahtuma"}
            </h1>

            <div className="flex flex-wrap gap-2">
              {!editId ? (
                <Button
                  type="submit"
                  disabled={imageSelection.isDecoding || saveBlocked}
                  loading={isSubmitting}
                >
                  Tallenna luonnoksena
                </Button>
              ) : (
                <>
                  <Button
                    type="submit"
                    disabled={imageSelection.isDecoding || saveBlocked}
                    loading={isSubmitting}
                    color="primary"
                  >
                    Tallenna muutokset
                  </Button>
                  <Button
                    type="submit"
                    onClick={() => setValue("draft", !isDraft)}
                    disabled={imageSelection.isDecoding || saveBlocked}
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

          <Divider spacingY="none" />

          <Quotas
            getValues={getValues}
            setValue={setValue}
            watch={watch}
            errors={errors}
            eventId={editEvent?.id}
            editId={editId}
            seatHoldingSignupCounts={seatHoldingSignupCounts}
            signupCounts={signupCounts}
          />

          <Divider spacingY="none" />

          <Questions
            getValues={getValues}
            setValue={setValue}
            watch={watch}
            errors={errors}
            eventId={editEvent?.id}
            signupCount={signups ? signups.length : 0}
          />

          <Divider spacingY="none" />

          <FieldSet title="Vahvistusviesti sähköpostiin">
            <TextArea {...register("verificationEmail")} rows={5} fullWidth />
          </FieldSet>

          {editId && (
            <>
              <Divider spacingY="none" />
              <FieldSet title="Ilmoittautuneet">
                {signups ? (
                  <SignupsTable
                    signups={signups}
                    disabled={staleData || busy || needsReload}
                    eventId={editId}
                    eventName={editEvent?.title}
                    quotas={editEvent?.Quotas ?? []}
                    questions={editEvent?.Questions ?? []}
                  />
                ) : (
                  <p className="text-sm text-gray-600">Ei ilmoittautuneita</p>
                )}
              </FieldSet>
            </>
          )}
        </div>
      </fieldset>
    </form>
  );
}
