import { create } from 'zustand';

export interface GameEvent {
  id: string;
  message: string;
  timestamp: Date;
}

interface EventLogState {
  events: GameEvent[];
  addEvent: (message: string) => void;
  clearEvents: () => void;
}

export const useEventLogStore = create<EventLogState>((set) => ({
  events: [],
  addEvent: (message) => set((state) => ({
    events: [
      ...state.events,
      {
        id: Math.random().toString(36).substring(2, 9),
        message,
        timestamp: new Date(),
      }
    ].slice(-5) // Keep only last 5 events for minimal log
  })),
  clearEvents: () => set({ events: [] }),
}));
