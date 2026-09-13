import { Button } from "@/components/Button";

export function DraftChangeNotice({ onReload, disabled = false }: {
  onReload: () => void;
  disabled?: boolean;
}) {
  return (
    <div role="status" className="surface-muted mb-4 space-y-3 border border-amber-300 p-4 text-sm">
      <p>
        Tietoja on muutettu muualla. Omat muutoksesi ovat tallessa tässä lomakkeessa.
        Lataa uusimmat tiedot ennen tallentamista. Lataaminen hylkää omat
        tallentamattomat muutoksesi ja kuvavalintasi.
      </p>
      <Button type="button" variant="bordered" disabled={disabled} onClick={onReload}>
        Hylkää omat muutokset ja lataa uusimmat
      </Button>
    </div>
  );
}
