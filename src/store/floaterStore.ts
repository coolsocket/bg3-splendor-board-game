import { create } from 'zustand';

export interface Floater {
  id: string;
  text: string;
  x: number;
  y: number;
  color: string;
}

interface FloaterState {
  floaters: Floater[];
  addFloater: (floater: Omit<Floater, 'id'>) => void;
  removeFloater: (id: string) => void;
}

export const useFloaterStore = create<FloaterState>((set) => ({
  floaters: [],
  addFloater: (floater) => {
    const id = Math.random().toString(36).substr(2, 9);
    set((state) => ({
      floaters: [...state.floaters, { ...floater, id }],
    }));
  },
  removeFloater: (id) =>
    set((state) => ({
      floaters: state.floaters.filter((f) => f.id !== id),
    })),
}));
