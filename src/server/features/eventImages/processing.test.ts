import assert from "node:assert/strict";
import test from "node:test";
import sharp from "sharp";
import { processImage, ImageRequestError } from "./processing";
import { MAX_IMAGE_BYTES } from "@/features/events/utils/eventImage";

test("JPEG, PNG and WebP produce bounded 5:2 WebP variants without metadata", async () => {
  for (const format of ["jpeg", "png", "webp"] as const) {
    const input = await sharp({
      create: { width: 2000, height: 1200, channels: 3, background: "red" },
    })
      .withExif({ IFD0: { Artist: "private metadata" } })
      .toFormat(format)
      .toBuffer();
    const output = await processImage(input);
    for (const [variant, width] of [
      ["card", 800],
      ["banner", 1600],
    ] as const) {
      const metadata = await sharp(output[variant]).metadata();
      assert.equal(metadata.format, "webp");
      assert.equal(metadata.width, width);
      assert.equal(metadata.height, (width * 2) / 5);
      assert.equal(metadata.exif, undefined);
      assert.equal(metadata.icc, undefined);
    }
  }
});

test("small portraits are center cropped without enlargement and retain transparency", async () => {
  const input = await sharp({
    create: {
      width: 50,
      height: 100,
      channels: 4,
      background: { r: 255, g: 0, b: 0, alpha: 0.5 },
    },
  })
    .png()
    .toBuffer();
  const { banner } = await processImage(input);
  const metadata = await sharp(banner).metadata();
  assert.equal(metadata.width, 50);
  assert.equal(metadata.height, 20);
  assert.equal(metadata.hasAlpha, true);
});

test("EXIF rotation happens before cropping", async () => {
  const input = await sharp({
    create: { width: 400, height: 1000, channels: 3, background: "blue" },
  })
    .withMetadata({ orientation: 6 })
    .jpeg()
    .toBuffer();
  const metadata = await sharp((await processImage(input)).banner).metadata();
  assert.equal(metadata.width, 1000);
  assert.equal(metadata.height, 400);
  assert.equal(metadata.orientation, undefined);
});

test("center crop keeps the center of the source", async () => {
  const input = await sharp({
    create: { width: 100, height: 100, channels: 3, background: "red" },
  })
    .composite([
      {
        input: await sharp({
          create: { width: 100, height: 40, channels: 3, background: "blue" },
        })
          .png()
          .toBuffer(),
        top: 30,
        left: 0,
      },
    ])
    .png()
    .toBuffer();
  const stats = await sharp((await processImage(input)).banner).stats();
  assert.ok(stats.channels[2]!.mean > 240);
  assert.ok(stats.channels[0]!.mean < 10);
});

test("rejects empty, spoofed, corrupt, oversized and excessive-pixel input", async () => {
  const rejects = async (input: Buffer, status: number) =>
    assert.rejects(
      processImage(input),
      (error: unknown) =>
        error instanceof ImageRequestError && error.status === status,
    );
  await rejects(Buffer.alloc(0), 415);
  await rejects(Buffer.from('<svg xmlns="http://www.w3.org/2000/svg"/>'), 415);
  await rejects(Buffer.from([0xff, 0xd8, 0xff, 0]), 422);
  await rejects(Buffer.alloc(MAX_IMAGE_BYTES + 1), 413);
  const huge = await sharp({
    create: { width: 5001, height: 5000, channels: 3, background: "white" },
  })
    .png()
    .toBuffer();
  await rejects(huge, 422);
});

test("rejects animated WebP and PNG animation chunks", async () => {
  const animated = await sharp(
    Buffer.concat([
      Buffer.alloc(10 * 10 * 3, 0),
      Buffer.alloc(10 * 10 * 3, 255),
    ]),
    { raw: { width: 10, height: 20, channels: 3, pageHeight: 10 } },
  )
    .webp({ loop: 0, delay: [100, 100] })
    .toBuffer();
  await assert.rejects(processImage(animated), /Animoituja/);
  const png = await sharp({
    create: { width: 10, height: 10, channels: 3, background: "red" },
  })
    .png()
    .toBuffer();
  // Inject an acTL before IEND; the explicit animation guard must reject this
  // even on libvips builds that only decode the first APNG frame.
  const chunk = Buffer.alloc(20);
  chunk.writeUInt32BE(8);
  chunk.write("acTL", 4);
  chunk.writeUInt32BE(2, 8);
  const apng = Buffer.concat([png.subarray(0, -12), chunk, png.subarray(-12)]);
  await assert.rejects(processImage(apng), ImageRequestError);
});
