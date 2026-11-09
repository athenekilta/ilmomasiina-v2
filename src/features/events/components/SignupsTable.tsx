import { Button } from "@/components/Button";
import { ConfirmationDialog } from "@/components/ConfirmationDialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/Select";
import { useAlert } from "@/features/alert/hooks/useAlert";
import { decodeCheckboxAnswer } from "@/features/events/utils/questionAnswers";
import { api, type RouterOutputs } from "@/utils/api";
import { useIntlLocale, useLocale, useTranslations } from "@/i18n/I18nProvider";
import type { Locale } from "@/i18n/config";
import { appTimeZone } from "@/i18n/config";
import { eventAdminMessages } from "@/i18n/messages/eventAdmin";
import { draftSignature } from "../utils/draftSync";
import { ChevronDown, ChevronRight, Trash2 } from "lucide-react";
import { useMemo, useState } from "react";

type EditEvent = NonNullable<RouterOutputs["events"]["getEventEditId"]>;
type SignupWithAnswers = NonNullable<
  RouterOutputs["signups"]["getSignupByEventIds"]
>[number];
type AdminQuota = EditEvent["Quotas"][number];
type AdminQuestion = EditEvent["Questions"][number];

const signupStatusClasses = {
  CONFIRMED: "bg-green-100 text-green-800",
  IN_PROGRESS: "bg-gray-100 text-gray-800",
  PENDING: "bg-blue-100 text-blue-800",
  WAITLISTED: "bg-yellow-100 text-yellow-800",
  REJECTED: "bg-red-100 text-red-800",
} as const;

function localizedValue(translations: Record<Locale, string>, locale: Locale) {
  return translations[locale].trim() || translations.fi.trim();
}

function formatAnswer(
  question: AdminQuestion,
  rawAnswer: string | null | undefined,
  locale: Locale,
) {
  if (question.type === "text" || question.type === "textarea") {
    return rawAnswer?.trim() ?? "";
  }

  const optionIds =
    question.type === "checkbox"
      ? decodeCheckboxAnswer(rawAnswer)
      : rawAnswer
        ? [rawAnswer]
        : [];
  return optionIds
    .map((optionId) => {
      const option = question.options.find((item) => item.id === optionId);
      return option ? localizedValue(option.translations, locale) : optionId;
    })
    .join(", ");
}

