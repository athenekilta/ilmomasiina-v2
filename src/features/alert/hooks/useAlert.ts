import cuid from "cuid";
import { useCallback, useMemo } from "react";
import type { AlertVariant, AlerData } from "../utils/alertStore";
import { useAlertStore } from "../utils/alertStore";

// 5 seconds
const DEFAULT_TIMEOUT_MS = 5_000;

export function useAlert() {
  const dispatch = useAlertStore((state) => state.dispatch);
  const dismiss = useAlertStore((state) => state.dismiss);

  const createAlerter = useCallback(
    (variant: AlertVariant, fallbackMessage: string) => {
      return (
        title: string,
        options: Pick<AlerData, "description" | "onClick"> & {
          timeoutMs?: number;
        } = {}
      ) => {
        const id = cuid();
        const timeoutMs = options.timeoutMs ?? DEFAULT_TIMEOUT_MS;

        dispatch({
          createdAt: new Date(),
          id,
          timeoutMs,
          title: title ? title : fallbackMessage,
          variant,
          description: options.description,
          onClick: options.onClick,
        });

        setTimeout(() => dismiss(id), timeoutMs);
      };
    },
    [dispatch, dismiss]
  );

  return {
    success: useMemo(
      () => createAlerter("primary", "Success"),
      [createAlerter]
    ),
    default: useMemo(() => createAlerter("default", ""), [createAlerter]),
    warning: useMemo(
      () => createAlerter("warning", "Warning"),
      [createAlerter]
    ),
    error: useMemo(() => createAlerter("error", "Error"), [createAlerter]),
  };
}
