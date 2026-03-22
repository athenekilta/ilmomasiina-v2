import React, { useState } from "react";
import type { Signup } from "@/generated/prisma";
import { formatDateTime } from "@/utils/format";

export function SignupRow({
  signup,
  rowStyle,
}: {
  signup: Signup;
  rowStyle: string;
}) {
  const [showMilliseconds, setShowMilliseconds] = useState(false);

  const handleMouseEnter = () => {
    setShowMilliseconds(true);
  };

  const handleMouseLeave = () => {
    setShowMilliseconds(false);
  };

  const formattedDate = formatDateTime(signup.createdAt, {
    dateStyle: "short",
    timeStyle: "medium",
  });
  const milliseconds = signup.createdAt
    .getMilliseconds()
    .toString()
    .padStart(3, "0");
  const dateWithMilliseconds = `${formattedDate}.${milliseconds}`;

  return (
    <td
      className={rowStyle}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {formattedDate}
    </td>
  );
}
