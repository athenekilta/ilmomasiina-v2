import type { BadgeTone } from "@/generated/prisma/client";

/* Literal class strings, so the Tailwind JIT scanner sees them. */
export const BADGE_TONE_CLASS: Record<BadgeTone, string> = {
  GREEN: "bg-brand-secondary text-brand-lime",
  PINK: "bg-brand-pink text-white",
  DARK: "bg-brand-dark text-white",
};

/** Admin-facing labels, in the order they appear in the picker. */
export const BADGE_TONE_OPTIONS: { value: BadgeTone; label: string }[] = [
  { value: "GREEN", label: "Vihreä (perus)" },
  { value: "PINK", label: "Pinkki (haippi)" },
  { value: "DARK", label: "Musta (tyylikäs)" },
];
