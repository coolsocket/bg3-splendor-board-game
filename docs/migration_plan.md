# Code Migration Plan - BG3 Splendor

This document outlines the detailed steps for migrating the BG3 Splendor game from the legacy codebase to the new decoupled architecture. It synthesizes guidance from `state_topology.md`, `rulebook.md`, `design_system.md`, and `extensibility_guide.md`.

## 1. Overview of Target Architecture

The goal of this migration is to transition from a monolithic, imperative DOM-manipulation approach (as seen in the legacy `UIRenderer.js`) to a modern, decoupled, and state-driven architecture.

Key Pillars:
- **State Isolation**: Strictly separated `publicStore`, `playerStore`, and `gameSystemStore` (`state_topology.md`).
- **Pure Domain Logic**: All game rules and state transitions executed via pure functions (`rulebook.md`).
- **Declarative UI**: A component-based UI following atomic design principles and BG3 aesthetics (`design_system.md`).
- **Extensibility**: Config-driven features and strategy patterns for special effects (`extensibility_guide.md`).

---

## 2. Module Division

The new codebase will be divided into the following core modules:

### 2.1. Core Domain (`/src/domain`)
- `models.ts`: Type definitions for Resources, Cards, Players, and GameState.
- `logic.ts`: Pure functions for resource operations, card calculations, and player updates.
- `actions.ts`: State transition reducers for game actions (Take Tokens, Buy Card, Reserve Card).

### 2.3. State Management (`/src/store`)
- `publicStore.ts`: Manages board resources, decks, face-up cards, and patrons.
- `playerStore.ts`: Manages individual player state.
- `gameSystemStore.ts`: Manages game phase, turn index, and winning conditions.

### 2.3. UI Components (`/src/components`)
- Atom and Molecule components applying the BG3 design system.
- Organism components corresponding to the Declarative Component Tree (e.g., `CardMarket`, `PlayerBoard`).

### 2.4. Extensibility Layer (`/src/extensions`)
- `effectManager.ts`: Registry for card and patron special effects.
- `plugins/`: Directory for game flow hooks.

---

## 3. Step-by-Step Migration Plan

### Phase 1: Domain & State Foundation (Backend of the Frontend)

**Objective**: Establish the pure logic and state structures before touching the UI.

1.  **Step 1: Define TypeScript Interfaces**
    - Extract models from `rulebook.md` and implement them in `src/domain/models.ts`.
    - Ensure strict typing for `ResourceCollection`, `Card`, `Player`, and `GameState`.
2.  **Step 2: Implement Pure Functions**
    - Migrate game logic from legacy code to pure functions in `src/domain/logic.ts`.
    - Implement `calculateEffectiveCost`, `hasEnoughResources`, etc.
3.  **Step 3: Implement Action Reducers**
    - Implement `takeTokensAction`, `buyCardAction`, and `reserveCardAction` in `src/domain/actions.ts`.
    - Ensure these functions take a `GameState` and return a new `GameState` or an error, without side effects.
4.  **Step 4: Setup Stores**
    - Implement the stores defined in `state_topology.md` using a simple state management pattern or library.
    - Ensure unidirectional data flow: UI -> Action -> Store Update.

### Phase 2: Visual & Component Migration

**Objective**: Rebuild the UI in a declarative manner using the new design system.

1.  **Step 1: Setup Styling and Theme**
    - Port CSS variables and design tokens from `design_system.md` (Underdark palette, parchment textures).
    - Setup grid layouts.
2.  **Step 2: Build Atomic Components**
    - Create basic components: `Token`, `Card`, `PatronTile`.
    - Apply materials and shadows as specified in `design_system.md`.
3.  **Step 3: Refactor Monolithic Renderers**
    - Break down `UIRenderer.js` functions into independent components:
        - `updateGameBoard` (Turn banner) -> `TopNavigation`
        - `renderResources` -> `PublicResourcePool`
        - `renderTierCards` -> `CardMarket`
        - `renderPatrons` -> `PatronsBoard`
        - `table-bottom-player` / `table-opponents` -> `PlayerBoard`

### Phase 3: Integration & Extensibility

**Objective**: Connect the components to the state and enable advanced features.

1.  **Step 1: State Connection**
    - Connect the UI components to read from the stores.
    - Bind user interactions to dispatch actions implemented in Phase 1.
2.  **Step 2: Implement Effect Manager**
    - Create the `EffectManager` as defined in `extensibility_guide.md`.
    - Register strategies for special effects.
3.  **Step 3: Config Migration**
    - Move card and patron definitions from hardcoded structures to JSON configuration files.
    - *Note*: In `STORY-028`, card and patron data were temporarily hardcoded in `src/simulate.ts` due to missing data files. This step remains to be completed for full compliance with the architecture.

---

## 4. Verification Methods

To ensure a successful migration, the following verification methods must be applied at each stage:

### 4.1. Domain Logic Verification
- **Unit Tests**: Every pure function in `logic.ts` and `actions.ts` must have associated unit tests.
- **State Immutability Check**: Verify that calling actions does not mutate the previous state object.

### 4.2. UI Component Verification
- **Visual Regression/Check**: Verify that the UI matches the BG3 dark fantasy aesthetic described in `design_system.md` (no pure black, parchment textures active).
- **Prop-Driven Rendering**: Verify that components correctly render state passed via props and do not fetch data independently.

### 4.3. Integration Verification
- **Full Turn Cycle Test**: Simulate a game session involving taking tokens, reserving a card, and buying a card. Verify that the `GameState` in the store updates correctly after each action.
- **Extensibility Test**: Load a dummy effect via JSON config and verify that the `EffectManager` triggers it during the appropriate hook (e.g., `onTurnStart`).
