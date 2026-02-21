import { FieldSet } from "@/components/FieldSet";
import { Input } from "@/components/Input";
import { Switch } from "@/components/Switch";
import { eventFormSchema } from "../utils/eventFormSchema";
import { RichTextEditor } from "./RichTextEditor";
import type {
  Control,
  FieldErrors,
  UseFormRegister,
  UseFormSetValue,
  UseFormWatch,
} from "react-hook-form";
import type { z } from "zod";
import { TimeInput } from "@/components/TimeInput";

type EventFormValues = z.input<typeof eventFormSchema>;

type BasicInfoFieldsProps = {
  control: Control<EventFormValues>;
  register: UseFormRegister<EventFormValues>;
  watch: UseFormWatch<EventFormValues>;
  setValue: UseFormSetValue<EventFormValues>;
  errors: FieldErrors<EventFormValues>;
};

export function BasicInfoFields({
  control,
  register,
  watch,
  setValue,
  errors,
}: BasicInfoFieldsProps) {
  return (
    <>
      <FieldSet title="Nimi">
        <Input
          {...register("title")}
          error={!!errors.title}
          helperText={errors.title?.message}
        />
      </FieldSet>
      <FieldSet title="Aika">
        <div className="grid w-full grid-cols-1 gap-6">
          <Input
            {...register("date")}
            type="date"
            error={!!errors.date}
            helperText={errors.date?.message}
          />
          <Input
            {...register("time")}
            type="time"
            error={!!errors.time}
            helperText={errors.time?.message}
          />
        </div>
      </FieldSet>
      <FieldSet title="Registration start time">
        <div className="grid w-full grid-cols-1 gap-6">
          <Input
            {...register("registrationStartDate")}
            type="date"
            error={!!errors.registrationStartDate}
            helperText={errors.registrationStartDate?.message}
          />
          <TimeInput
            control={control}
            name="registrationStartTime"
            error={!!errors.registrationStartTime}
          />
        </div>
      </FieldSet>
      <FieldSet title="Registration end time">
        <div className="grid w-full grid-cols-1 gap-6">
          <Input
            {...register("registrationEndDate")}
            type="date"
            error={!!errors.registrationEndDate}
            helperText={errors.registrationEndDate?.message}
          />
          <TimeInput
            control={control}
            name="registrationEndTime"
            error={!!errors.registrationEndTime}
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
          value={watch("description") || ""}
          onChange={(value) => setValue("description", value)}
        />
      </FieldSet>
    </>
  );
}
