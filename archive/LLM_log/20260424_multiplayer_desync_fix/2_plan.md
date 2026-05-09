# Plan: Multiplayer Stability & UI Decoupling

## 1. Create Probe
Write `test_discard_isolation.mjs` to:
- Open two Playwright contexts (Gale and Astarion).
- Trigger a discard state for Gale.
- Verify Gale sees the "Discard" UI.
- Verify Astarion does NOT see the "Discard" UI.

## 2. Refactor `gameStateStore.ts`
- Change `discardRequired: number` -> `discardingInfo: { playerId: string, amount: number } | null`.
- Update `setDiscardRequired` -> `setDiscardingInfo(info)`.
- Add `lastSyncTimestamp: number` to state.
- In `socket.on('state-sync')`, only update if incoming `lastSyncTimestamp > current.lastSyncTimestamp`.
- Implement `socket.on('request-full-state')` and `socket.emit('full-state-broadcast')`.

## 3. Refactor `ResourceStack.tsx`
- Ensure token count text is only `tokenCount`, not adding `cardCount`. (Wait, I already did separate them vertically, I just need to make sure the value is pure).

## 4. Update Game Logic
- Update `usePlayerActions.ts` and `GameArena.tsx` to handle the new `discardingInfo` object.

## 5. Verify
Run probe. Verify RED -> fix -> GREEN.