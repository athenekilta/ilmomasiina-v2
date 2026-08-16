import { Button } from "@/components/Button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/Select";
import { useAlert } from "@/features/alert/hooks/useAlert";
import { decodeCheckboxAnswer } from "@/features/events/utils/questionAnswers";
import type { Answer, Question, Quota, Signup } from "@/generated/prisma";
import { api } from "@/utils/api";
import { formatDateTime } from "@/utils/format";
import { ChevronDown, ChevronRight } from "lucide-react";
import { useMemo, useState } from "react";

type SignupWithAnswers = Signup & { Answers: Answer[] };

const signupStatuses = {
  CONFIRMED: {
    label: "Vahvistettu",
    className: "bg-green-100 text-green-800",
  },
  IN_PROGRESS: {
    label: "Keskeneräinen",
    className: "bg-gray-100 text-gray-800",
  },
  PENDING: {
    label: "Odottaa paikanjakoa",
    className: "bg-blue-100 text-blue-800",
  },
  WAITLISTED: {
    label: "Varasijalla",
    className: "bg-yellow-100 text-yellow-800",
  },
  REJECTED: {
    label: "Ei saanut paikkaa",
    className: "bg-red-100 text-red-800",
  },
} as const;

export function SignupsTable({
  signups,
  eventId,
  eventName,
  quotas,
  questions,
}: {
  signups: SignupWithAnswers[];
  eventId: number;
  eventName?: string;
  quotas: Quota[];
  questions: Question[];
}) {
  const [isDownloading, setIsDownloading] = useState(false);
  const [expandedSignupIds, setExpandedSignupIds] = useState<Set<string>>(
    new Set(),
  );
  const alert = useAlert();
  const sortedQuestions = useMemo(
    () => [...questions].sort((a, b) => a.sortId - b.sortId),
    [questions],
  );
  const moveSignup = api.signups.moveSignupToQuota.useMutation({
    onSuccess: () => alert.success("Ilmoittautuminen siirretty"),
    onError: (error) => alert.error(error.message),
  });
  const csvExport = api.signups.exportSignupsCsv.useQuery(
    { eventId },
    { enabled: false },
  );

  const toggleSignup = (signupId: string) => {
    setExpandedSignupIds((current) => {
      const next = new Set(current);
      if (next.has(signupId)) next.delete(signupId);
      else next.add(signupId);
      return next;
    });
  };

  const handleDownload = async () => {
    setIsDownloading(true);
    try {
      const { data: csv } = await csvExport.refetch();
      if (!csv) throw new Error("CSV:n luominen epäonnistui");

      const blob = new Blob([csv], { type: "text/csv; charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = `${eventName}-ilmoittautumiset.csv`;
      anchor.click();
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
      <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-gray-600">
          Avaa rivi nähdäksesi kysymysten vastaukset.
        </p>
        <Button
          type="button"
          onClick={handleDownload}
          disabled={isDownloading}
          size="small"
        >
          {isDownloading ? "Ladataan..." : "Vie CSV-tiedostona"}
        </Button>
      </div>

      <div className="surface-panel overflow-hidden">
        <table className="w-full table-fixed text-sm">
          <colgroup>
            <col className="w-10" />
            <col className="hidden w-14 md:table-column" />
            <col />
            <col className="hidden w-[19%] md:table-column" />
            <col className="w-[42%] sm:w-[34%] md:w-[24%]" />
            <col className="hidden w-[20%] md:table-column" />
          </colgroup>
          <thead className="border-b border-stone-200 bg-stone-100">
            <tr>
              <th scope="col" className="px-2 py-2">
                <span className="sr-only">Avaa vastaukset</span>
              </th>
              <th
                scope="col"
                className="text-brand-dark hidden px-2 py-2 text-left text-xs font-semibold tracking-wide uppercase md:table-cell"
              >
                Nro
              </th>
              <th
                scope="col"
                className="text-brand-dark px-2 py-2 text-left text-xs font-semibold tracking-wide uppercase sm:px-3"
              >
                Ilmoittautunut
              </th>
              <th
                scope="col"
                className="text-brand-dark hidden px-3 py-2 text-left text-xs font-semibold tracking-wide uppercase md:table-cell"
              >
                Tila
              </th>
              <th
                scope="col"
                className="text-brand-dark px-2 py-2 text-left text-xs font-semibold tracking-wide uppercase sm:px-3"
              >
                Kiintiö
              </th>
              <th
                scope="col"
                className="text-brand-dark hidden px-3 py-2 text-left text-xs font-semibold tracking-wide uppercase md:table-cell"
              >
                Ilmoittautumisaika
              </th>
            </tr>
          </thead>
          <tbody className="bg-brand-light divide-y divide-stone-200">
            {signups.map((signup, index) => {
              const expanded = expandedSignupIds.has(signup.id);
              const status = signupStatuses[signup.status];
              const detailId = `signup-details-${signup.id}`;

              return (
                <SignupTableRows
                  key={signup.id}
                  signup={signup}
                  index={index}
                  expanded={expanded}
                  detailId={detailId}
                  status={status}
                  quotas={quotas}
                  questions={sortedQuestions}
                  isMoving={moveSignup.isPending}
                  onToggle={() => toggleSignup(signup.id)}
                  onMove={(targetQuotaId) => {
                    if (targetQuotaId === signup.quotaId) return;
                    moveSignup.mutate({ signupId: signup.id, targetQuotaId });
                  }}
                />
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function SignupTableRows({
  signup,
  index,
  expanded,
  detailId,
  status,
  quotas,
  questions,
  isMoving,
  onToggle,
  onMove,
}: {
  signup: SignupWithAnswers;
  index: number;
  expanded: boolean;
  detailId: string;
  status: (typeof signupStatuses)[keyof typeof signupStatuses];
  quotas: Quota[];
  questions: Question[];
  isMoving: boolean;
  onToggle: () => void;
  onMove: (quotaId: string) => void;
}) {
  return (
    <>
      <tr
        className="hover:bg-brand-beige cursor-pointer transition-colors"
        onClick={onToggle}
      >
        <td className="px-2 py-2 align-middle">
          <button
            type="button"
            className="text-brand-dark rounded-control focus-visible:ring-brand-secondary flex size-7 items-center justify-center hover:bg-stone-200 focus-visible:ring-2 focus-visible:outline-hidden"
            aria-expanded={expanded}
            aria-controls={detailId}
            aria-label={`${expanded ? "Sulje" : "Avaa"} käyttäjän ${signup.name} vastaukset`}
            onClick={(event) => {
              event.stopPropagation();
              onToggle();
            }}
          >
            {expanded ? (
              <ChevronDown className="size-4" aria-hidden="true" />
            ) : (
              <ChevronRight className="size-4" aria-hidden="true" />
            )}
          </button>
        </td>
        <td className="hidden px-2 py-2 text-gray-600 tabular-nums md:table-cell">
          {index + 1}.
        </td>
        <td className="px-2 py-2 align-middle sm:px-3">
          <span
            className="text-brand-dark block truncate font-medium"
            title={signup.name}
          >
            {signup.name}
          </span>
          <span
            className="block truncate text-xs text-gray-600"
            title={signup.email}
          >
            {signup.email}
          </span>
        </td>
        <td className="hidden px-3 py-2 align-middle md:table-cell">
          <span
            className={`rounded-control inline-flex px-2 py-1 text-xs font-semibold ${status.className}`}
          >
            {status.label}
          </span>
        </td>
        <td
          className="px-2 py-2 align-middle sm:px-3"
          onClick={(event) => event.stopPropagation()}
        >
          <Select
            value={signup.quotaId}
            disabled={isMoving}
            onValueChange={onMove}
          >
            <SelectTrigger className="h-9 min-w-0 px-2">
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
        <td className="hidden px-3 py-2 text-gray-700 md:table-cell">
          {formatDateTime(signup.createdAt, {
            dateStyle: "short",
            timeStyle: "short",
          })}
        </td>
      </tr>

      {expanded && (
        <tr id={detailId} className="bg-stone-50">
          <td colSpan={6} className="px-4 py-4 sm:px-6">
            <div className="mb-4 grid gap-3 text-sm sm:grid-cols-2 md:hidden">
              <DetailItem label="Tila" value={status.label} />
              <DetailItem
                label="Ilmoittautumisaika"
                value={formatDateTime(signup.createdAt, {
                  dateStyle: "short",
                  timeStyle: "short",
                })}
              />
            </div>

            <h3 className="text-brand-dark mb-3 text-sm font-semibold">
              Kysymysten vastaukset
            </h3>
            {questions.length > 0 ? (
              <dl className="grid gap-x-8 gap-y-4 sm:grid-cols-2">
                {questions.map((question) => {
                  const rawAnswer = signup.Answers.find(
                    (answer) => answer.questionId === question.id,
                  )?.answer;
                  const answer =
                    question.type === "checkbox"
                      ? decodeCheckboxAnswer(rawAnswer).join(", ")
                      : rawAnswer?.trim();

                  return (
                    <DetailItem
                      key={question.id}
                      label={question.question}
                      value={answer || "Ei vastausta"}
                      muted={!answer}
                    />
                  );
                })}
              </dl>
            ) : (
              <p className="text-sm text-gray-600">
                Tapahtumalla ei ole lisäkysymyksiä.
              </p>
            )}
          </td>
        </tr>
      )}
    </>
  );
}

function DetailItem({
  label,
  value,
  muted = false,
}: {
  label: string;
  value: string;
  muted?: boolean;
}) {
  return (
    <div className="min-w-0">
      <dt className="mb-1 text-xs font-semibold tracking-wide text-gray-600 uppercase">
        {label}
      </dt>
      <dd
        className={`wrap-break-word whitespace-pre-wrap ${muted ? "text-gray-500 italic" : "text-brand-dark"}`}
      >
        {value}
      </dd>
    </div>
  );
}
