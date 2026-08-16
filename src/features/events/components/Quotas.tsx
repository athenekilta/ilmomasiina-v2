import { FieldSet } from "@/components/FieldSet";
import { Button } from "@/components/Button";
import { Input } from "@/components/Input";
import { QuotaRow } from "./QuotaRow";
import { DragDropContext, Draggable, Droppable } from "@hello-pangea/dnd";
import type { DragUpdate } from "@hello-pangea/dnd";
import cuid from "cuid";
import type { Quota } from "@/generated/prisma/client";
import { eventFormSchema } from "../utils/eventFormSchema";
import type {
  FieldErrors,
  FieldErrorsImpl,
  UseFormGetValues,
  UseFormSetValue,
  UseFormWatch,
} from "react-hook-form";
import { useCallback, useEffect } from "react";
import type { z } from "zod";

type EventFormValues = z.input<typeof eventFormSchema>;

type QuotasProps = {
  getValues: UseFormGetValues<EventFormValues>;
  setValue: UseFormSetValue<EventFormValues>;
  watch: UseFormWatch<EventFormValues>;
  errors: FieldErrors<EventFormValues>;
  eventId?: number;
  editId?: number;
};

export function Quotas({
  getValues,
  setValue,
  watch,
  errors,
  eventId,
  editId,
}: QuotasProps) {
  const createQuota = useCallback(() => {
    const quotas = getValues("Quotas");
    const id = cuid();
    const sortId = quotas.length + 1;
    setValue("Quotas", [
      ...quotas,
      {
        id,
        title: "",
        size: null,
        sharedPlacesAllocation: "NEVER",
        sortId,
        eventId: eventId ?? NaN,
        signupCount: 0,
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
    <FieldSet title="Kiintiöt">

      <div className="mt-2 mb-5 flex flex-row gap-4">
        <Button onClick={() => createQuota()} type="button">
          Lisää kiintiö
        </Button>
      </div>

      {errors.Quotas && (
        <div className="rounded-control mb-4 flex items-start gap-3 border border-rose-400 bg-rose-50 p-3">
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
          <p className="text-sm text-rose-800">
            {typeof errors.Quotas.message === "string"
              ? errors.Quotas.message
              : "Please add at least one valid quota"}
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
                        errors={
                          errors.Quotas &&
                          (errors.Quotas[index] as FieldErrorsImpl<Quota>)
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

      <div className="my-5 rounded-md bg-blue-50 p-4 text-sm text-blue-900">
        <p>
        Jokeripaikat ovat ylimääräisiä paikkoja, jotka eivät kuulu mihinkään kiintiöön. 
        Niitä käytetään, jos oma kiintiö on täynnä, mutta jokeripaikoissa on vielä tilaa. 
        Kiintiökohtaisesti valitaan, voiko kiintiö käyttää jokeripaikkoja heti, 
        ilmoittautumisen päätyttyä tai ei lainkaan.
        </p>
        <div className="mt-4 max-w-xs">
          <label className="mb-1 block font-semibold">Jokeripaikat</label>
          <Input
            type="number"
            min={0}
            value={watch("extraCapacity")}
            onChange={(event) =>
              setValue(
                "extraCapacity",
                event.target.value === "" ? 0 : event.target.valueAsNumber,
              )
            }
            error={!!errors.extraCapacity}
            helperText={errors.extraCapacity?.message}
          />
        </div>
        <p className="mt-3 font-semibold">
          Paikkoja yhteensä:{" "}
          {watch("Quotas").reduce((sum, quota) => sum + (quota.size ?? 0), 0) +
            watch("extraCapacity")}
        </p>
      </div>
    </FieldSet>
  );
}
