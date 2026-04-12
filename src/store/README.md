# State Management (Store Layer)

This directory contains the state management stores built with Zustand. They serve as the central coordination layer of the application.

## Overview

The stores bridge the gap between the pure domain logic (`src/domain`), the network layer (`src/network`), and the presentation layer (`src/components`). They are responsible for holding the current state of the game and providing methods to update it.

## Main Stores

- `gameSystemStore.ts`: Orchestrates the overall game flow, turn transitions, and integration with Domain actions.
- `publicStore.ts`: Holds state visible to all players, such as the card market, available resource pool, and active patrons.
- `playerStore.ts`: Manages state specific to individual players (resources, bonuses, reserved cards).
- `eventLogStore.ts`: Maintains a history of game events for display in the UI.
- `uiStore.ts`: Manages transient UI states like active modals, tooltips, or selected tabs.
- `audioStore.ts`: Controls game sound effects and background music states.

## Architectural Role

1. **State Authority**: While the domain logic is pure, the stores are the "containers" that hold the mutable state of the application.
2. **Action Dispatching**: Stores translate UI intents into domain actions.
3. **Reactive Binding**: Components subscribe to specific slices of store state, ensuring efficient re-renders.
4. **Integration Point**: Stores coordinate side effects from the network and audio modules.

## Principles

- **Granularity**: States are divided into multiple stores to minimize re-render impact.
- **Separation of Concerns**: Logic is kept in the domain layer; stores only manage the application of that logic to the current state.
