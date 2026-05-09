# Contract: Multiplayer Desync & Global Discard Fix

## Context (Entry)
The user reported two critical multiplayer issues:
1. **Global Discard Bug**: When one player needs to discard tokens (>10), the `discardRequired` state is synced globally, forcing *all* players into the discard UI.
2. **Session Desync**: Players frequently get out of sync, likely due to race conditions in `state-sync` or lack of a "Server Authority" for new joiners.
3. **UI Request**: ResourceStack should strictly separate token and card counts visually (only numbers for tokens).

## Definition of Done (Exit)
1. **Implementation**:
    - `gameStateStore.ts`:
        - Add `lastSyncTime` or `version` to state.
        - Implement a `request-full-state` event so new joiners get the latest state from existing players.
        - Change `discardRequired` to `discardingPlayerId: string | null`. Only the player with this ID sees the UI.
    - `ResourceStack.tsx`: Remove combined logic; tokens show only their own quantity.
2. **Automated Probe (`tests/llm_probes/20260424_multiplayer_desync_fix/test_discard_isolation.mjs`)**: Verifies that setting discard state for Player A does not trigger the UI for Player B (simulated).
3. **Assertion**: Probe confirms `discardingPlayerId` works as an isolation barrier.