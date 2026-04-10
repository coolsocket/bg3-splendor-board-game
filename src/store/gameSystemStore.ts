import { create } from 'zustand';
import { GamePhase } from '../domain/models';

export interface GameSystemState {
  phase: GamePhase;
  currentPlayerIndex: number;
  turnNumber: number;
  endGameTriggeredBy: string | undefined;
}

export const useGameSystemStore = create<GameSystemState>(() => ({
  phase: GamePhase.SETUP,
  currentPlayerIndex: 0,
  turnNumber: 1,
  endGameTriggeredBy: undefined,
}));
