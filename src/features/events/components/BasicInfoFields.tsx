import { FieldSet } from "@/components/FieldSet";
import { Input } from "@/components/Input";
import { Switch } from "@/components/Switch";
import { TextArea } from "@/components/TextArea";
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
import { DateInput } from "@/components/DateInput";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/Select";
import type { Locale } from "@/i18n/config";
import { useTranslations } from "@/i18n/I18nProvider";
import { eventAdminMessages } from "@/i18n/messages/eventAdmin";

type EventFormValues = z.input<typeof eventFormSchema>;

type BasicInfoFieldsProps = {
  control: Control<EventFormValues>;
  register: UseFormRegister<EventFormValues>;
  watch: UseFormWatch<EventFormValues>;
  setValue: UseFormSetValue<EventFormValues>;
  errors: FieldErrors<EventFormValues>;
  activeLanguage: Locale;
};

export function BasicInfoFields({
  control,
  register,
  watch,
  setValue,
  errors,
  activeLanguage,
}: BasicInfoFieldsProps) {
  const messages = useTranslations(eventAdminMessages);
  const languageName = messages.languages[activeLanguage];
  const translatedErrors = errors.translations?.[activeLanguage];
  const titleName = `translations.${activeLanguage}.title` as const;
  const badgeTextName = `translations.${activeLanguage}.badgeText` as const;
  const descriptionName = `translations.${activeLanguage}.description` as const;
  const verificationEmailName =
    `translations.${activeLanguage}.verificationEmail` as const;
  const badgeTones = ["GREEN", "PINK", "DARK"] as const;

  return (
    <div className="flex flex-col gap-6">
      <section
        aria-labelledby={`translated-content-${activeLanguage}`}
        className="surface-muted space-y-6 p-4"
      >
        <div>
          <h2
            id={`translated-content-${activeLanguage}`}
            className="eyebrow text-brand-secondary"
          >
            {messages.languages.section(languageName)}
          </h2>
          <p className="mt-1 text-sm text-gray-600">
            {activeLanguage === "fi"
              ? messages.languages.finnishRequired
              : messages.languages.englishOptional}
          </p>
        </div>

        <FieldSet title={messages.basic.title}>
          <Input
            {...register(titleName)}
            error={!!translatedErrors?.title}
            helperText={translatedErrors?.title?.message}
          />
        </FieldSet>
        <FieldSet title={messages.basic.badge}>
          <div className="flex w-full flex-col gap-3">
            <Input
              {...register(badgeTextName)}
              placeholder={messages.basic.badgePlaceholder}
              error={!!translatedErrors?.badgeText}
              helperText={translatedErrors?.badgeText?.message}
            />
            <Select
              value={watch("badgeTone") ?? "GREEN"}
              onValueChange={(value) =>
                setValue("badgeTone", value as EventFormValues["badgeTone"])
              }
            >
              <SelectTrigger className="w-full sm:w-70">
                <SelectValue placeholder={messages.basic.badgeTone} />
              </SelectTrigger>
              <SelectContent>
                {badgeTones.map((tone) => (
                  <SelectItem key={tone} value={tone}>
                    {messages.basic.badgeTones[tone]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </FieldSet>
        <FieldSet title={messages.basic.description}>
          <RichTextEditor
            value={watch(descriptionName) || ""}
            onChange={(value) => setValue(descriptionName, value)}
          />
        </FieldSet>
        <FieldSet title={messages.form.verificationEmail}>
          <TextArea {...register(verificationEmailName)} rows={5} fullWidth />
        </FieldSet>
      </section>

      <section
        aria-labelledby="shared-event-content"
        className="flex flex-col gap-6"
      >
        <h2 id="shared-event-content" className="eyebrow text-brand-secondary">
          {messages.basic.sharedSection}
        </h2>
        <FieldSet title={messages.basic.eventTime}>
          <div className="grid w-full grid-cols-1 gap-6 sm:grid-cols-2">
            <DateInput
              control={control}
              name="date"
              error={!!errors.date}
              helperText={errors.date?.message}
            />
            <TimeInput
              control={control}
              name="time"
              error={!!errors.time}
              helperText={errors.time?.message}
            />
          </div>
        </FieldSet>
        <FieldSet title={messages.basic.registrationStarts}>
          <div className="grid w-full grid-cols-1 gap-6 sm:grid-cols-2">
            <DateInput
              control={control}
              name="registrationStartDate"
              error={!!errors.registrationStartDate}
              helperText={errors.registrationStartDate?.message}
            />
            <TimeInput
              control={control}
              name="registrationStartTime"
              error={!!errors.registrationStartTime}
              helperText={errors.registrationStartTime?.message}
            />
          </div>
        </FieldSet>
        <FieldSet title={messages.basic.registrationEnds}>
          <div className="grid w-full grid-cols-1 gap-6 sm:grid-cols-2">
            <DateInput
              control={control}
              name="registrationEndDate"
              error={!!errors.registrationEndDate}
              helperText={errors.registrationEndDate?.message}
            />
            <TimeInput
              control={control}
              name="registrationEndTime"
              error={!!errors.registrationEndTime}
              helperText={errors.registrationEndTime?.message}
            />
          </div>
        </FieldSet>

        <FieldSet title={messages.basic.publicSignups}>
          <Switch
            id="event-signups-public"
            value={watch("signupsPublic")}
            onChange={(value) => setValue("signupsPublic", value)}
          />
        </FieldSet>
        <FieldSet title={messages.basic.location}>
          <Input
            {...register("location")}
            error={!!errors.location}
            helperText={errors.location?.message}
          />
        </FieldSet>
        <FieldSet title={messages.basic.price}>
          <Input
            {...register("price")}
            error={!!errors.price}
            helperText={errors.price?.message}
          />
        </FieldSet>
        <FieldSet title={messages.basic.webpageUrl}>
          <Input
            {...register("webpageUrl")}
            error={!!errors.webpageUrl}
            helperText={errors.webpageUrl?.message}
          />
        </FieldSet>
      </section>
    </div>
  );
}
