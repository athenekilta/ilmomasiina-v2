import type { IncomingMessage } from "node:http";
import { MAX_IMAGE_BYTES } from "@/features/events/utils/eventImage";
import { ImageRequestError } from "./processing";

let activeUploads = 0;
export function reserveUpload() {
  if (activeUploads >= 2)
    throw new ImageRequestError(
      503,
      "Kuvien käsittely on varattu. Yritä hetken kuluttua uudelleen.",
    );
  activeUploads++;
  let released = false;
  return () => {
    if (!released) {
      released = true;
      activeUploads--;
    }
  };
}

export function checkUploadAccess(
  origin: string | undefined,
  applicationUrl: string,
  role?: string,
) {
  if (role !== "admin")
    throw new ImageRequestError(403, "Vain ylläpitäjä voi lisätä kuvia.");
  if (origin !== new URL(applicationUrl).origin)
    throw new ImageRequestError(403, "Virheellinen pyynnön alkuperä.");
}

export function readImageBody(
  req: IncomingMessage,
  timeoutMs = 30_000,
): Promise<Buffer> {
  const length = req.headers["content-length"];
  if (length && (!/^\d+$/.test(length) || Number(length) > MAX_IMAGE_BYTES)) {
    return Promise.reject(
      new ImageRequestError(413, "Kuvan enimmäiskoko on 10 MiB."),
    );
  }
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    let bytes = 0;
    const finish = (error?: Error) => {
      clearTimeout(timer);
      req.off("data", onData);
      req.off("end", onEnd);
      req.off("error", onError);
      req.off("aborted", onAborted);
      if (error) {
        req.pause();
        reject(error);
      } else resolve(Buffer.concat(chunks, bytes));
    };
    const onData = (chunk: Buffer) => {
      bytes += chunk.length;
      if (bytes > MAX_IMAGE_BYTES)
        finish(new ImageRequestError(413, "Kuvan enimmäiskoko on 10 MiB."));
      else chunks.push(chunk);
    };
    const onEnd = () =>
      finish(
        bytes ? undefined : new ImageRequestError(400, "Valitse kuvatiedosto."),
      );
    const onError = (error: Error) => finish(error);
    const onAborted = () =>
      finish(new ImageRequestError(400, "Kuvan lataus keskeytyi."));
    const timer = setTimeout(
      () =>
        finish(new ImageRequestError(408, "Kuvan lataus kesti liian kauan.")),
      timeoutMs,
    );
    req
      .on("data", onData)
      .once("end", onEnd)
      .once("error", onError)
      .once("aborted", onAborted);
  });
}
