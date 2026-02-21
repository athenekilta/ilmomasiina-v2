import { FieldSet } from "@/components/FieldSet";
import { Button } from "@/components/Button";
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
        sortId,
        eventId: eventId ?? NaN,
        signupCount: 0,
      },
    ]);
  }, [eventId, getValues, setValue]);

  const createPublicQueue = useCallback(() => {
    const quotas = getValues("Quotas");
    const sortId = quotas.length + 1;
    setValue("Quotas", [
      ...quotas,
      {
        id: eventId ? "public-quota-" + eventId : "public-quota",
        title: "Avoin kiintiö",
        size: null,
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
        <Button
          type="button"
          onClick={() => createPublicQueue()}
          disabled={
            !!watch("Quotas").find((quota) => quota.id.includes("public-quota"))
          }
        >
          Lisää avoin kiintiö
        </Button>
      </div>

      {errors.Quotas && (
        <div className="mb-4 rounded-md bg-red-50 p-3">
          <div className="flex">
            <div className="shrink-0">
              <svg
                className="h-5 w-5 text-red-400"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">
                {typeof errors.Quotas.message === "string"
                  ? errors.Quotas.message
                  : "Please add at least one valid quota"}
              </p>
            </div>
          </div>
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
    </FieldSet>
  );
}
