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
    ].slice(-50) // Keep more events for history drawer
  })),
  clearEvents: () => set({ events: [] }),
}));

// --- LOCAL MULTIPLAYER SIMULATION ---
// Syncs event log state across multiple browser windows.
// NOTE: Basic singleton implementation. Does not close channel on unmount.
const logBc = new BroadcastChannel('splendor-event-log');
let isReceivingLog = false;

useEventLogStore.subscribe((state) => {
  if (!isReceivingLog) {
    const { addEvent, clearEvents, ...pureState } = state;
    logBc.postMessage(pureState);
  }
});

logBc.onmessage = (event) => {
  isReceivingLog = true;
  useEventLogStore.setState(event.data);
  setTimeout(() => {
    isReceivingLog = false;
  }, 0);
};