export function SignupsTable({
  signups,
  eventId,
  eventName,
  quotas,
  questions,
  disabled = false,
}: {
  disabled?: boolean;
  signups: SignupWithAnswers[];
  eventId: number;
  eventName?: string;
  quotas: AdminQuota[];
  questions: AdminQuestion[];
}) {
  const locale = useLocale();
  const intlLocale = useIntlLocale();
  const messages = useTranslations(eventAdminMessages);
  const formatSignupDate = (date: Date) =>
    date.toLocaleString(intlLocale, {
      timeZone: appTimeZone,
      dateStyle: "short",
      timeStyle: "short",
    });
  const [isDownloading, setIsDownloading] = useState(false);
  const [signupToDelete, setSignupToDelete] =
    useState<SignupWithAnswers | null>(null);
  const [expandedSignupIds, setExpandedSignupIds] = useState<Set<string>>(
    new Set(),
  );
  const alert = useAlert();
  const apiContext = api.useContext();
  const sortedQuestions = useMemo(
    () => [...questions].sort((a, b) => a.sortId - b.sortId),
    [questions],
  );
  const moveSignup = api.signups.moveSignupToQuota.useMutation({
    onSuccess: () => alert.success(messages.signups.moved),
    onError: () => alert.error(messages.signups.moveFailed),
  });
  const deleteSignup = api.signups.deleteSignupAsAdmin.useMutation({
    onSuccess: (deletedSignup) => {
      setSignupToDelete(null);
      setExpandedSignupIds((current) => {
        const next = new Set(current);
        next.delete(deletedSignup.id);
        return next;
      });
      void apiContext.signups.getSignupByEventIds.invalidate({ eventId });
      alert.success(messages.signups.deleted);
    },
    onError: () => alert.error(messages.signups.deleteFailed),
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
      if (!csv) throw new Error(messages.signups.exportCreateFailed);

      const blob = new Blob([csv], { type: "text/csv; charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = `${eventName ?? "event"}-${messages.signups.exportFileSuffix}.csv`;
      anchor.click();
      URL.revokeObjectURL(url);

      alert.success(messages.signups.exportSuccess);
    } catch {
      alert.error(messages.signups.exportFailed);
    } finally {
      setIsDownloading(false);
    }
  };

  const currentDeleteTarget = signups.find(
    (signup) => signup.id === signupToDelete?.id,
  );
  const deleteTargetChanged =
    !!signupToDelete &&
    draftSignature(currentDeleteTarget) !== draftSignature(signupToDelete);
  const currentDeleteQuota = quotas.find(
    (quota) => quota.id === currentDeleteTarget?.quotaId,
  );
  const currentDeleteQuotaLabel = currentDeleteQuota
    ? localizedValue(currentDeleteQuota.translations, locale)
    : (currentDeleteTarget?.quotaId ?? "");

  return (
    <div>
      <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-gray-600">{messages.signups.intro}</p>
        <Button
          type="button"
          onClick={handleDownload}
          disabled={isDownloading || disabled}
          size="small"
        >
          {isDownloading ? messages.signups.exporting : messages.signups.export}
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
            <col className="w-12" />
          </colgroup>
          <thead className="border-b border-stone-200 bg-stone-100">
            <tr>
              <th scope="col" className="px-2 py-2">
                <span className="sr-only">
                  {messages.signups.expandAnswers}
                </span>
              </th>
              <th
                scope="col"
                className="label-caps text-brand-dark hidden px-2 py-2 text-left md:table-cell"
              >
                {messages.signups.number}
              </th>
              <th
                scope="col"
                className="label-caps text-brand-dark px-2 py-2 text-left sm:px-3"
              >
                {messages.signups.signup}
              </th>
              <th
                scope="col"
                className="label-caps text-brand-dark hidden px-3 py-2 text-left md:table-cell"
              >
                {messages.signups.status}
              </th>
              <th
                scope="col"
                className="label-caps text-brand-dark px-2 py-2 text-left sm:px-3"
              >
                {messages.signups.quota}
              </th>
              <th
                scope="col"
                className="label-caps text-brand-dark hidden px-3 py-2 text-left md:table-cell"
              >
                {messages.signups.signupTime}
              </th>
              <th scope="col" className="px-2 py-2">
                <span className="sr-only">{messages.signups.actions}</span>
              </th>
            </tr>
          </thead>
          <tbody className="bg-brand-light divide-y divide-stone-200">
            {signups.map((signup, index) => {
              const expanded = expandedSignupIds.has(signup.id);
              const status = {
                label: messages.signups.statuses[signup.status],
                className: signupStatusClasses[signup.status],
              };
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
                  locale={locale}
                  messages={messages.signups}
                  formatSignupDate={formatSignupDate}
                  isMoving={moveSignup.isPending || disabled}
                  isDeleting={deleteSignup.isPending || disabled}
                  onToggle={() => toggleSignup(signup.id)}
                  onMove={(targetQuotaId) => {
                    if (
                      disabled ||
                      targetQuotaId === signup.quotaId ||
                      !quotas.some((quota) => quota.id === targetQuotaId)
                    )
                      return;
                    moveSignup.mutate({ signupId: signup.id, targetQuotaId });
                  }}
                  onDelete={() => setSignupToDelete(signup)}
                />
              );
            })}
          </tbody>
        </table>
      </div>

      {signupToDelete && (
        <ConfirmationDialog
          title={messages.signups.deleteTitle}
          message={
            !currentDeleteTarget
              ? messages.signups.alreadyDeleted
              : deleteTargetChanged
                ? messages.signups.changed(
                    currentDeleteTarget.name,
                    currentDeleteQuotaLabel,
                  )
                : messages.signups.confirmDelete(signupToDelete.name)
          }
          confirmLabel={
            !currentDeleteTarget
              ? messages.image.close
              : deleteTargetChanged
                ? messages.signups.checkLatest
                : messages.signups.delete
          }
          pending={deleteSignup.isPending}
          onCancelAction={() => setSignupToDelete(null)}
          onConfirmAction={() => {
            if (!currentDeleteTarget) {
              setSignupToDelete(null);
              return;
            }
            if (deleteTargetChanged) {
              setSignupToDelete(currentDeleteTarget);
              return;
            }
            if (disabled) {
              alert.error(messages.signups.refreshBeforeDelete);
              return;
            }
            deleteSignup.mutate({ signupId: currentDeleteTarget.id, eventId });
          }}
        />
      )}
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
  locale,
  messages,
  formatSignupDate,
  isMoving,
  isDeleting,
  onToggle,
  onMove,
  onDelete,
}: {
  signup: SignupWithAnswers;
  index: number;
  expanded: boolean;
  detailId: string;
  status: { label: string; className: string };
  quotas: AdminQuota[];
  questions: AdminQuestion[];
  locale: Locale;
  messages: {
    status: string;
    signupTime: string;
    openAnswers: (name: string) => string;
    closeAnswers: (name: string) => string;
    deleteAria: (name: string) => string;
    answers: string;
    noAnswer: string;
    noQuestions: string;
  };
  formatSignupDate: (date: Date) => string;
  isMoving: boolean;
  isDeleting: boolean;
  onToggle: () => void;
  onMove: (quotaId: string) => void;
  onDelete: () => void;
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
            aria-label={
              expanded
                ? messages.closeAnswers(signup.name)
                : messages.openAnswers(signup.name)
            }
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
                  {localizedValue(quota.translations, locale)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </td>
        <td className="hidden px-3 py-2 text-gray-700 md:table-cell">
          {formatSignupDate(signup.createdAt)}
        </td>
        <td
          className="px-2 py-2 align-middle"
          onClick={(event) => event.stopPropagation()}
        >
          <button
            type="button"
            className="text-danger rounded-control focus-visible:ring-danger flex size-8 cursor-pointer items-center justify-center hover:bg-red-50 focus-visible:ring-2 focus-visible:outline-hidden disabled:cursor-not-allowed disabled:opacity-50"
            aria-label={messages.deleteAria(signup.name)}
            disabled={isDeleting}
            onClick={onDelete}
          >
            <Trash2 className="size-4" aria-hidden="true" />
          </button>
        </td>
      </tr>

      {expanded && (
        <tr id={detailId} className="bg-stone-50">
          <td colSpan={7} className="px-4 py-4 sm:px-6">
            <div className="mb-4 grid gap-3 text-sm sm:grid-cols-2 md:hidden">
              <DetailItem label={messages.status} value={status.label} />
              <DetailItem
                label={messages.signupTime}
                value={formatSignupDate(signup.createdAt)}
              />
            </div>

            <h3 className="text-brand-dark mb-3 text-sm font-semibold">
              {messages.answers}
            </h3>
            {questions.length > 0 ? (
              <dl className="grid gap-x-8 gap-y-4 sm:grid-cols-2">
                {questions.map((question) => {
                  const rawAnswer = signup.Answers.find(
                    (answer) => answer.questionId === question.id,
                  )?.answer;
                  const answer = formatAnswer(question, rawAnswer, locale);

                  return (
                    <DetailItem
                      key={question.id}
                      label={localizedValue(question.translations, locale)}
                      value={answer || messages.noAnswer}
                      muted={!answer}
                    />
                  );
                })}
              </dl>
            ) : (
              <p className="text-sm text-gray-600">{messages.noQuestions}</p>
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
      <dt className="label-caps mb-1 text-gray-600">{label}</dt>
      <dd
        className={`wrap-break-word whitespace-pre-wrap ${muted ? "text-gray-500 italic" : "text-brand-dark"}`}
      >
        {value}
      </dd>
    </div>
  );
}
