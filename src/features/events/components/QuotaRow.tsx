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
  errors,
}: {
  quota: Quota & { signupCount: number };
  onChange: (value: Quota & { signupCount: number }) => void;
  deleteQuota: (id: string) => void;
  quotasLength: number;
  errors: FieldErrorsImpl<Quota> | undefined;
}) {
  const canDelete = quotasLength >= 2 && quota.signupCount === 0;

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
          Jaetut paikat
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
              <SelectItem value="NEVER">Ei käytä jaettuja paikkoja</SelectItem>
              <SelectItem value="IMMEDIATE">
                Käyttää jaettuja paikkoja
              </SelectItem>
              <SelectItem value="AFTER_REGISTRATION_CLOSE">
                Käyttää ylijääneitä jaettuja paikkoja ilmoittautumisen päätyttyä
              </SelectItem>
            </SelectContent>
          </Select>
          <p className="text-xs leading-relaxed text-gray-600">
            {quota.sharedPlacesAllocation === "NEVER"
              ? "Paikat jaetaan vain tämän kiintiön paikoista."
              : quota.sharedPlacesAllocation === "IMMEDIATE"
                ? "Kiintiöpaikkojen täytyttyä käytetään jaettuja paikkoja."
                : "Kiintiöpaikkojen täytyttyä ilmoittautumiset odottavat jaettujen paikkojen jakoa ilmoittautumisen päättymiseen asti."}
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
            value={quota.size || ""}
            type="number"
            min={1}
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
