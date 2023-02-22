import { create } from "zustand";
import { LoginState, useLoginStore } from "./login";

type StoreState = LoginState;

export const useAppStore = create<StoreState>()((...set) => ({
  ...useLoginStore(...set),
}));
