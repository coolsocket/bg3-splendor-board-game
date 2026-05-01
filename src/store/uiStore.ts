import { create } from 'zustand';

interface UIState {
  isHistoryOpen: boolean;
  expandedPlayerName: string | null;
  isSettingsOpen: boolean;
  isAnimationLocked: boolean;
  isTurnTransitioning: boolean;
  setHistoryOpen: (open: boolean) => void;
  setExpandedPlayerName: (name: string | null) => void;
  setSettingsOpen: (open: boolean) => void;
  setAnimationLocked: (locked: boolean) => void;
  setTurnTransitioning: (transitioning: boolean) => void;
}

export const useUIStore = create<UIState>((set) => ({
  isHistoryOpen: false,
  expandedPlayerName: null,
  isSettingsOpen: false,
  isAnimationLocked: false,
  isTurnTransitioning: false,
  setHistoryOpen: (open) => set({ isHistoryOpen: open }),
  setExpandedPlayerName: (name) => set({ expandedPlayerName: name }),
  setSettingsOpen: (open) => set({ isSettingsOpen: open }),
  setAnimationLocked: (locked) => set({ isAnimationLocked: locked }),
  setTurnTransitioning: (transitioning) => set({ isTurnTransitioning: transitioning }),
}));

if (typeof window !== 'undefined') { (window as any).__UI_STORE__ = useUIStore; }
