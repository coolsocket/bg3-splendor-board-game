import { describe, it, expect, beforeEach } from 'vitest';
import { useGameSystemStore } from './gameSystemStore';
import { GamePhase } from '../domain/models';

describe('gameSystemStore', () => {
  beforeEach(() => {
    // Reset store state before each test
    useGameSystemStore.setState({
      phase: GamePhase.SETUP,
      currentPlayerIndex: 0,
      turnNumber: 1,
      endGameTriggeredBy: undefined,
    });
  });

  it('should have initial state', () => {
    const state = useGameSystemStore.getState();
    expect(state.phase).toBe(GamePhase.SETUP);
    expect(state.currentPlayerIndex).toBe(0);
    expect(state.turnNumber).toBe(1);
    expect(state.endGameTriggeredBy).toBeUndefined();
  });

  it('should update phase', () => {
    useGameSystemStore.setState({ phase: GamePhase.PLAYING });
    const state = useGameSystemStore.getState();
    expect(state.phase).toBe(GamePhase.PLAYING);
  });

  it('should update currentPlayerIndex', () => {
    useGameSystemStore.setState({ currentPlayerIndex: 1 });
    const state = useGameSystemStore.getState();
    expect(state.currentPlayerIndex).toBe(1);
  });

  it('should update turnNumber', () => {
    useGameSystemStore.setState({ turnNumber: 2 });
    const state = useGameSystemStore.getState();
    expect(state.turnNumber).toBe(2);
  });

  it('should update endGameTriggeredBy', () => {
    useGameSystemStore.setState({ endGameTriggeredBy: 'player-1' });
    const state = useGameSystemStore.getState();
    expect(state.endGameTriggeredBy).toBe('player-1');
  });
});
