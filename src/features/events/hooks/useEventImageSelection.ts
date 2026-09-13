import { useCallback, useEffect, useRef, useState } from "react";

import {
  EVENT_IMAGE_ACCEPT,
  EVENT_IMAGE_ID_PATTERN,
  MAX_IMAGE_BYTES,
} from "../utils/eventImage";
export { EVENT_IMAGE_ACCEPT } from "../utils/eventImage";

import { assertCurrentImageSelection } from "../utils/draftSync";

type SelectedEventImage = { file: File; url: string };

/** Files stay outside tRPC JSON; only processed upload IDs enter an event save. */
export function useEventImageSelection(
  existingImageId: string | null = null,
  locked = false,
) {
  const [action, setAction] = useState<"keep" | "replace" | "remove">("keep");
  const expectedImageId = useRef<string | null>(null);
  const uploaded = useRef<{
    file: File;
    imageId: string;
    expiresAt: number;
  } | null>(null);
  const [image, setImage] = useState<SelectedEventImage | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isDecoding, setIsDecoding] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const selectButtonRef = useRef<HTMLButtonElement>(null);
  const requestId = useRef(0);
  const objectUrls = useRef(new Set<string>());

  const setInputRef = useCallback((input: HTMLInputElement | null) => {
    inputRef.current = input;
    // React does not expose the file input's native cancel event as a prop.
    if (input) {
      input.oncancel = () => {
        selectButtonRef.current?.focus({ preventScroll: true });
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

  function openPicker() {
    if (locked) return;
    inputRef.current?.click();
  }

  function restorePickerFocus() {
    selectButtonRef.current?.focus({ preventScroll: true });
  }

  async function selectFile(file: File | undefined) {
    restorePickerFocus();
    if (!file || locked) return;

    const currentRequest = ++requestId.current;
    setError(null);
    setIsDecoding(false);

    if (!EVENT_IMAGE_ACCEPT.split(",").includes(file.type)) {
      setError("Valitse JPEG-, PNG- tai WebP-kuva.");
      return;
    }
    if (file.size > MAX_IMAGE_BYTES) {
      setError("Kuvan enimmäiskoko on 10 MiB.");
      return;
    }

    setIsDecoding(true);
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

      if (action === "keep") expectedImageId.current = existingImageId;
      uploaded.current = null;
      setAction("replace");
      setImage({ file, url });
      accepted = true;
    } catch {
      if (currentRequest === requestId.current) {
        setError("Kuvaa ei voitu avata. Valitse toinen kuvatiedosto.");
      }
    } finally {
      if (!accepted && url && objectUrls.current.delete(url)) {
        URL.revokeObjectURL(url);
      }
      if (currentRequest === requestId.current) setIsDecoding(false);
    }
  }

  function removeImage() {
    if (locked) return;
    if (action === "keep") expectedImageId.current = existingImageId;
    setAction("remove");
    uploaded.current = null;
    requestId.current += 1;
    setImage(null);
    setError(null);
    setIsDecoding(false);
    selectButtonRef.current?.focus({ preventScroll: true });
  }

  async function uploadForSave(): Promise<{
    imageId?: string | null;
    expectedImageId?: string | null;
  }> {
    const selectionId = requestId.current;
    if (isDecoding) throw new Error("Odota kuvan avaamisen valmistumista.");
    if (action === "keep") return {};
    if (action === "remove")
      return { imageId: null, expectedImageId: expectedImageId.current };
    if (!image) throw new Error("Valitse kuvatiedosto.");
    setError(null);
    try {
      if (
        !uploaded.current ||
        uploaded.current.file !== image.file ||
        uploaded.current.expiresAt <= Date.now()
      ) {
        const response = await fetch("/api/event-images", {
          method: "POST",
          credentials: "same-origin",
          body: image.file,
          headers: { "Content-Type": image.file.type },
        });
        const result = (await response.json().catch(() => null)) as {
          imageId?: string;
          error?: string;
        } | null;
        if (
          !response.ok ||
          !result?.imageId ||
          !EVENT_IMAGE_ID_PATTERN.test(result.imageId)
        ) {
          throw new Error(
            result?.error || "Kuvan lataus epäonnistui. Yritä uudelleen.",
          );
        }
        assertCurrentImageSelection(selectionId, requestId.current);
        uploaded.current = {
          file: image.file,
          imageId: result.imageId,
          expiresAt: Date.now() + 23 * 60 * 60 * 1000,
        };
      }
      return {
        imageId: uploaded.current.imageId,
        expectedImageId: expectedImageId.current,
      };
    } catch (error) {
      if (selectionId === requestId.current) {
        setError(
          error instanceof Error ? error.message : "Kuvan lataus epäonnistui.",
        );
      }
      throw error;
    }
  }

  function markSaved() {
    requestId.current++;
    setImage(null);
    setAction("keep");
    setIsDecoding(false);
    expectedImageId.current = null;
    uploaded.current = null;
    setError(null);
  }

  return {
    image,
    isDirty: action !== "keep" || isDecoding,
    hasImage: !!image || (action !== "remove" && !!existingImageId),
    savedImageId: action === "remove" ? null : existingImageId,
    uploadForSave,
    markSaved,
    forgetUpload: () => {
      uploaded.current = null;
    },
    error,
    isDecoding,
    setInputRef,
    selectButtonRef,
    openPicker,
    selectFile,
    removeImage,
  };
}

export type EventImageSelection = ReturnType<typeof useEventImageSelection>;
