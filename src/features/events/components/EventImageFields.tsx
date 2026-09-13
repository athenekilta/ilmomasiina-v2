import { useId, useRef, useState } from "react";
import { ImagePlus, Trash2 } from "lucide-react";
import { Button } from "@/components/Button";
import { FieldSet } from "@/components/FieldSet";
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
  location,
}: {
  selection: EventImageSelection;
  location: "field" | "banner";
}) {
  const id = useId();
  const [confirmRemoval, setConfirmRemoval] = useState(false);
  const removeButtonRef = useRef<HTMLButtonElement>(null);
  const error = selection.error?.location === location ? selection.error : null;
  const isDecoding = selection.decodingAt === location;

  return (
    <div className="min-w-0 space-y-2">
      <div className="flex flex-wrap gap-2">
        <Button
          ref={location === "field" ? selection.fieldButtonRef : undefined}
          type="button"
          variant="bordered"
          startIcon={<ImagePlus size={18} aria-hidden />}
          aria-describedby={`${id}-help${error ? ` ${id}-error` : ""}`}
          onClick={(event) =>
            selection.openPicker(location, event.currentTarget)
          }
        >
          {selection.image ? "Vaihda kuva" : "Valitse kuva"}
        </Button>
        {location === "banner" && selection.image && (
          <Button
            ref={removeButtonRef}
            type="button"
            variant="text"
            color="danger"
            startIcon={<Trash2 size={18} aria-hidden />}
            onClick={() => setConfirmRemoval(true)}
          >
            Poista kuva
          </Button>
        )}
      </div>
      {location === "field" && selection.image && (
        <p className="text-brand-dark text-sm wrap-anywhere">
          {selection.image.file.name}
          <span className="text-gray-600">
            {" · "}
            {new Intl.NumberFormat("fi-FI", {
              maximumFractionDigits: 2,
            }).format(selection.image.file.size / (1024 * 1024))}{" "}
            MiB
          </span>
        </p>
      )}
      <p
        id={`${id}-help`}
        className={location === "field" ? "text-xs text-gray-600" : "sr-only"}
      >
        Enintään 10 MiB. Kuvasuhde 5:2.
      </p>
      <p role="status" className="text-xs text-gray-600 empty:hidden">
        {isDecoding ? "Avataan kuvaa…" : ""}
      </p>
      {error && (
        <p id={`${id}-error`} role="alert" className="text-danger text-sm">
          {error.message}
        </p>
      )}
      {confirmRemoval && (
        <ConfirmationDialog
          title="Poista tapahtumakuva?"
          confirmLabel="Poista kuva"
          pending={false}
          onCancelAction={() => {
            setConfirmRemoval(false);
            removeButtonRef.current?.focus({ preventScroll: true });
          }}
          onConfirmAction={() => {
            setConfirmRemoval(false);
            selection.removeImage();
          }}
        />
      )}
    </div>
  );
}

export function EventImageField({
  selection,
}: {
  selection: EventImageSelection;
}) {
  const { setInputRef, selectFile } = selection;
  return (
    <FieldSet title="Tapahtumakuva (valinnainen)">
      <input
        ref={setInputRef}
        type="file"
        accept={EVENT_IMAGE_ACCEPT}
        aria-label="Valitse tapahtumakuva"
        hidden
        onChange={(event) => {
          const file = event.currentTarget.files?.[0];
          // Clearing the native input allows choosing the same file again.
          event.currentTarget.value = "";
          void selectFile(file);
        }}
      />
      <ImageControls selection={selection} location="field" />
    </FieldSet>
  );
}

export function EventImageBanner({
  selection,
  eventId,
  badgeText,
  badgeTone,
}: {
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
          src={selection.image?.url ?? getEventImage(eventId ?? 0)}
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
        <ImageControls selection={selection} location="banner" />
      </div>
    </div>
  );
}
