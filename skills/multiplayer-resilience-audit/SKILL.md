# Multiplayer Resilience Audit (MRA)

This skill provides a standardized workflow for auditing and verifying the synchronization integrity of the Action-Bus architecture.

## Purpose
To ensure that new gameplay features or store updates do not break turn transitions, cause state rollbacks, or introduce UI deadlocks in a distributed environment.

## Mandatory Workflow

### 1. The Sequence Guard Check
Verify that the proposed state update correctly increments the `sequenceNumber`.
- **Target**: `src/store/gameStateStore.ts` -> `dispatchAction` and `setGameState`.
- **Test**: Ensure that calling the action results in `prev.sequenceNumber + 1`.

### 2. The Snapshot Echo Stress Test
Simulate a "Delayed Heartbeat" scenario:
1. Client A sends an action (Seq 11).
2. Client B receives action, moves to Seq 11.
3. Client A's previous heartbeat (Seq 10) arrives at Client B late.
4. **Validation**: Client B MUST reject the late packet and stay at Seq 11.

### 3. The Global Lock Verification
If an action triggers a transition (e.g., `END_TURN`), verify that:
1. `isAnimationLocked` is set to `true` globally.
2. All clients show the transition UI simultaneously.
3. `setAnimationLocked(false)` is eventually called and synced to all clients.

## Tooling: Playwright Integration
Use `tests/llm_probes/` to create a multi-window simulation:
```javascript
const pageA = await browser.newPage();
const pageB = await browser.newPage();
// ... simulate actions ...
const seqA = await pageA.evaluate(() => window.__ZUSTAND_STORE__.getState().sequenceNumber);
const seqB = await pageB.evaluate(() => window.__ZUSTAND_STORE__.getState().sequenceNumber);
if (seqA !== seqB) throw new Error("Desync");
```

## Troubleshooting
- **Reverting Turns**: Usually caused by a missing `sequenceNumber <= localSeq` check in the socket listener.
- **Unresponsive UI**: Usually caused by a local-only `isAnimationLocked` being set to `true` but never receiving the `false` sync.
