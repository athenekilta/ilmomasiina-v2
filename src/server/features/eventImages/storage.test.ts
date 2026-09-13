import assert from "node:assert/strict";
import test from "node:test";
import { randomUUID } from "node:crypto";
import { mkdtemp, rm, mkdir, readdir, utimes } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import {
  deleteImage,
  openImage,
  removeUntrackedImages,
  writeImage,
} from "./storage";

test("storage publishes variants, validates paths, and cleans only old untracked assets", async () => {
  const root = await mkdtemp(path.join(os.tmpdir(), "event-image-storage-"));
  process.env.EVENT_IMAGE_STORAGE_DIR = root;
  try {
    const id = randomUUID();
    await writeImage(id, {
      card: Buffer.from("card"),
      banner: Buffer.from("banner"),
    });
    assert.deepEqual(await readdir(root), [id]);
    const { file, size } = await openImage(id, "card");
    assert.equal(size, 4);
    assert.equal((await file.readFile()).toString(), "card");
    await file.close();
    await assert.rejects(openImage("../secret", "card"), /Invalid image ID/);
    await assert.rejects(deleteImage("../secret"), /Invalid image ID/);
    const staleId = randomUUID();
    const temporary = `.tmp-${randomUUID()}`;
    const old = new Date(Date.now() - 48 * 60 * 60 * 1000);
    await mkdir(path.join(root, staleId));
    await mkdir(path.join(root, temporary));
    for (const name of [id, staleId, temporary])
      await utimes(path.join(root, name), old, old);
    const recent = randomUUID();
    await mkdir(path.join(root, recent));
    await removeUntrackedImages(
      new Date(Date.now() - 24 * 60 * 60 * 1000),
      async (candidate) => candidate === id,
    );
    assert.deepEqual((await readdir(root)).sort(), [id, recent].sort());
    await deleteImage(id);
    await deleteImage(id);
    await assert.rejects(openImage(id, "card"), { code: "ENOENT" });
  } finally {
    delete process.env.EVENT_IMAGE_STORAGE_DIR;
    await rm(root, { recursive: true, force: true });
  }
});
