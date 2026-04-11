# Store Layer

This directory contains state management stores using Zustand. The stores act as the coordinator between the pure domain logic, the network layer, and the React UI.

## Main Files

-   `gameSystemStore.ts`: Manages global game system state (e.g., current turn, game status).
-   `playerStore.ts`: Manages state specific to the players (e.g., player resources, hand).
-   `publicStore.ts`: Manages public game state (e.g., board state, available cards, nobles).
-   `gameSystemStore.test.ts`: Tests for the game system store.

## Architectural Role

The Store Layer bridges the gap between pure domain logic and React UI.
-   It acts as the coordinator.
-   It should subscribe to network events, call domain functions (from `src/domain`) to calculate new state, and update the store.
-   The UI layer reads from these stores and dispatches actions to them.
-   Stores are kept granular (player, public, system) to prevent unnecessary re-renders.

Refer to `implementation_plan.md` for the industrialization principles regarding the Store Layer.
