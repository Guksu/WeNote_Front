import { StateCreator } from "zustand";

interface HomeQuery {
  keyword: string;
  category: string;
  page: number | string;
}

export interface QueryState {
  homeQuery: HomeQuery;
  queryChange: (queryState: HomeQuery) => void;
}

export const useHomeQueryStore: StateCreator<QueryState> = (set) => ({
  homeQuery: { keyword: "", category: "0", page: 1 },
  queryChange: (queryState: HomeQuery) =>
    set((state) => ({ homeQuery: { keyword: queryState.keyword, category: queryState.category, page: queryState.page } })),
});
