# Contract: Fixing Multiplayer Animation Locks

## Context (Entry)
The user reported that after Player A finishes, Player B cannot move and the turn eventually reverts to Player A.
Diagnosis:
1. **Multiplayer Lock**: Player A confirms a move, locks their UI, and broadcasts an `announce-turn` event. Player B receives the event and sees the animation, but Player B's `useUIStore.isAnimationLocked` is never set back to `false` because the `setTimeout` only ran on Player A's machine.
2. **Turn Reversion**: Likely caused by heartbeats from non-authoritative clients or race conditions between `TAKE_TOKENS` and `END_TURN` snapshots.

## Definition of Done (Exit)
1. **Implementation**:
    - `gameStateStore.ts`:
        - Move `isAnimationLocked` into the global synced state (`GameStateStore`).
        - Implement `setAnimationLocked` inside `gameStateStore.ts` so it syncs across all clients automatically.
    - `usePlayerActions.ts`: Use the synced `setAnimationLocked` from `gameStateStore`.
    - `TurnAnnouncer.tsx`: Ensure it visualizes correctly based on the synced lock state.
2. **Multi-Game Stress Test (`tests/llm_probes/20260424_fixing_multiplayer_locks/test_lock_sync.mjs`)**: Simulates 3 games where every turn confirms that both players are UNLOCKED after the animation finishes.
3. **Assertion**: Both players have `isAnimationLocked === false` after every turn transition.