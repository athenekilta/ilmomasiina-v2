import type { NextApiRequest, NextApiResponse } from "next";
import { pipeline } from "node:stream/promises";
import { EVENT_IMAGE_ID_PATTERN } from "@/features/events/utils/eventImage";
import { openImage } from "@/server/features/eventImages/storage";

export const config = { api: { responseLimit: false } };

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "GET" && req.method !== "HEAD") {
    res.setHeader("Allow", "GET, HEAD");
    return res.status(405).end();
  }
  const { id, variant } = req.query;
  if (
    typeof id !== "string" ||
    !EVENT_IMAGE_ID_PATTERN.test(id) ||
    (variant !== "card" && variant !== "banner")
  ) {
    res.setHeader("Cache-Control", "no-store");
    return res.status(404).end();
  }
  try {
    const { file, size } = await openImage(id, variant);
    try {
      res.setHeader("Content-Type", "image/webp");
      res.setHeader("X-Content-Type-Options", "nosniff");
      res.setHeader("Cache-Control", "public, max-age=31536000, immutable");
      res.setHeader("Content-Length", size);
      if (req.method === "HEAD") return res.status(200).end();
      await pipeline(file.createReadStream({ autoClose: false }), res);
    } finally {
      await file.close();
    }
  } catch (error) {
    const missing = (error as NodeJS.ErrnoException).code === "ENOENT";
    if (!missing)
      console.error("Event image read failed", {
        imageId: id,
        code: (error as NodeJS.ErrnoException).code,
      });
    if (!res.headersSent) {
      res.removeHeader("Content-Length");
      res.setHeader("Cache-Control", "no-store");
      res.status(missing ? 404 : 500).end();
    }
  }
}
