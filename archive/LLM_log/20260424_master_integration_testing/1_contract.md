# Retrospective: The "Snapshot Echo" Oversight

## 1. Why didn't I think of this initially?
My initial approach was rooted in **"Simplicity Bias"**. In standard single-player web apps, state updates are atomic and reliable. When I added Socket.io, I used a **Snapshot-Sync** model: "If the state changes, send the whole thing."

**The Blind Spot:** I treated the network as a "dumb pipe" that always delivers the latest data instantly. I failed to account for **Delayed Echoes**:
1. Player A ends turn (State V2).
2. Player B receives V2.
3. A lingering Heartbeat from Player A (State V1) arrives 100ms later at Player B.
4. Player B's state reverts to V1.

I initially missed the "Strict Sequence Numbering" because I was focused on the *breadth* of the features rather than the *depth* of the distributed systems challenges.

## 2. Why was the UI Lock local?
I fell into the **"Standard React Pattern Trap"**. Usually, UI state (modals, loaders, locks) is strictly local. However, in a turn-based multiplayer game with heavy animations, the **Lock is a Core Rule**, not just a UI preference. If the lock isn't synced, the player waiting for the animation is "flying blind" while the sender is already moving on.

---

# Contract: Master Integration Suite

## Definition of Done (Exit)
1. **Probe (`tests/llm_probes/20260424_master_integration_testing/test_master.mjs`)**:
    - **Stage 1 (Token Sync)**: Take tokens, verify counts and turn transition on both sides.
    - **Stage 2 (Card Purchase Sync)**: Inject resources, buy a card, verify card moves from Market -> Player Board on both sides.
    - **Stage 3 (Patron Sync)**: Inject specific bonuses, trigger a patron visit, verify patron moves on both sides.
    - **Stage 4 (Win Condition)**: Inject 17 points, buy a 1-point card, verify "Ascension" screen appears on both sides.
2. **Success Criteria**: All 4 stages pass without any manual refreshes.
