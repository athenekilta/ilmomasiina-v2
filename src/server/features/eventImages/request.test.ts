import assert from "node:assert/strict";
import test from "node:test";
import { PassThrough } from "node:stream";
import type { IncomingMessage } from "node:http";
import { checkUploadAccess, readImageBody, reserveUpload } from "./request";
import { ImageRequestError } from "./processing";
import { MAX_IMAGE_BYTES } from "@/features/events/utils/eventImage";

function request(headers = {}) {
  return Object.assign(new PassThrough(), {
    headers,
  }) as unknown as IncomingMessage & PassThrough;
}

test("requires a current admin role and exact configured origin", () => {
  assert.doesNotThrow(() =>
    checkUploadAccess(
      "https://events.example",
      "https://events.example/path",
      "admin",
    ),
  );
  for (const role of [undefined, "user"])
    assert.throws(
      () =>
        checkUploadAccess(
          "https://events.example",
          "https://events.example",
          role,
        ),
      ImageRequestError,
    );
  for (const origin of [
    undefined,
    "null",
    "https://evil.example",
    "http://events.example",
  ])
    assert.throws(
      () => checkUploadAccess(origin, "https://events.example", "admin"),
      ImageRequestError,
    );
});

test("limits concurrent uploads and releases reservations once", () => {
  const first = reserveUpload();
  const second = reserveUpload();
  assert.throws(
    reserveUpload,
    (error: unknown) =>
      error instanceof ImageRequestError && error.status === 503,
  );
  first();
  first();
  second();
  const third = reserveUpload();
  third();
});

test("reads chunked bodies and enforces the limit without Content-Length", async () => {
  const req = request();
  const body = readImageBody(req);
  req.write(Buffer.from("abc"));
  req.end(Buffer.from("def"));
  assert.equal((await body).toString(), "abcdef");
  const oversized = request();
  const failed = assert.rejects(
    readImageBody(oversized),
    (error: unknown) =>
      error instanceof ImageRequestError && error.status === 413,
  );
  oversized.write(Buffer.alloc(MAX_IMAGE_BYTES));
  oversized.write(Buffer.alloc(1));
  await failed;
  oversized.destroy();
});

test("rejects empty, declared oversized, slow and aborted bodies", async () => {
  await assert.rejects(
    readImageBody(request({ "content-length": String(MAX_IMAGE_BYTES + 1) })),
    ImageRequestError,
  );
  const empty = request();
  const emptyResult = assert.rejects(readImageBody(empty), ImageRequestError);
  empty.end();
  await emptyResult;
  const slow = request();
  await assert.rejects(
    readImageBody(slow, 10),
    (error: unknown) =>
      error instanceof ImageRequestError && error.status === 408,
  );
  slow.destroy();
  const aborted = request();
  const abortedResult = assert.rejects(
    readImageBody(aborted),
    ImageRequestError,
  );
  aborted.emit("aborted");
  await abortedResult;
  aborted.destroy();
});
