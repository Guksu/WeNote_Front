import { StateCreator } from "zustand";

export interface AlertState {
  alertType: string;
  alertMsg: string;
  alertTypeChange: (type: string) => void;
  alertMsgChange: (msg: string) => void;
}

export const useAlertStore: StateCreator<AlertState> = (set) => ({
  alertType: "none",
  alertMsg: "",
  alertTypeChange: (type: string) => set((state) => ({ alertType: type })),
  alertMsgChange: (msg: string) => set((state) => ({ alertMsg: msg })),
});
