import assert from "node:assert/strict";
import test from "node:test";
import { randomUUID } from "node:crypto";
import { mkdtemp, rm, mkdir, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { PrismaClient } from "@/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import type { Context } from "@/server/trpc/context";
import {
  changeEventImage,
  cleanupEventImages,
  IMAGE_RETENTION_MS,
} from "./lifecycle";
import { openImage, writeImage } from "./storage";

// Deliberately opt-in: never run destructive integration fixtures on DATABASE_URL.
test(
  "event image transactions and cleanup against isolated PostgreSQL",
  { skip: !process.env.IMAGE_TEST_DATABASE_URL },
  async (t) => {
    const url = process.env.IMAGE_TEST_DATABASE_URL!;
    process.env.DATABASE_URL = url;
    process.env.NEXTAUTH_URL = "http://localhost:3000";
    process.env.MAIL_API_KEY = Buffer.alloc(32).toString("base64");
    Object.assign(process.env, { NODE_ENV: "test" });
    const root = await mkdtemp(
      path.join(os.tmpdir(), "event-image-lifecycle-"),
    );
    process.env.EVENT_IMAGE_STORAGE_DIR = root;
    const prisma = new PrismaClient({
      adapter: new PrismaPg({ connectionString: url }),
    });
    const { eventsRouter } = await import("@/server/router/events");
    const user = await prisma.user.create({
      data: { id: randomUUID(), role: "admin" },
    });
    const other = await prisma.user.create({
      data: { id: randomUUID(), role: "admin" },
    });
    const caller = eventsRouter.createCaller({
      prisma,
      user,
      session: { user: { id: user.id } },
    } as Context);
    const pending = async (uploaderId = user.id, expired = false) => {
      const id = randomUUID();
      await writeImage(id, {
        card: Buffer.from("card"),
        banner: Buffer.from("banner"),
      });
      return prisma.eventImage.create({
        data: {
          id,
          uploaderId,
          deleteAfter: new Date(
            Date.now() + (expired ? -1 : IMAGE_RETENTION_MS),
          ),
        },
      });
    };
    const eventInput = () => ({
      creationRequestId: randomUUID(),
      title: "Image transaction test",
      date: new Date("2099-01-03"),
      registrationStartDate: new Date("2099-01-01"),
      registrationEndDate: new Date("2099-01-02"),
      draft: true,
      signupsPublic: false,
      extraCapacity: 0,
      quotas: [],
      questions: [],
    });
    const eventIds: number[] = [];
    try {
      await t.test(
        "create retries are idempotent and attachment commits with the event",
        async () => {
          const image = await pending();
          const input = { ...eventInput(), imageId: image.id };
          const [first, retry] = await Promise.all([
            caller.createEvent(input),
            caller.createEvent(input),
          ]);
          eventIds.push(first.id);
          assert.equal(first.id, retry.id);
          assert.equal(first.imageId, image.id);
          assert.equal(
            (
              await prisma.eventImage.findUniqueOrThrow({
                where: { id: image.id },
              })
            ).state,
            "ATTACHED",
          );
          assert.equal(
            await prisma.event.count({
              where: { creationRequestId: input.creationRequestId },
            }),
            1,
          );
        },
      );
      await t.test(
        "failed creation rolls back event, quota writes, and attachment",
        async () => {
          const image = await pending();
          const quota = {
            id: randomUUID(),
            title: "Duplicate quota",
            size: 1,
            sortId: 1,
            eventId: 0,
            sharedPlacesAllocation: "NEVER" as const,
          };
          const input = {
            ...eventInput(),
            imageId: image.id,
            quotas: [quota, quota],
          };
          await assert.rejects(caller.createEvent(input));
          assert.equal(
            await prisma.event.count({
              where: { creationRequestId: input.creationRequestId },
            }),
            0,
          );
          assert.equal(
            await prisma.quota.count({ where: { id: quota.id } }),
            0,
          );
          assert.equal(
            (
              await prisma.eventImage.findUniqueOrThrow({
                where: { id: image.id },
              })
            ).state,
            "PENDING",
          );
        },
      );
      await t.test("rejects expired and foreign uploads", async () => {
        for (const image of [
          await pending(user.id, true),
          await pending(other.id),
        ]) {
          await assert.rejects(
            caller.createEvent({ ...eventInput(), imageId: image.id }),
            /vanhentunut/,
          );
        }
      });
      await t.test(
        "keep, replace, conflict, retry, removal, and retired cleanup",
        async () => {
          const image = await pending();
          const replacement = await pending();
          const competing = await pending();
          const input = eventInput();
          const event = await caller.createEvent({
            ...input,
            imageId: image.id,
          });
          eventIds.push(event.id);
          const kept = await caller.updateEvent({ ...input, id: event.id });
          assert.equal(kept.imageId, image.id);
          const changed = await caller.updateEvent({
            ...input,
            id: event.id,
            imageId: replacement.id,
            expectedImageId: image.id,
          });
          assert.equal(changed.imageId, replacement.id);
          await assert.rejects(
            caller.updateEvent({
              ...input,
              id: event.id,
              title: "must not save",
              imageId: competing.id,
              expectedImageId: image.id,
            }),
            /muuttunut/,
          );
          assert.equal(
            (await prisma.event.findUniqueOrThrow({ where: { id: event.id } }))
              .title,
            input.title,
          );
          await caller.updateEvent({
            ...input,
            id: event.id,
            imageId: replacement.id,
            expectedImageId: image.id,
          });
          assert.equal(
            (
              await prisma.eventImage.findUniqueOrThrow({
                where: { id: image.id },
              })
            ).state,
            "RETIRED",
          );
          await cleanupEventImages(prisma);
          const opened = await openImage(image.id, "card");
          await opened.file.close();
          await caller.updateEvent({
            ...input,
            id: event.id,
            imageId: null,
            expectedImageId: replacement.id,
          });
          await caller.updateEvent({
            ...input,
            id: event.id,
            imageId: null,
            expectedImageId: replacement.id,
          });
          assert.equal(
            (await prisma.event.findUniqueOrThrow({ where: { id: event.id } }))
              .imageId,
            null,
          );
          await prisma.eventImage.updateMany({
            where: { id: { in: [image.id, replacement.id] } },
            data: { deleteAfter: new Date(0) },
          });
          await cleanupEventImages(prisma);
          assert.equal(
            await prisma.eventImage.count({
              where: { id: { in: [image.id, replacement.id] } },
            }),
            0,
          );
          await assert.rejects(openImage(image.id, "card"), { code: "ENOENT" });
        },
      );
      await t.test(
        "attachment holding the row lock wins safely over cleanup",
        async () => {
          const image = await pending(user.id, true);
          const event = await caller.createEvent(eventInput());
          eventIds.push(event.id);
          // Cleanup can discover a formerly-expired candidate, but must recheck
          // its state after waiting for the attaching transaction's row lock.
          let unlock!: () => void;
          let notify!: () => void;
          const held = new Promise<void>((resolve) => {
            notify = resolve;
          });
          const release = new Promise<void>((resolve) => {
            unlock = resolve;
          });
          let cleanupRead!: () => void;
          const candidatesRead = new Promise<void>((resolve) => {
            cleanupRead = resolve;
          });
          const cleanupClient = prisma.$extends({
            query: {
              eventImage: {
                async findMany({ args, query }) {
                  const result = await query(args);
                  cleanupRead();
                  return result;
                },
              },
            },
          });
          const save = prisma.$transaction(async (tx) => {
            await tx.$queryRaw`SELECT id FROM "EventImage" WHERE id = ${image.id}::uuid FOR UPDATE`;
            await tx.eventImage.update({
              where: { id: image.id },
              data: { deleteAfter: new Date(Date.now() + IMAGE_RETENTION_MS) },
            });
            await changeEventImage(tx, {
              currentId: null,
              imageId: image.id,
              expectedImageId: null,
              uploaderId: user.id,
            });
            await tx.event.update({
              where: { id: event.id },
              data: { imageId: image.id },
            });
            notify();
            await release;
          });
          await held;
          const cleanup = cleanupEventImages(
            cleanupClient as unknown as PrismaClient,
          );
          await candidatesRead;
          unlock();
          await Promise.all([save, cleanup]);
          assert.equal(
            (
              await prisma.eventImage.findUniqueOrThrow({
                where: { id: image.id },
              })
            ).state,
            "ATTACHED",
          );
          const opened = await openImage(image.id, "banner");
          await opened.file.close();
          await prisma.event.update({
            where: { id: event.id },
            data: { deletedAt: new Date() },
          });
          await cleanupEventImages(prisma);
          assert.ok(
            await prisma.eventImage.findUnique({ where: { id: image.id } }),
          );
        },
      );
      await t.test(
        "deletion failure stays retryable and referenced images are protected",
        async () => {
          const image = await pending(user.id, true);
          const actual = process.env.EVENT_IMAGE_STORAGE_DIR!;
          const broken = path.join(root, "not-a-directory");
          await writeFile(broken, "blocked");
          process.env.EVENT_IMAGE_STORAGE_DIR = broken;
          await assert.rejects(cleanupEventImages(prisma));
          process.env.EVENT_IMAGE_STORAGE_DIR = actual;
          assert.equal(
            (
              await prisma.eventImage.findUniqueOrThrow({
                where: { id: image.id },
              })
            ).state,
            "DELETING",
          );
          await cleanupEventImages(prisma);
          assert.equal(
            await prisma.eventImage.findUnique({ where: { id: image.id } }),
            null,
          );
          await mkdir(path.join(root, ".unrelated"));
        },
      );
    } finally {
      await prisma.event.deleteMany({ where: { id: { in: eventIds } } });
      await prisma.eventImage.deleteMany({
        where: { uploaderId: { in: [user.id, other.id] } },
      });
      await prisma.user.deleteMany({
        where: { id: { in: [user.id, other.id] } },
      });
      await prisma.$disconnect();
      const { prisma: globalPrisma } = await import("@/server/external/prisma");
      await globalPrisma.$disconnect();
      delete process.env.EVENT_IMAGE_STORAGE_DIR;
      await rm(root, { recursive: true, force: true });
    }
  },
);
