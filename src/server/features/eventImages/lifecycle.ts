import { TRPCError } from "@trpc/server";
import type { Prisma, PrismaClient } from "@/generated/prisma/client";
import { deleteImage, removeUntrackedImages } from "./storage";

export const IMAGE_RETENTION_MS = 24 * 60 * 60 * 1000;

// Save and cleanup lock the same rows. Always lock multiple IDs in sorted order.
async function lockImages(tx: Prisma.TransactionClient, ids: string[]) {
  for (const id of [...new Set(ids)].sort()) {
    await tx.$queryRaw`SELECT id FROM "EventImage" WHERE id = ${id}::uuid FOR UPDATE`;
  }
}

export async function changeEventImage(
  tx: Prisma.TransactionClient,
  input: {
    currentId: string | null;
    imageId?: string | null;
    expectedImageId?: string | null;
    uploaderId: string;
  },
) {
  const { currentId, imageId, expectedImageId, uploaderId } = input;
  if (imageId === undefined) return;
  // A retry after a lost response is already applied, including removal.
  if (imageId === currentId) return;
  if (expectedImageId !== currentId) {
    throw new TRPCError({
      code: "CONFLICT",
      message:
        "Tapahtuman kuva on muuttunut. Lataa tapahtuma uudelleen ennen kuvan vaihtamista.",
    });
  }
  await lockImages(
    tx,
    [currentId, imageId].filter((id): id is string => !!id),
  );
  const now = new Date();
  if (imageId) {
    const image = await tx.eventImage.findUnique({
      where: { id: imageId },
      include: { event: { select: { id: true } } },
    });
    if (
      !image ||
      image.state !== "PENDING" ||
      image.uploaderId !== uploaderId ||
      !image.deleteAfter ||
      image.deleteAfter <= now ||
      image.event
    ) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message:
          "Kuvan lataus on vanhentunut tai kuva ei ole käytettävissä. Valitse kuva uudelleen.",
      });
    }
    await tx.eventImage.update({
      where: { id: imageId },
      data: { state: "ATTACHED", deleteAfter: null },
    });
  }
  if (currentId) {
    await tx.eventImage.update({
      where: { id: currentId },
      data: {
        state: "RETIRED",
        deleteAfter: new Date(now.getTime() + IMAGE_RETENTION_MS),
      },
    });
  }
}

let cleanupRunning = false;
export async function cleanupEventImages(prisma: PrismaClient) {
  if (cleanupRunning) return;
  cleanupRunning = true;
  try {
    const now = new Date();
    const candidates = await prisma.eventImage.findMany({
      where: {
        OR: [
          { state: "DELETING" },
          { state: { in: ["PENDING", "RETIRED"] }, deleteAfter: { lte: now } },
        ],
      },
      select: { id: true },
      take: 100,
      orderBy: { deleteAfter: "asc" },
    });
    for (const { id } of candidates) {
      try {
        const claimed = await prisma.$transaction(async (tx) => {
          await lockImages(tx, [id]);
          const image = await tx.eventImage.findUnique({
            where: { id },
            include: { event: { select: { id: true } } },
          });
          if (!image || image.event || image.state === "ATTACHED") return false;
          if (
            image.state !== "DELETING" &&
            (!image.deleteAfter || image.deleteAfter > now)
          )
            return false;
          await tx.eventImage.update({
            where: { id },
            data: { state: "DELETING" },
          });
          return true;
        });
        if (!claimed) continue;
        await deleteImage(id);
        await prisma.eventImage.delete({ where: { id } });
      } catch (error) {
        console.error("Event image cleanup failed", { imageId: id, error });
      }
    }
    await removeUntrackedImages(
      new Date(now.getTime() - IMAGE_RETENTION_MS),
      async (id) =>
        !!(await prisma.eventImage.findUnique({
          where: { id },
          select: { id: true },
        })),
    );
  } finally {
    cleanupRunning = false;
  }
}
