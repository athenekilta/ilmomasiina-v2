import type { Quota } from "@/generated/prisma";
import { Button } from "@/components/Button";
import { Input } from "@/components/Input";
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
  return (
    <div className="my-1 gap-6 rounded-md border-2 border-slate-300 p-3 odd:bg-gray-100 even:bg-slate-100">
      <div className="mb-3 flex max-w-3/4 flex-col gap-6">
        <div className="flex flex-col gap-6">
          <div className="flex flex-row items-center gap-2">
            <label htmlFor="name" className="w-28">
              Kiintiön nimi:
            </label>
            <Input
              title="Nimi"
              value={quota.title}
              onChange={(value) =>
                onChange({ ...quota, title: value.target.value })
              }
              className="w-1/2"
              error={!!errors?.title}
              helperText={errors?.title ? errors.title.message : undefined}
            />
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <div className="flex flex-row items-center gap-2">
            <label htmlFor="size" className="w-28">
              Kiintiön koko:{" "}
            </label>
            <Input
              value={quota.size || ""}
              type="number"
              min={0}
              onChange={(value) =>
                onChange({ ...quota, size: value.target.valueAsNumber })
              }
              className="w-1/2"
            />
          </div>
          <p className="text-slate-500">
            Jos kiintiön kokoa ei ole rajoitettu, jätä kenttä tyhjäksi.
          </p>
        </div>
        <div className="mt-4 flex flex-row items-center gap-5">
          <Button
            onClick={() => deleteQuota(quota.id)}
            type="button"
            disabled={quotasLength < 2 || quota.signupCount > 0}
            color="danger"
          >
            Poista kiintiö
          </Button>
          <ul className="text-slate-500">
            {quota.signupCount > 0 && (
              <li>
                Kiintiössä on {quota.signupCount}{" "}
                {quota.signupCount == 1
                  ? "ilmoittautuminen"
                  : "ilmoittautumista"}
                , joten sitä ei voi poistaa. Poista tai siirrä ilmoittautumiset
                toiseen kiintiöön ennen tämän kiintiön poistamista.
              </li>
            )}
            {quotasLength < 2 && (
              <li>Tapahtuman ainoaa kiintiötä ei voi poistaa.</li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}
