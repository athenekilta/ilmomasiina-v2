import type { Quota, Signup } from "@/generated/prisma";
import { SignupRow } from "./SingupRow";
import { Button } from "@/components/Button";
import { api } from "@/utils/api";
import { useState } from "react";
import { useAlert } from "@/features/alert/hooks/useAlert";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/Select";

export function SignupsTable({
  signups,
  eventId,
  eventName,
  quotas,
}: {
  signups: Signup[];
  eventId: number;
  eventName?: string;
  quotas: Quota[];
}) {
  const [isDownloading, setIsDownloading] = useState(false);
  const alert = useAlert();
  const moveSignup = api.signups.moveSignupToQuota.useMutation({
    onSuccess: () => {
      alert.success("Ilmoittautuminen siirretty");
      window.location.reload();
    },
    onError: (error) => alert.error(error.message),
  });
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
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                Siirrä kiintiöön
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
                  {signup.status === "IN_PROGRESS" && (
                    <span className="rounded-control bg-gray-100 px-2 py-1 text-xs font-semibold text-gray-800">
                      Keskeneräinen
                    </span>
                  )}
                  {signup.status === "PENDING" && (
                    <span className="rounded-control bg-blue-100 px-2 py-1 text-xs font-semibold text-blue-800">
                      Odottaa paikanjakoa
                    </span>
                  )}
                  {signup.status === "WAITLISTED" && (
                    <span className="rounded-control bg-yellow-100 px-2 py-1 text-xs font-semibold text-yellow-800">
                      Varasijalla
                    </span>
                  )}
                  {signup.status === "REJECTED" && (
                    <span className="rounded-control bg-red-100 px-2 py-1 text-xs font-semibold text-red-800">
                      Ei saanut paikkaa
                    </span>
                  )}
                </td>
                <td className="px-3 py-1.5 text-sm text-gray-700">
                  {quotas.find((quota) => quota.id === signup.quotaId)?.title ??
                    signup.quotaId}
                </td>
                <SignupRow
                  signup={signup}
                  rowStyle="px-3 py-1.5 text-sm text-gray-700"
                />
                <td className="min-w-56 px-4 py-2">
                  <Select
                    value={signup.quotaId}
                    disabled={moveSignup.isPending}
                    onValueChange={(targetQuotaId) => {
                      if (targetQuotaId === signup.quotaId) return;
                      moveSignup.mutate({ signupId: signup.id, targetQuotaId });
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {quotas.map((quota) => (
                        <SelectItem key={quota.id} value={quota.id}>
                          {quota.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
