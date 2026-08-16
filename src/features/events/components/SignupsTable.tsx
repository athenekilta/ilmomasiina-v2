import type { Signup } from "@/generated/prisma";
import { SignupRow } from "./SingupRow";
import { Button } from "@/components/Button";
import { api } from "@/utils/api";
import { useState } from "react";
import { useAlert } from "@/features/alert/hooks/useAlert";

export function SignupsTable({
  signups,
  eventId,
  eventName,
}: {
  signups: Signup[];
  eventId: number;
  eventName?: string;
}) {
  const [isDownloading, setIsDownloading] = useState(false);
  const alert = useAlert();
  const csvExport = api.signups.exportSignupsCsv.useQuery(
    { eventId },
    { enabled: false },
  );

  const handleDownload = async () => {
    setIsDownloading(true);
    try {
      const { data: csv } = await csvExport.refetch();
      if (!csv) throw new Error("CSV:n luominen epäonnistui");

      const blob = new Blob([csv], { type: "text/csv; charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${eventName}-ilmoittautumiset.csv`;
      a.click();
      URL.revokeObjectURL(url);

      alert.success("CSV ladattu onnistuneesti");
    } catch {
      alert.error("Virhe CSV:n latauksessa");
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div>
      <div className="mb-3 flex items-center justify-between gap-3">
        <Button onClick={handleDownload} disabled={isDownloading} size="small">
          {isDownloading ? "Ladataan..." : "Vie CSV-tiedostona"}
        </Button>
      </div>
      <div className="overflow-x-auto">
        <table className="surface-panel my-4 min-w-full divide-y divide-stone-200">
          <thead className="bg-stone-100">
            <tr>
              <th className="text-brand-dark px-3 py-2 text-left text-xs font-semibold tracking-wide uppercase">
                Järjestys
              </th>
              <th className="text-brand-dark px-3 py-2 text-left text-xs font-semibold tracking-wide uppercase">
                Nimi
              </th>
              <th className="text-brand-dark px-3 py-2 text-left text-xs font-semibold tracking-wide uppercase">
                Sähköposti
              </th>
              <th className="text-brand-dark px-3 py-2 text-left text-xs font-semibold tracking-wide uppercase">
                Tila
              </th>
              <th className="text-brand-dark px-3 py-2 text-left text-xs font-semibold tracking-wide uppercase">
                Kiintiö
              </th>
              <th className="text-brand-dark px-3 py-2 text-left text-xs font-semibold tracking-wide uppercase">
                Ilmoittautumisaika
              </th>
            </tr>
          </thead>
          <tbody className="bg-brand-light divide-y divide-stone-200">
            {signups.map((signup, idx) => (
              <tr key={signup.id ?? idx} className="hover:bg-brand-beige">
                <td className="px-3 py-1.5 text-sm text-gray-700">
                  {idx + 1}.
                </td>
                <td className="px-3 py-1.5 text-sm text-gray-700">
                  {signup.name}
                </td>
                <td className="px-3 py-1.5 text-sm text-gray-700">
                  {signup.email}
                </td>
                <td className="px-3 py-1.5 text-sm text-gray-700">
                  {signup.status == "CONFIRMED" && (
                    <span className="rounded-control bg-green-100 px-2 py-1 text-xs font-semibold text-green-800">
                      Vahvistettu
                    </span>
                  )}
                  {signup.status == "PENDING" &&
                    (signup.completedAt ? (
                      <span className="rounded-control bg-yellow-100 px-2 py-1 text-xs font-semibold text-yellow-800">
                        Jonossa
                      </span>
                    ) : (
                      <span className="rounded-control bg-gray-100 px-2 py-1 text-xs font-semibold text-gray-800">
                        Keskeneräinen
                      </span>
                    ))}
                </td>
                <td className="px-3 py-1.5 text-sm text-gray-700">
                  {signup.originalQuotaId}
                </td>
                <SignupRow
                  signup={signup}
                  rowStyle="px-3 py-1.5 text-sm text-gray-700"
                />
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
