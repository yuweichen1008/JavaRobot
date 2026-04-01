import { create } from 'zustand'

interface ConnectionStore {
  wsConnected: boolean;
  lastError: string | null;
  setConnected: (v: boolean) => void;
  setError: (e: string | null) => void;
}

export const useConnectionStore = create<ConnectionStore>((set) => ({
  wsConnected: false,
  lastError: null,
  setConnected: (v) => set({ wsConnected: v }),
  setError: (e) => set({ lastError: e }),
}))
