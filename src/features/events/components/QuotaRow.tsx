import { Button } from "@/components/Button";
import { Input } from "@/components/Input";
import { Divider } from "@/components/Divider";
import type { FieldErrorsImpl } from "react-hook-form";
import type { z } from "zod";
import { eventFormSchema } from "../utils/eventFormSchema";
import type { Locale } from "@/i18n/config";
import { useTranslations } from "@/i18n/I18nProvider";
import { eventAdminMessages } from "@/i18n/messages/eventAdmin";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/Select";

type EventFormValues = z.input<typeof eventFormSchema>;
type QuotaValue = EventFormValues["Quotas"][number];

export function QuotaRow({
  quota,
  onChange,
  deleteQuota,
  quotasLength,
  signupCount,
  seatHoldingSignupCount,
  moveUnusedPlacesToJokerPlaces,
  errors,
  activeLanguage,
}: {
  quota: QuotaValue;
  onChange: (value: QuotaValue) => void;
  deleteQuota: (id: string) => void;
  quotasLength: number;
  signupCount: number;
  seatHoldingSignupCount: number;
  moveUnusedPlacesToJokerPlaces: (id: string, usedPlaces: number) => void;
  errors: FieldErrorsImpl<QuotaValue> | undefined;
  activeLanguage: Locale;
}) {
  const messages = useTranslations(eventAdminMessages);
  const canDelete = quotasLength >= 2 && signupCount === 0;
  // A lone quota has no one to share with, so the event has no shared places
  // and the controls that only exist to steer them have nothing to steer.
  const hasSharedPlaces = quotasLength >= 2;
  const protectedPlacesUsed =
    quota.size === null
      ? seatHoldingSignupCount
      : Math.min(seatHoldingSignupCount, quota.size);
  const unusedPlaces =
    quota.size === null ? 0 : Math.max(quota.size - protectedPlacesUsed, 0);
  const fillPercentage =
    quota.size === null || quota.size === 0
      ? 0
      : (protectedPlacesUsed / quota.size) * 100;

  return (
    <div className="surface-muted flex flex-col gap-5 p-4">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:gap-4">
        <label
          htmlFor={`quota-title-${quota.id}-${activeLanguage}`}
          className="text-brand-dark w-32 shrink-0 pt-2 text-sm font-semibold"
        >
          {messages.quotas.name}
        </label>
        <Input
          id={`quota-title-${quota.id}-${activeLanguage}`}
          title={messages.quotas.nameTitle}
          value={quota.translations[activeLanguage]}
          onChange={(event) =>
            onChange({
              ...quota,
              translations: {
                ...quota.translations,
                [activeLanguage]: event.target.value,
              },
            })
          }
          fullWidth
          error={!!errors?.translations?.[activeLanguage]}
          helperText={errors?.translations?.[activeLanguage]?.message}
        />
      </div>

      <div
        className="flex flex-col gap-2 sm:flex-row sm:items-start sm:gap-4"
        hidden={!hasSharedPlaces}
      >
        <label className="text-brand-dark w-32 shrink-0 pt-2 text-sm font-semibold">
          {messages.quotas.sharedPlaces}
        </label>
        <div className="flex w-full flex-col gap-1">
          <Select
            value={quota.sharedPlacesAllocation}
            onValueChange={(sharedPlacesAllocation) =>
              onChange({
                ...quota,
                sharedPlacesAllocation:
                  sharedPlacesAllocation as QuotaValue["sharedPlacesAllocation"],
              })
            }
          >
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="NEVER">
                {messages.quotas.sharedOptions.NEVER}
              </SelectItem>
              <SelectItem value="IMMEDIATE">
                {messages.quotas.sharedOptions.IMMEDIATE}
              </SelectItem>
              <SelectItem value="AFTER_REGISTRATION_CLOSE">
                {messages.quotas.sharedOptions.AFTER_REGISTRATION_CLOSE}
              </SelectItem>
            </SelectContent>
          </Select>
          <p className="text-xs leading-relaxed text-gray-600">
            {messages.quotas.sharedHelp[quota.sharedPlacesAllocation]}
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:gap-4">
        <label
          htmlFor={`quota-size-${quota.id}`}
          className="text-brand-dark w-32 shrink-0 pt-2 text-sm font-semibold"
        >
          {messages.quotas.places}
        </label>
        <div className="flex w-full flex-col gap-1 sm:max-w-xs">
          <Input
            id={`quota-size-${quota.id}`}
            value={quota.size ?? ""}
            type="number"
            min={0}
            onChange={(value) =>
              onChange({
                ...quota,
                size:
                  value.target.value === "" ? null : value.target.valueAsNumber,
              })
            }
            fullWidth
          />
          <p className="text-xs leading-relaxed text-gray-600">
            {messages.quotas.placesHelp}
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:gap-4">
        <p className="text-brand-dark w-32 shrink-0 text-sm font-semibold">
          {messages.quotas.occupancy}
        </p>
        <div className="flex w-full flex-col gap-2">
          <div>
            <div className="mb-1 flex items-center justify-between gap-3 text-xs text-gray-600">
              <span>
                {quota.size === null
                  ? messages.quotas.unlimited
                  : messages.quotas.used(protectedPlacesUsed, quota.size)}
              </span>
              {quota.size !== null && (
                <span className="shrink-0 tabular-nums">
                  {messages.quotas.available(unusedPlaces)}
                </span>
              )}
            </div>
            <div
              className="h-2 overflow-hidden bg-stone-200"
              role="img"
              aria-label={
                quota.size === null
                  ? messages.quotas.unlimitedAria
                  : messages.quotas.used(protectedPlacesUsed, quota.size)
              }
            >
              <div
                className="bg-brand-primary h-full"
                style={{ width: `${fillPercentage}%` }}
              />
            </div>
          </div>
          <div hidden={!hasSharedPlaces}>
            <Button
              type="button"
              size="small"
              color="neutral"
              variant="bordered"
              disabled={quota.size === null || unusedPlaces === 0}
              onClick={() =>
                moveUnusedPlacesToJokerPlaces(quota.id, seatHoldingSignupCount)
              }
            >
              {messages.quotas.moveUnused}
            </Button>
          </div>
        </div>
      </div>

      <Divider spacingY="none" />

      <div className="flex flex-wrap items-center gap-3">
        <Button
          onClick={() => deleteQuota(quota.id)}
          type="button"
          size="small"
          disabled={!canDelete}
          color="danger"
        >
          {messages.quotas.remove}
        </Button>
        {signupCount > 0 && (
          <p className="text-xs leading-relaxed text-gray-600">
            {messages.quotas.hasSignups(signupCount)}
          </p>
        )}
        {quotasLength < 2 && (
          <p className="text-xs leading-relaxed text-gray-600">
            {messages.quotas.onlyQuota}
          </p>
        )}
      </div>
    </div>
  );
}
