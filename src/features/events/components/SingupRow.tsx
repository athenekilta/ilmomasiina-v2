import React, { useState } from "react";
import type { Signup } from "@/generated/prisma";
import { nativeTime } from "@/utils/nativeTime";

const TIMEZONE = 'Europe/Helsinki';

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

  const formattedDate = showMilliseconds ? nativeTime.stringify(signup.createdAt) : nativeTime.stringifyAccurate(signup.createdAt);

  return (
    <td
      className={
        "whitespace inline-block w-52 overflow-hidden py-2 text-ellipsis" +
        " " +
        rowStyle
      }
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {formattedDate}
    </td>
  );
}
