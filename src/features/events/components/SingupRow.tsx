import type { Signup } from "@/generated/prisma";
import { formatDateTime, formatSignupTime } from "@/utils/format";
import { useLocale } from "@/i18n/I18nProvider";

export function SignupRow({
  signup,
  rowStyle,
}: {
  signup: Pick<Signup, "createdAt">;
  rowStyle: string;
}) {
  const locale = useLocale();
  // The cell shows the short form so the row fits one line; the full stamp,
  // milliseconds and all, is one hover away for anyone comparing places.
  const exact = `${formatDateTime(
    signup.createdAt,
    { dateStyle: "short", timeStyle: "medium" },
    locale,
  )}.${signup.createdAt.getMilliseconds().toString().padStart(3, "0")}`;

  return (
    <td className={`${rowStyle} truncate tabular-nums`} title={exact}>
      {formatSignupTime(signup.createdAt, locale)}
    </td>
  );
}
