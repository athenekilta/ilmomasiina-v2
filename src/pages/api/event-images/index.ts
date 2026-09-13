import { randomUUID } from "node:crypto";
import type { NextApiRequest, NextApiResponse } from "next";
import { createContext } from "@/server/trpc/context";
import { env } from "@/env/server.mjs";
import {
  ImageRequestError,
  processImage,
} from "@/server/features/eventImages/processing";
import {
  checkUploadAccess,
  readImageBody,
  reserveUpload,
} from "@/server/features/eventImages/request";
import { deleteImage, writeImage } from "@/server/features/eventImages/storage";
import { IMAGE_RETENTION_MS } from "@/server/features/eventImages/lifecycle";

export const config = { api: { bodyParser: false } };

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  res.setHeader("Cache-Control", "no-store");
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).end();
  }
  let release: (() => void) | undefined;
  let writtenId: string | undefined;
  try {
    const ctx = await createContext({ req, res });
    if (!ctx.managementSession || !ctx.managementUser)
      throw new ImageRequestError(401, "Kirjaudu sisään lisätäksesi kuvan.");
    checkUploadAccess(req.headers.origin, env.NEXTAUTH_URL, ctx.managementUser.role);
    release = reserveUpload();
    const variants = await processImage(await readImageBody(req));
    if (req.aborted || res.destroyed) return;
    const imageId = randomUUID();
    await writeImage(imageId, variants);
    writtenId = imageId;
    await ctx.prisma.eventImage.create({
      data: {
        id: imageId,
        uploaderId: ctx.managementUser.id,
        deleteAfter: new Date(Date.now() + IMAGE_RETENTION_MS),
      },
    });
    writtenId = undefined; // A lost response leaves a pending asset for cleanup.
    return res.status(201).json({ imageId });
  } catch (error) {
    if (writtenId) {
      await deleteImage(writtenId).catch((cleanupError: unknown) =>
        console.error("Failed upload cleanup", {
          imageId: writtenId,
          error: cleanupError,
        }),
      );
    }
    const status = error instanceof ImageRequestError ? error.status : 500;
    console.error("Event image upload failed", {
      status,
      code: (error as NodeJS.ErrnoException).code,
    });
    if (status === 503) res.setHeader("Retry-After", "5");
    // Do not leave an unread oversized/slow body on a keep-alive connection.
    res.setHeader("Connection", "close");
    return res.status(status).json({
      error:
        error instanceof ImageRequestError
          ? error.message
          : "Kuvan tallennus epäonnistui. Yritä uudelleen.",
    });
  } finally {
    release?.();
  }
}
