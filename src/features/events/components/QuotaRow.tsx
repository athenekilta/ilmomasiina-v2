import type { Quota } from "@prisma/client";
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
      <div className="max-w-3/4 mb-3 flex flex-col gap-6">
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
              disabled={quota.id.includes("public-quota")}
              error={!!errors?.title}
              helperText={errors?.title ? 
                errors.title.message : 
                undefined}
            />
          </div>
          <p className="text-slate-500">
            <></>
            {quota.id.includes("public-quota") ? (
              "Avoimen kiintiön nimeä ei voi muuttaa. Avoin kiintiö on kaikille osallistujille yhteinen kiintiö, johon siirretään muita kiintiöitä jonottavat osallistujat, mikäli avoimessa kiintiössä on tilaa."
            ) : (
              "Jos kiintiöitä on vain yksi, voit antaa sen nimeksi esim. tapahtuman nimen. Voit järjestellä kiintiöitä raahaamalla niitä."
            )}          
          </p>
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
        <div className="flex flex-row gap-5 items-center mt-4">
          <Button
            onClick={() => deleteQuota(quota.id)}
            type="button"
            disabled={quotasLength < 2 || quota.signupCount > 0 }
            color="danger"
          >
            Poista kiintiö
          </Button>
          <ul className="text-slate-500">
            {quota.signupCount > 0 && (
              <li>
                Kiintiössä on {quota.signupCount} {quota
                .signupCount == 1 ? "ilmoittautuminen" : "ilmoittautumista"}, joten sitä
                ei voi poistaa. Poista tai siirrä ilmoittautumiset toiseen kiintiöön ennen tämän kiintiön poistamista.
              </li>
            )}
            {quotasLength < 2 && (
              <li>
                Tapahtuman ainoaa kiintiötä ei voi poistaa.
              </li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}
