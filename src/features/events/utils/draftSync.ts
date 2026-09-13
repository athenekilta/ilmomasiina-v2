export function draftSignature(value: unknown): string {
  // Snapshots contain only editable fields in a stable order, never live counts.
  return JSON.stringify(value);
}

export function getDraftUpdate<T>(
  baseline: T | undefined,
  incoming: T | undefined,
  dirty: boolean,
  busy: boolean,
): "none" | "adopt" | "conflict" {
  if (incoming === undefined) return "none";
  if (baseline === undefined) return busy ? "none" : "adopt";
  if (draftSignature(baseline) === draftSignature(incoming)) return "none";
  // Busy defers resets, not conflicts: a pending operation must not briefly
  // re-enable a stale save just because its validation/upload has started.
  if (dirty) return "conflict";
  return busy ? "none" : "adopt";
}

export function assertCurrentImageSelection(started: number, current: number) {
  if (started !== current)
    throw new Error("Kuvavalinta muuttui latauksen aikana. Yritä uudelleen.");
}

export function isUnavailableError(
  error: { data?: { code?: string } | null } | null,
) {
  return ["NOT_FOUND", "FORBIDDEN", "UNAUTHORIZED"].includes(
    error?.data?.code ?? "",
  );
}
