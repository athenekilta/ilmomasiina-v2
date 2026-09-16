import type { Signup } from "@/generated/prisma";
import { formatDateTime, formatSignupTime } from "@/utils/format";

export function SignupRow({
  signup,
  rowStyle,
}: {
  signup: Pick<Signup, "createdAt">;
  rowStyle: string;
}) {
  // The cell shows the short form so the row fits one line; the full stamp,
  // milliseconds and all, is one hover away for anyone comparing places.
  const exact = `${formatDateTime(signup.createdAt, {
    dateStyle: "short",
    timeStyle: "medium",
  })}.${signup.createdAt.getMilliseconds().toString().padStart(3, "0")}`;

  return (
    <td className={`${rowStyle} truncate tabular-nums`} title={exact}>
      {formatSignupTime(signup.createdAt)}
    </td>
  );
}
