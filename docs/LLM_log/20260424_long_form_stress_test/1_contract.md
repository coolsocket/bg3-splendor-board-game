# Contract: Long-form Stress Test & Desync Fix

## Context (Entry)
The user reports a "Turn Reversion" bug: Player A finishes their turn, Player B gets control briefly, but then the game resets back to Player A's turn. This indicates that old state snapshots or heartbeats are overwriting newer turn transitions.

## Definition of Done (Exit)
1. **Stress Test (`tests/llm_probes/20260424_long_form_stress_test/test_stress.mjs`)**: A script that plays 3 full games (or at least 30 turns) and confirms zero desyncs and zero turn reversions.
2. **Implementation**:
    - `gameStateStore.ts`: Disable the noisy global `subscribe` sync. Rely purely on `dispatchAction` for logic synchronization.
    - `gameStateStore.ts`: Ensure `lastSyncTimestamp` is handled with higher precision and strictly enforced on receipt.
    - `gameStateStore.ts`: Implement `SESSION_ID` based filtering for all sync types.
3. **Assertion**: The stress test probe passes 3 consecutive runs (GREEN).