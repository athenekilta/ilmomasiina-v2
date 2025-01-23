import type { Quota } from "@prisma/client";
import { Button } from "@/components/Button";
import { Input } from "@/components/Input";

export function QuotaRow({
  quota,
  onChange,
  deleteQuota,
  quotasLength,
}: {
  quota: Quota;
  onChange: (value: Quota) => void;
  deleteQuota: (id: string) => void;
  quotasLength: number;
}) {
  return (
    <div className="my-1 gap-6 rounded-md border-2 border-slate-300 p-3 odd:bg-gray-100 even:bg-slate-100">
      <div className="max-w-3/4 mb-3 flex flex-col gap-6">
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
            disabled={quota.id === "public-quota"}
          />
        </div>
        <p className="text-slate-500">
          Jos kiintiöitä on vain yksi, voit antaa sen nimeksi esim. tapahtuman
          nimen. Voit järjestellä kiintiöitä raahaamalla niitä.
        </p>
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
          Jos kiintiön kokoa ole rajoitettu määrää, jätä kenttä tyhjäksi.
        </p>
      </div>
      <Button
        onClick={() => deleteQuota(quota.id)}
        type="button"
        disabled={quotasLength < 2}
        color="danger"
      >
        Poista jono
      </Button>
    </div>
  );
}
