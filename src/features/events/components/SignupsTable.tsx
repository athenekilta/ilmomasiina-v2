import type { Signup } from "@prisma/client";
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
      <div>
        <h2 className="text-2xl font-semibold text-gray-900">
          <Button onClick={handleDownload} disabled={isDownloading}>
            {isDownloading ? "Ladataan..." : "Vie CSV-tiedostona"}
          </Button>
        </h2>
      </div>
      <div className="overflow-x-auto">
        <table className="bg-brand-light my-6 min-w-full divide-y divide-gray-200 rounded shadow">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                Järjestys
              </th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                Nimi
              </th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                Sähköposti
              </th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                Tila
              </th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                Kiintiö
              </th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                Ilmoittautumisaika
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {signups.map((signup, idx) => (
              <tr key={signup.id ?? idx} className="hover:bg-gray-50">
                <td className="px-4 py-2 text-sm text-gray-700">{idx + 1}.</td>
                <td className="px-4 py-2 text-sm text-gray-700">
                  {signup.name}
                </td>
                <td className="px-4 py-2 text-sm text-gray-700">
                  {signup.email}
                </td>
                <td className="px-4 py-2 text-sm text-gray-700">
                  {signup.status == "CONFIRMED" && (
                    <span className="rounded-full bg-green-100 px-2 py-1 text-xs font-semibold text-green-800">
                      Vahvistettu
                    </span>
                  )}
                  {signup.status == "PENDING" &&
                    (signup.completedAt ? (
                      <span className="rounded-full bg-yellow-100 px-2 py-1 text-xs font-semibold text-yellow-800">
                        Jonossa
                      </span>
                    ) : (
                      <span className="rounded-full bg-gray-100 px-2 py-2 text-xs font-semibold text-gray-800">
                        Keskeneräinen
                      </span>
                    ))}
                </td>
                <td className="px-4 py-2 text-sm text-gray-700">
                  {signup.originalQuotaId}
                </td>
                <SignupRow
                  signup={signup}
                  rowStyle="px-4 py-2 text-sm text-gray-700"
                />
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
