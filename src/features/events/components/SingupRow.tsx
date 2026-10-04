import type { Signup } from "@/generated/prisma";
import { formatDateTime } from "@/utils/format";
import { useLocale } from "@/i18n/I18nProvider";

export function SignupRow({
  signup,
  rowStyle,
}: {
  signup: Pick<Signup, "createdAt">;
  rowStyle: string;
}) {
  const locale = useLocale();
  const formattedDate = formatDateTime(
    signup.createdAt,
    {
      dateStyle: "short",
      timeStyle: "medium",
    },
    locale,
  );
  return <td className={rowStyle}>{formattedDate}</td>;
}
