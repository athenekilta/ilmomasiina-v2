import { useCallback, useEffect, useRef, useState } from "react";

export const EVENT_IMAGE_ACCEPT = "image/jpeg,image/png,image/webp";
const MAX_IMAGE_BYTES = 10 * 1024 * 1024;

type ImageControlLocation = "field" | "banner";
type SelectedEventImage = { file: File; url: string };

/** Local preview state only; files must not enter the event's JSON payload. */
export function useEventImageSelection() {
  const [image, setImage] = useState<SelectedEventImage | null>(null);
  const [error, setError] = useState<{
    location: ImageControlLocation;
    message: string;
  } | null>(null);
  const [decodingAt, setDecodingAt] = useState<ImageControlLocation | null>(
    null,
  );
  const inputRef = useRef<HTMLInputElement>(null);
  const fieldButtonRef = useRef<HTMLButtonElement>(null);
  const pickerOrigin = useRef<{
    location: ImageControlLocation;
    button: HTMLButtonElement;
  } | null>(null);
  const requestId = useRef(0);
  const objectUrls = useRef(new Set<string>());

  const setInputRef = useCallback((input: HTMLInputElement | null) => {
    inputRef.current = input;
    // React does not expose the file input's native cancel event as a prop.
    if (input) {
      input.oncancel = () => {
        pickerOrigin.current?.button.focus({ preventScroll: true });
      };
    }
  }, []);

  useEffect(() => {
    const urls = objectUrls.current;
    return () => {
      requestId.current += 1;
      urls.forEach((url) => URL.revokeObjectURL(url));
      urls.clear();
    };
  }, []);

  // Release the previous preview after React has replaced its image element.
  useEffect(() => {
    const urls = objectUrls.current;
    const url = image?.url;
    return () => {
      if (url && urls.delete(url)) URL.revokeObjectURL(url);
    };
  }, [image]);

  function openPicker(
    location: ImageControlLocation,
    button: HTMLButtonElement,
  ) {
    pickerOrigin.current = { location, button };
    inputRef.current?.click();
  }

  function restorePickerFocus() {
    pickerOrigin.current?.button.focus({ preventScroll: true });
  }

  async function selectFile(file: File | undefined) {
    restorePickerFocus();
    if (!file) return;

    const currentRequest = ++requestId.current;
    const location = pickerOrigin.current?.location ?? "field";
    setError(null);
    setDecodingAt(null);

    if (!EVENT_IMAGE_ACCEPT.split(",").includes(file.type)) {
      setError({ location, message: "Valitse JPEG-, PNG- tai WebP-kuva." });
      return;
    }
    if (file.size > MAX_IMAGE_BYTES) {
      setError({ location, message: "Kuvan enimmäiskoko on 10 MiB." });
      return;
    }

    setDecodingAt(location);
    let url: string | undefined;
    let accepted = false;
    try {
      url = URL.createObjectURL(file);
      objectUrls.current.add(url);
      const preview = new Image();
      preview.src = url;
      await preview.decode();
      if (!preview.naturalWidth || !preview.naturalHeight) {
        throw new Error("Empty image");
      }
      if (currentRequest !== requestId.current) return;

      setImage({ file, url });
      accepted = true;
    } catch {
      if (currentRequest === requestId.current) {
        setError({
          location,
          message: "Kuvaa ei voitu avata. Valitse toinen kuvatiedosto.",
        });
      }
    } finally {
      if (!accepted && url && objectUrls.current.delete(url)) {
        URL.revokeObjectURL(url);
      }
      if (currentRequest === requestId.current) setDecodingAt(null);
    }
  }

  function removeImage() {
    requestId.current += 1;
    setImage(null);
    setError(null);
    setDecodingAt(null);
    fieldButtonRef.current?.focus({ preventScroll: true });
  }

  return {
    image,
    error,
    decodingAt,
    setInputRef,
    fieldButtonRef,
    openPicker,
    selectFile,
    removeImage,
  };
}

export type EventImageSelection = ReturnType<typeof useEventImageSelection>;
