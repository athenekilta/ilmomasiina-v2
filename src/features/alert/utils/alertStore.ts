import { create } from "zustand";
import { produce } from "immer";

export type AlertVariant = "default" | "error" | "warning" | "primary";

export type AlerData = {
  id: string;
  createdAt: Date;
  variant: AlertVariant;
  timeoutMs: number;
  title: string;
  description?: string;
  notification?: { message: string };
  onClick?: () => void;
};

export interface AlertState {
  alerts: AlerData[];
  dispatch: (notification: AlerData) => void;
  dismiss: (id: string) => void;
}
export const useAlertStore = create<AlertState>()((set) => ({
  alerts: [],

  dispatch: (notification) =>
    set(
      produce((draft: AlertState) => {
        draft.alerts.push(notification);
      })
    ),

  dismiss: (id) =>
    set(
      produce((draft: AlertState) => {
        const index = draft.alerts.findIndex((_) => _.id === id);
        if (index < 0) return;
        draft.alerts.splice(index, 1);
      })
    ),
}));
