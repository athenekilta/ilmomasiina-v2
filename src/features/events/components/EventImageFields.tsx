import { useId, useRef, useState } from "react";
import { ImagePlus, Info, Trash2 } from "lucide-react";
import { Button } from "@/components/Button";
import { ConfirmationDialog } from "@/components/ConfirmationDialog";
import { BADGE_TONE_CLASS } from "@/features/eventCard/badgeTone";
import { getEventImage } from "@/features/eventCard/eventCardImage";
import type { BadgeTone } from "@/generated/prisma/client";
import {
  EVENT_IMAGE_ACCEPT,
  type EventImageSelection,
} from "../hooks/useEventImageSelection";

function ImageControls({
  selection,
  disabled,
}: {
  selection: EventImageSelection;
  disabled: boolean;
}) {
  const id = useId();
  const [removalTarget, setRemovalTarget] = useState<string>();
  const currentTarget = `${selection.savedImageId ?? ""}:${selection.image?.url ?? ""}`;
  const removalChanged = removalTarget !== currentTarget;
  const removeButtonRef = useRef<HTMLButtonElement>(null);
  const { error, isDecoding, setInputRef, selectFile, selectButtonRef } =
    selection;

  return (
    <div className="min-w-0 space-y-2">
      <input
        ref={setInputRef}
        type="file"
        accept={EVENT_IMAGE_ACCEPT}
        aria-label="Valitse tapahtumakuva"
        hidden
        disabled={disabled}
        onChange={(event) => {
          const file = event.currentTarget.files?.[0];
          // Clearing the native input allows choosing the same file again.
          event.currentTarget.value = "";
          void selectFile(file);
        }}
      />
      <div className="flex flex-wrap items-center gap-2">
        <Button
          disabled={disabled}
          ref={selectButtonRef}
          type="button"
          variant="bordered"
          startIcon={<ImagePlus size={18} aria-hidden />}
          aria-describedby={error ? `${id}-error` : undefined}
          onClick={selection.openPicker}
        >
          {selection.hasImage ? "Vaihda kuva" : "Valitse kuva"}
        </Button>
        <div className="flex items-center gap-2">
          {selection.hasImage && (
            <Button
              disabled={disabled}
              ref={removeButtonRef}
              type="button"
              variant="text"
              color="danger"
              startIcon={<Trash2 size={18} aria-hidden />}
              onClick={() => setRemovalTarget(currentTarget)}
            >
              Poista kuva
            </Button>
          )}
          <span className="group relative shrink-0">
            <button
              type="button"
              aria-label="Kuvan kokorajoitus ja kuvasuhde"
              aria-describedby={`${id}-help`}
              className="text-brand-dark focus-visible:ring-brand-secondary flex h-8 w-8 items-center justify-center rounded-full focus-visible:ring-2 focus-visible:outline-hidden"
            >
              <Info size={18} aria-hidden />
            </button>
            <span
              id={`${id}-help`}
              role="tooltip"
              className="invisible absolute top-full right-0 z-10 w-max max-w-[calc(100vw-4rem)] pt-2 opacity-0 group-focus-within:visible group-focus-within:opacity-100 group-hover:visible group-hover:opacity-100"
            >
              <span className="bg-brand-dark rounded-control shadow-card block px-3 py-2 text-xs text-white">
                Enintään 10 MiB. Kuvasuhde 5:2.
              </span>
            </span>
          </span>
        </div>
        {selection.image && (
          <p
            className="text-brand-dark min-w-0 flex-[1_1_10rem] truncate text-sm"
            title={selection.image.file.name}
          >
            {selection.image.file.name}
          </p>
        )}
      </div>
      <p role="status" className="text-xs text-gray-600 empty:hidden">
        {isDecoding ? "Avataan kuvaa…" : ""}
      </p>
      {error && (
        <p id={`${id}-error`} role="alert" className="text-danger text-sm">
          {error}
        </p>
      )}
      {removalTarget !== undefined && (
        <ConfirmationDialog
          title="Poista tapahtumakuva?"
          message={removalChanged ? "Kuva on muuttunut muualla. Tarkista nykyinen esikatselu ennen poistoa." : undefined}
          confirmLabel={!selection.hasImage ? "Sulje" : removalChanged ? "Tarkista nykyinen kuva" : "Poista kuva"}
          pending={disabled}
          onCancelAction={() => {
            setRemovalTarget(undefined);
            removeButtonRef.current?.focus({ preventScroll: true });
          }}
          onConfirmAction={() => {
            if (disabled) return;
            if (!selection.hasImage) { setRemovalTarget(undefined); return; }
            if (removalChanged) { setRemovalTarget(currentTarget); return; }
            setRemovalTarget(undefined);
            selection.removeImage();
          }}
        />
      )}
    </div>
  );
}

export function EventImageBanner({
  selection,
  eventId,
  badgeText,
  badgeTone,
  disabled = false,
}: {
  disabled?: boolean;
  selection: EventImageSelection;
  eventId?: number;
  badgeText?: string;
  badgeTone: BadgeTone;
}) {
  return (
    <div>
      <div className="bg-brand-sand rounded-t-card relative aspect-[5/2] w-full overflow-hidden">
        {/* A local blob URL needs no server image optimization. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          key={selection.image?.url ?? selection.savedImageId ?? "placeholder"}
          onError={(event) => {
            const fallback = getEventImage(eventId ?? 0);
            if (!event.currentTarget.src.endsWith(fallback))
              event.currentTarget.src = fallback;
          }}
          src={
            selection.image?.url ??
            getEventImage(eventId ?? 0, selection.savedImageId)
          }
          alt="Tapahtumakuvan esikatselu"
          className="absolute inset-0 h-full w-full object-cover object-center"
        />
        {badgeText?.trim() && (
          <span
            className={`shadow-card absolute top-4 right-4 max-w-[70%] truncate rounded-full px-3 py-1.5 text-xs font-bold tracking-wide uppercase sm:text-[0.8125rem] ${BADGE_TONE_CLASS[badgeTone]}`}
          >
            {badgeText.trim()}
          </span>
        )}
      </div>
      <div className="px-4 pt-4 sm:px-7">
        <ImageControls selection={selection} disabled={disabled} />
      </div>
    </div>
  );
}
