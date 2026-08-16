import type { Quota } from "@/generated/prisma";
import { Button } from "@/components/Button";
import { Input } from "@/components/Input";
import { Divider } from "@/components/Divider";
import type { FieldErrorsImpl } from "react-hook-form";

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
        <label
          htmlFor={`quota-size-${quota.id}`}
          className="text-brand-dark w-32 shrink-0 pt-2 text-sm font-semibold"
        >
          Kiintiön koko
        </label>
        <div className="flex w-full flex-col gap-1 sm:max-w-xs">
          <Input
            id={`quota-size-${quota.id}`}
            value={quota.size || ""}
            type="number"
            min={0}
            onChange={(value) =>
              onChange({ ...quota, size: value.target.valueAsNumber })
            }
            fullWidth
          />
          <p className="text-xs leading-relaxed text-gray-600">
            Jos kiintiön kokoa ei ole rajoitettu, jätä kenttä tyhjäksi.
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
            {quota.signupCount === 1 ? "ilmoittautuminen" : "ilmoittautumista"}
            , joten sitä ei voi poistaa. Poista tai siirrä ilmoittautumiset
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
