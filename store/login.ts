import { StateCreator } from "zustand";

export interface LoginState {
  isLogin: boolean;
  isLoginChagne: (loginCheck: boolean) => void;
}

export const useLoginStore: StateCreator<LoginState> = (set) => ({
  isLogin: false,
  isLoginChagne: (loginCheck: boolean) => set((state) => ({ isLogin: loginCheck })),
});
