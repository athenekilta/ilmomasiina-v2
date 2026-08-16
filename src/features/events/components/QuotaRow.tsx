import type { Quota } from "@/generated/prisma";
import { Button } from "@/components/Button";
import { Input } from "@/components/Input";
import { Divider } from "@/components/Divider";
import type { FieldErrorsImpl } from "react-hook-form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/Select";

export function QuotaRow({
  quota,
  onChange,
  deleteQuota,
  quotasLength,
  seatHoldingSignupCount,
  moveUnusedPlacesToJokerPlaces,
  errors,
}: {
  quota: Quota & { signupCount: number };
  onChange: (value: Quota & { signupCount: number }) => void;
  deleteQuota: (id: string) => void;
  quotasLength: number;
  seatHoldingSignupCount: number;
  moveUnusedPlacesToJokerPlaces: (id: string, usedPlaces: number) => void;
  errors: FieldErrorsImpl<Quota> | undefined;
}) {
  const canDelete = quotasLength >= 2 && quota.signupCount === 0;
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
          htmlFor={`quota-title-${quota.id}`}
          className="text-brand-dark w-32 shrink-0 pt-2 text-sm font-semibold"
        >
          Kiintiön nimi
        </label>
        <Input
          id={`quota-title-${quota.id}`}
          title="Nimi"
          value={quota.title}
          onChange={(value) =>
            onChange({ ...quota, title: value.target.value })
          }
          fullWidth
          error={!!errors?.title}
          helperText={errors?.title ? errors.title.message : undefined}
        />
      </div>

      <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:gap-4">
        <label className="text-brand-dark w-32 shrink-0 pt-2 text-sm font-semibold">
          Jokeripaikat
        </label>
        <div className="flex w-full flex-col gap-1">
          <Select
            value={quota.sharedPlacesAllocation}
            onValueChange={(sharedPlacesAllocation) =>
              onChange({
                ...quota,
                sharedPlacesAllocation:
                  sharedPlacesAllocation as Quota["sharedPlacesAllocation"],
              })
            }
          >
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="NEVER">Ei käytä jokeripaikkoja</SelectItem>
              <SelectItem value="IMMEDIATE">Käyttää jokeripaikkoja</SelectItem>
              <SelectItem value="AFTER_REGISTRATION_CLOSE">
                Käyttää jäljelle jääneitä jokeripaikkoja ilmoittautumisen
                päätyttyä
              </SelectItem>
            </SelectContent>
          </Select>
          <p className="text-xs leading-relaxed text-gray-600">
            {quota.sharedPlacesAllocation === "NEVER"
              ? "Paikat jaetaan vain tämän kiintiön paikoista."
              : quota.sharedPlacesAllocation === "IMMEDIATE"
                ? "Kiintiöpaikkojen täytyttyä käytetään jokeripaikkoja."
                : "Kiintiöpaikkojen täytyttyä ilmoittautumiset odottavat jokeripaikkojen jakoa ilmoittautumisen päättymiseen asti."}
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:gap-4">
        <label
          htmlFor={`quota-size-${quota.id}`}
          className="text-brand-dark w-32 shrink-0 pt-2 text-sm font-semibold"
        >
          Kiintiöpaikat
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
            Nämä paikat on varattu tämän kiintiön ilmoittautujille.
            Käyttämättömiä kiintiöpaikkoja ei siirretä automaattisesti muille.
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:gap-4">
        <p className="text-brand-dark w-32 shrink-0 text-sm font-semibold">
          Kiintiön täyttö
        </p>
        <div className="flex w-full flex-col gap-2">
          <div>
            <div className="mb-1 flex items-center justify-between gap-3 text-xs text-gray-600">
              <span>
                {quota.size === null
                  ? "Paikkamäärää ei ole rajattu"
                  : `${protectedPlacesUsed} / ${quota.size} kiintiöpaikkaa käytössä`}
              </span>
              {quota.size !== null && (
                <span className="shrink-0 tabular-nums">
                  {unusedPlaces} vapaana
                </span>
              )}
            </div>
            <div
              className="h-2 overflow-hidden rounded-full bg-stone-200"
              role="img"
              aria-label={
                quota.size === null
                  ? "Kiintiön paikkamäärää ei ole rajattu"
                  : `${protectedPlacesUsed} / ${quota.size} kiintiöpaikkaa käytössä`
              }
            >
              <div
                className="bg-brand-primary h-full rounded-full"
                style={{ width: `${fillPercentage}%` }}
              />
            </div>
          </div>
          <div>
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
              Siirrä vapaat paikat jokeripaikoiksi
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
          Poista kiintiö
        </Button>
        {quota.signupCount > 0 && (
          <p className="text-xs leading-relaxed text-gray-600">
            Kiintiössä on {quota.signupCount}{" "}
            {quota.signupCount === 1 ? "ilmoittautuminen" : "ilmoittautumista"},
            joten sitä ei voi poistaa. Poista tai siirrä ilmoittautumiset
            toiseen kiintiöön ennen tämän kiintiön poistamista.
          </p>
        )}
        {quotasLength < 2 && (
          <p className="text-xs leading-relaxed text-gray-600">
            Tapahtuman ainoaa kiintiötä ei voi poistaa.
          </p>
        )}
      </div>
    </div>
  );
}
