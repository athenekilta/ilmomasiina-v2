import { FieldSet } from "@/components/FieldSet";
import { Button } from "@/components/Button";
import { Input } from "@/components/Input";
import { QuotaRow } from "./QuotaRow";
import { DragDropContext, Draggable, Droppable } from "@hello-pangea/dnd";
import type { DragUpdate } from "@hello-pangea/dnd";
import cuid from "cuid";
import { eventFormSchema } from "../utils/eventFormSchema";
import type {
  FieldErrors,
  FieldErrorsImpl,
  UseFormGetValues,
  UseFormSetValue,
  UseFormWatch,
} from "react-hook-form";
import { useCallback, useEffect, useState } from "react";
import type { z } from "zod";
import type { Locale } from "@/i18n/config";
import { useTranslations } from "@/i18n/I18nProvider";
import { eventAdminMessages } from "@/i18n/messages/eventAdmin";

type EventFormValues = z.input<typeof eventFormSchema>;
type QuotaValue = EventFormValues["Quotas"][number];

type QuotasProps = {
  getValues: UseFormGetValues<EventFormValues>;
  setValue: UseFormSetValue<EventFormValues>;
  watch: UseFormWatch<EventFormValues>;
  errors: FieldErrors<EventFormValues>;
  eventId?: number;
  editId?: number;
  seatHoldingSignupCounts: Record<string, number>;
  signupCounts: Record<string, number>;
  activeLanguage: Locale;
};

export function Quotas({
  getValues,
  setValue,
  watch,
  errors,
  eventId,
  editId,
  seatHoldingSignupCounts,
  signupCounts,
  activeLanguage,
}: QuotasProps) {
  const messages = useTranslations(eventAdminMessages);
  const extraCapacity = watch("extraCapacity");
  const [extraCapacityInput, setExtraCapacityInput] = useState<string | null>(
    null,
  );
  // Shared places need someone to be shared with: with a single quota they
  // are that quota's own places under another name, so the event does not
  // have them at all. Kept as a stored value rather than zeroed here, so
  // splitting the quota in two again brings the places back untouched.
  const hasSharedPlaces = watch("Quotas").length > 1;

  const createQuota = useCallback(() => {
    const quotas = getValues("Quotas");
    const id = cuid();
    const sortId = quotas.length + 1;
    setValue("Quotas", [
      ...quotas,
      {
        id,
        translations: { fi: "", en: "" },
        size: null,
        sharedPlacesAllocation: "NEVER",
        sortId,
        eventId: eventId ?? NaN,
      },
    ]);
  }, [eventId, getValues, setValue]);

  useEffect(() => {
    if (watch("Quotas").length === 0 && editId === undefined) {
      createQuota();
    }
  }, [createQuota, editId, watch]);

  const deleteQuota = useCallback(
    (id: string) => {
      const quotas = getValues("Quotas");
      setValue(
        "Quotas",
        quotas.filter((quota) => quota.id !== id),
      );
    },
    [getValues, setValue],
  );

  const moveUnusedPlacesToSharedPlaces = useCallback(
    (id: string, usedPlaces: number) => {
      const quotas = [...getValues("Quotas")];
      const quotaIndex = quotas.findIndex((quota) => quota.id === id);
      const quota = quotas[quotaIndex];
      if (!quota || quota.size === null) return;

      const unusedPlaces = Math.max(quota.size - usedPlaces, 0);
      if (unusedPlaces === 0) return;

      quotas[quotaIndex] = {
        ...quota,
        size: quota.size - unusedPlaces,
      };
      setValue("Quotas", quotas, { shouldDirty: true, shouldValidate: true });
      setValue("extraCapacity", getValues("extraCapacity") + unusedPlaces, {
        shouldDirty: true,
        shouldValidate: true,
      });
    },
    [getValues, setValue],
  );

  const onDragEndQuota = useCallback(
    (result: DragUpdate) => {
      if (!result.destination) return;

      const quotas = [...getValues("Quotas")];
      const [removed] = quotas.splice(result.source.index, 1);
      if (!removed) return;

      quotas.splice(result.destination.index, 0, removed);
      const sortedQuotas = quotas.map((quota, index) => ({
        ...quota,
        sortId: index + 1,
      }));

      setValue("Quotas", sortedQuotas);
    },
    [getValues, setValue],
  );

  return (
    <FieldSet title={messages.quotas.title} level="section">
      <div className="mt-2 mb-5 flex flex-row gap-4">
        <Button onClick={() => createQuota()} type="button">
          {messages.quotas.add}
        </Button>
      </div>

      {errors.Quotas && (
        <div className="rounded-inner mb-4 flex items-start gap-3 border border-danger-400 bg-danger-50 p-3">
          <svg
            className="text-danger mt-0.5 h-5 w-5 shrink-0"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
              clipRule="evenodd"
            />
          </svg>
          <p className="text-sm text-danger-800">
            {typeof errors.Quotas.message === "string"
              ? errors.Quotas.message
              : messages.quotas.invalid}
          </p>
        </div>
      )}

      <DragDropContext onDragEnd={onDragEndQuota}>
        <Droppable droppableId="Quotas">
          {(droppableProvided) => (
            <div
              ref={droppableProvided.innerRef}
              {...droppableProvided.droppableProps}
              className="space-y-4"
            >
              {watch("Quotas").map((quota, index) => (
                <Draggable key={quota.id} draggableId={quota.id} index={index}>
                  {(draggableProvided) => (
                    <div
                      ref={draggableProvided.innerRef}
                      {...draggableProvided.draggableProps}
                      {...draggableProvided.dragHandleProps}
                    >
                      <QuotaRow
                        key={quota.id}
                        quota={quota}
                        quotasLength={watch("Quotas").length}
                        onChange={(value) => {
                          const quotas = [...getValues("Quotas")];
                          quotas[index] = value;
                          setValue("Quotas", quotas);
                        }}
                        deleteQuota={deleteQuota}
                        signupCount={signupCounts[quota.id] ?? 0}
                        seatHoldingSignupCount={
                          seatHoldingSignupCounts[quota.id] ?? 0
                        }
                        moveUnusedPlacesToSharedPlaces={
                          moveUnusedPlacesToSharedPlaces
                        }
                        activeLanguage={activeLanguage}
                        errors={
                          errors.Quotas &&
                          (errors.Quotas[index] as FieldErrorsImpl<QuotaValue>)
                        }
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

      <div className="surface-muted text-brand-dark my-5 p-4 text-sm">
        <p>{messages.quotas.extraHelp}</p>
        {hasSharedPlaces ? (
          <div className="mt-4 max-w-xs">
            <label className="mb-1 block font-semibold">
              {messages.quotas.extraCapacity}
            </label>
            <Input
              type="number"
              min={0}
              value={extraCapacityInput ?? extraCapacity}
              onBlur={() => setExtraCapacityInput(null)}
              onChange={(event) => {
                const value = event.target.value;
                setExtraCapacityInput(value);
                setValue(
                  "extraCapacity",
                  value === "" ? 0 : event.target.valueAsNumber,
                );
              }}
              error={!!errors.extraCapacity}
              helperText={errors.extraCapacity?.message}
            />
          </div>
        ) : (
          <p className="mt-4 font-semibold">
            {messages.quotas.extraNeedsTwoQuotas}
          </p>
        )}
        <p className="mt-3 font-semibold">
          {messages.quotas.total(
            watch("Quotas").reduce((sum, quota) => sum + (quota.size ?? 0), 0) +
              extraCapacity,
          )}
        </p>
      </div>
    </FieldSet>
  );
}
