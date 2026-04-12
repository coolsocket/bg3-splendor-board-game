import { create } from 'zustand';

interface UIState {
  isHistoryOpen: boolean;
  expandedPlayerName: string | null;
  setHistoryOpen: (open: boolean) => void;
  setExpandedPlayerName: (name: string | null) => void;
}

export const useUIStore = create<UIState>((set) => ({
  isHistoryOpen: false,
  expandedPlayerName: null,
  setHistoryOpen: (open) => set({ isHistoryOpen: open }),
  setExpandedPlayerName: (name) => set({ expandedPlayerName: name }),
}));
