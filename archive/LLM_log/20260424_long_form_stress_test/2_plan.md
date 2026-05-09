# Plan: Long-form Stress Test & Desync Fix

## 1. Upgrade Stress Test
Refine `test_stress.mjs` to:
- Use a retry-mechanism for clicks.
- Handle potential UI overlaps.
- Increase the number of turns to 20 per game.
- Play 3 full games.

## 2. Implement Store Fixes
- **Refactor `gameStateStore.ts`**:
    - REMOVE the `subscribe` block that broadcasts everything. This is the primary source of race conditions.
    - Keep `dispatchAction` as the primary emitter.
    - In `socket.on('state-sync')`, add more verbose logging to see exactly who is sending what.
    - Ensure `lastSyncTimestamp` is always included and strictly checked.
- **Update `GameArena.tsx`**:
    - Ensure the "Host" (first player) correctly sends the heartbeat.

## 3. Verify
Run the stress test. Verify RED (it should fail with turn reversion) -> fix -> GREEN.