import type { NextApiRequest, NextApiResponse } from "next";
import { createUserSessionContext } from "@/server/features/userSession/request";
import { redeemToken } from "@/server/features/userSession/service";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  res.setHeader("Cache-Control", "no-store");
  res.setHeader("Referrer-Policy", "no-referrer");
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const token =
      typeof req.body === "object" && req.body !== null
        ? (req.body as { token?: unknown }).token
        : undefined;
    if (typeof token !== "string") throw new Error("Invalid token");
    const result = await redeemToken(createUserSessionContext(req, res), token);
    return res.status(200).json(result);
  } catch {
    return res.status(401).json({ error: "Linkki ei ole voimassa." });
  }
}
