import sharp from "sharp";
import {
  EVENT_IMAGE_VARIANTS,
  MAX_IMAGE_BYTES,
  type EventImageVariant,
} from "@/features/events/utils/eventImage";

export class ImageRequestError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message);
  }
}

function signatureFormat(input: Buffer) {
  if (input.subarray(0, 3).equals(Buffer.from([0xff, 0xd8, 0xff])))
    return "jpeg";
  if (
    input.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]))
  )
    return "png";
  if (
    input.toString("ascii", 0, 4) === "RIFF" &&
    input.toString("ascii", 8, 12) === "WEBP"
  )
    return "webp";
  return null;
}

// libvips may load only the first frame of APNG; inspect PNG chunks as well.
function isAnimatedPng(input: Buffer) {
  for (let offset = 8; offset + 12 <= input.length; ) {
    const length = input.readUInt32BE(offset);
    if (input.toString("ascii", offset + 4, offset + 8) === "acTL") return true;
    offset += length + 12;
  }
  return false;
}

export async function processImage(
  input: Buffer,
): Promise<Record<EventImageVariant, Buffer>> {
  if (input.length > MAX_IMAGE_BYTES)
    throw new ImageRequestError(413, "Kuvan enimmäiskoko on 10 MiB.");
  const format = signatureFormat(input);
  if (!format)
    throw new ImageRequestError(415, "Valitse JPEG-, PNG- tai WebP-kuva.");
  try {
    const options = {
      limitInputPixels: 25_000_000,
      failOn: "warning" as const,
    };
    const metadata = await sharp(input, options).metadata();
    if (metadata.format !== format || !metadata.width || !metadata.height)
      throw new Error("Invalid format");
    if (
      (metadata.pages ?? 1) > 1 ||
      (format === "png" && isAnimatedPng(input))
    ) {
      throw new ImageRequestError(422, "Animoituja kuvia ei tueta.");
    }
    const rotated = [5, 6, 7, 8].includes(metadata.orientation ?? 1);
    const width = rotated ? metadata.height : metadata.width;
    const height = rotated ? metadata.width : metadata.height;
    // Integer multiples give an exact 5:2 crop, including small source images.
    const unit = Math.floor(Math.min(width / 5, height / 2));
    if (unit < 1) throw new ImageRequestError(422, "Kuva on liian pieni.");
    const cropWidth = unit * 5;
    const cropHeight = unit * 2;
    const variants = {} as Record<EventImageVariant, Buffer>;
    for (const variant of Object.keys(
      EVENT_IMAGE_VARIANTS,
    ) as EventImageVariant[]) {
      variants[variant] = await sharp(input, options)
        .autoOrient()
        .extract({
          left: Math.floor((width - cropWidth) / 2),
          top: Math.floor((height - cropHeight) / 2),
          width: cropWidth,
          height: cropHeight,
        })
        .resize({
          width: Math.min(cropWidth, EVENT_IMAGE_VARIANTS[variant]),
          withoutEnlargement: true,
        })
        .webp({ quality: 82 })
        .timeout({ seconds: 10 })
        .toBuffer();
    }
    return variants;
  } catch (error) {
    if (error instanceof ImageRequestError) throw error;
    throw new ImageRequestError(
      422,
      "Kuvaa ei voitu käsitellä. Valitse ehjä kuva, jossa on enintään 25 megapikseliä.",
    );
  }
}
