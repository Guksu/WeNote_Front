import { create } from "zustand";
import { LoginState, useLoginStore } from "./login";
import { QueryState, useHomeQueryStore } from "./homeQuery";

type StoreState = LoginState & QueryState;

export const useAppStore = create<StoreState>()((...set) => ({
  ...useLoginStore(...set),
  ...useHomeQueryStore(...set),
}));
