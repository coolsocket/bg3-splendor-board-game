# Plan: Fixing Multiplayer Animation Locks

## 1. Create Probe
Write `test_lock_sync.mjs` to:
- Play 3 turns.
- After each turn, check `window.__UI_STORE__.getState().isAnimationLocked` on both Page A and Page B.
- If either is `true` after 5 seconds, the test fails.

## 2. Refactor `gameStateStore.ts`
- Add `isAnimationLocked: boolean` to `GameStateStore` interface.
- Initialize `isAnimationLocked: false`.
- Add `setSyncedAnimationLocked: (locked: boolean) => void` that increments `sequenceNumber` and broadcasts.
- In `dispatchAction`, ensure `isAnimationLocked` is handled if needed.

## 3. Refactor `usePlayerActions.ts`
- Replace `useUIStore.getState().setAnimationLocked` with `useGameStateStore.getState().setSyncedAnimationLocked`.
- This ensures that when Gale unlocks, Astarion unlocks.

## 4. Handle "Host" Heartbeat authority
- Ensure the heartbeat includes the sequence number.
- Add a check: If I receive a state with the SAME sequence number as mine, but I am the "Host", ignore it to avoid feedback.

## 5. Verify
Run stress test. Verify GREEN.