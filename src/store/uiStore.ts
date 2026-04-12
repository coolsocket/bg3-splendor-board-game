import { create } from 'zustand';

interface UIState {
  isHistoryOpen: boolean;
  expandedPlayerName: string | null;
  isSettingsOpen: boolean;
  setHistoryOpen: (open: boolean) => void;
  setExpandedPlayerName: (name: string | null) => void;
  setSettingsOpen: (open: boolean) => void;
}

export const useUIStore = create<UIState>((set) => ({
  isHistoryOpen: false,
  expandedPlayerName: null,
  isSettingsOpen: false,
  setHistoryOpen: (open) => set({ isHistoryOpen: open }),
  setExpandedPlayerName: (name) => set({ expandedPlayerName: name }),
  setSettingsOpen: (open) => set({ isSettingsOpen: open }),
}));
