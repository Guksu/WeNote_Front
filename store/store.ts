import { create } from "zustand";
import { LoginState, useLoginStore } from "./login";
import { QueryState, useHomeQueryStore } from "./homeQuery";
import { AlertState, useAlertStore } from "./alertSlice";

type StoreState = LoginState & QueryState & AlertState;

export const useAppStore = create<StoreState>()((...set) => ({
  ...useLoginStore(...set),
  ...useHomeQueryStore(...set),
  ...useAlertStore(...set),
}));
