import type { Signup } from "@prisma/client";
import { SignupRow } from "./SingupRow";
import { Button } from "@/components/Button";

export function SignupsTable({ signups }: { signups: Signup[] }) {
  return <div>
    <div>
      <h2 className="text-2xl font-semibold text-gray-900">
        <Button>
          Download as CSV
        </Button>
      </h2>
    </div>
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200 bg-white rounded shadow my-6">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Järjestys</th>
            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Nimi</th>
            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Sähköposti</th>
            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Tila</th>
            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Kiintiö</th>
            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Ilmoittautumisaika</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {signups.map((signup, idx) => (
            <tr key={signup.id ?? idx} className="hover:bg-gray-50">
              <td className="px-4 py-2 text-sm text-gray-700">{idx + 1}.</td>
              <td className="px-4 py-2 text-sm text-gray-700">{signup.name}</td>
              <td className="px-4 py-2 text-sm text-gray-700">{signup.email}</td>
              <td className="px-4 py-2 text-sm text-gray-700">
                {signup.status == "CONFIRMED" && (
                  <span className="rounded-full bg-green-100 px-2 py-1 text-xs font-semibold text-green-800">Vahvistettu</span>
                )}
                {signup.status == "PENDING" && (
                  signup.completedAt ? (
                    <span className="rounded-full bg-yellow-100 px-2 py-1 text-xs font-semibold text-yellow-800">Jonossa</span>
                  ) : (
                    <span className="rounded-full bg-gray-100 px-2 py-1 text-xs font-semibold text-gray-800">Vahvistamatta (tietojen täyttö kesken)</span>
                  )
                )
                }
              </td>
              <td className="px-4 py-2 text-sm text-gray-700">{signup.quotaId}</td>
              <SignupRow signup={signup} rowStyle="px-4 py-2 text-sm text-gray-700" />
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>;
}