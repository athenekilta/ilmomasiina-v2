import React, { useState } from "react";
import type { Signup } from "@prisma/client";

export function SignupRow({ signup }: { signup: Signup }) {
  const [showMilliseconds, setShowMilliseconds] = useState(false);

  const handleMouseEnter = () => {
    setShowMilliseconds(true);
  };

  const handleMouseLeave = () => {
    setShowMilliseconds(false);
  };

  const formattedDate = new Date(signup.createdAt).toLocaleString();
  const milliseconds = signup.createdAt
    .getMilliseconds()
    .toString()
    .padStart(3, "0");
  const dateWithMilliseconds = `${formattedDate}.${milliseconds}`;

  return (
    <td
      className="whitespace inline-block w-52 overflow-hidden text-ellipsis py-4"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {showMilliseconds ? dateWithMilliseconds : formattedDate}
    </td>
  );
}
