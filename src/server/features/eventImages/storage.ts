import {
  mkdir,
  open,
  readdir,
  rename,
  rm,
  stat,
  writeFile,
} from "node:fs/promises";
import path from "node:path";
import {
  EVENT_IMAGE_ID_PATTERN,
  type EventImageVariant,
} from "@/features/events/utils/eventImage";

export function imageStorageRoot() {
  return path.resolve(
    process.env.EVENT_IMAGE_STORAGE_DIR || "data/event-images",
  );
}

function assetPath(id: string) {
  if (!EVENT_IMAGE_ID_PATTERN.test(id)) throw new Error("Invalid image ID");
  return path.join(imageStorageRoot(), id);
}

// A rename within the volume exposes both complete variants at once.
export async function writeImage(
  id: string,
  variants: Record<EventImageVariant, Buffer>,
) {
  const destination = assetPath(id);
  const temporary = path.join(imageStorageRoot(), `.tmp-${id}`);
  await mkdir(imageStorageRoot(), { recursive: true });
  await mkdir(temporary);
  try {
    for (const [variant, bytes] of Object.entries(variants)) {
      await writeFile(path.join(temporary, `${variant}.webp`), bytes, {
        flag: "wx",
      });
    }
    await rename(temporary, destination);
  } finally {
    await rm(temporary, { recursive: true, force: true });
  }
}

export async function openImage(id: string, variant: EventImageVariant) {
  if (variant !== "card" && variant !== "banner")
    throw new Error("Invalid image variant");
  const file = await open(path.join(assetPath(id), `${variant}.webp`), "r");
  try {
    return { file, size: (await file.stat()).size };
  } catch (error) {
    await file.close();
    throw error;
  }
}

export async function deleteImage(id: string) {
  await rm(assetPath(id), { recursive: true, force: true });
}

export async function removeUntrackedImages(
  cutoff: Date,
  isTracked: (id: string) => Promise<boolean>,
) {
  await mkdir(imageStorageRoot(), { recursive: true });
  for (const entry of await readdir(imageStorageRoot(), {
    withFileTypes: true,
  })) {
    if (!entry.isDirectory()) continue;
    const temporary = entry.name.startsWith(".tmp-");
    const id = temporary ? entry.name.slice(5) : entry.name;
    if (!EVENT_IMAGE_ID_PATTERN.test(id)) continue;
    const directory = path.join(imageStorageRoot(), entry.name);
    try {
      if ((await stat(directory)).mtime >= cutoff) continue;
      if (!temporary && (await isTracked(id))) continue;
      await rm(directory, { recursive: true, force: true });
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code !== "ENOENT") throw error;
    }
  }
}
