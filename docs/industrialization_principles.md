# BG3 Splendor - Industrialization & Architecture Principles

This document outlines the principles for making the BG3 Splendor codebase more industrialized, decoupled, and reusable. These principles should guide future development and refactoring.

## 1. Strict Layered Architecture

The application is divided into four distinct layers, each with a strict set of responsibilities:

### A. Domain Layer (`src/domain`)
- **Responsibility**: Pure business logic and game rules.
- **Constraints**:
    - Must be **pure TypeScript**.
    - **Zero dependencies** on React, Zustand, or browser-specific APIs (like `window` or `localStorage`).
    - Functions should be pure (same input -> same output) where possible.
- **Why**: This ensures the game rules are highly testable and can be reused in a non-React environment (e.g., a Node.js backend or a different frontend framework).

### B. Store Layer (`src/store`)
- **Responsibility**: State management and coordination.
- **Constraints**:
    - Uses **Zustand** for lightweight, decoupled state.
    - Acts as the bridge between the pure Domain logic and the React UI.
    - Subscribes to Network events and calls Domain functions to calculate new state.
- **Why**: Keeps UI components thin and prevents business logic from leaking into React components.

### C. UI Layer (`src/components`)
- **Responsibility**: Presentation and user interaction.
- **Constraints**:
    - Components should be "dumb" or presentational where possible.
    - They should read state via Zustand selectors and dispatch actions to the store.
    - Avoid complex calculations inside components.
- **Why**: Improves reusability of UI elements and simplifies testing.

### D. Network Layer (`src/network`)
- **Responsibility**: Real-time communication.
- **Constraints**:
    - Handles WebSocket connections and message parsing.
    - Should not hold game state; instead, it should trigger actions in the Store layer.

## 2. Component Reusability & Affordance

- **Generic UI Elements**: Components like `Token`, `PrestigeBadge`, and `Card` should be designed as generic building blocks. They should accept data via props and not be hardcoded to specific store paths.
- **Visual Affordance**: UI should clearly indicate what is interactive. Hover states, active glows, and disabled masks should be consistent across components.
- **Theming**: All colors, borders, and spacing must use CSS variables defined in `variables.css`. This allows changing the entire game's theme by modifying a single file.

## 3. State Management Optimization

- **Granular Stores**: Instead of one monolithic store, use small, focused stores (e.g., `playerStore`, `publicStore`). This prevents unnecessary re-renders of components that only care about a slice of state.
- **Immutability**: Treat state as immutable. Use Immer if state updates become deeply nested and complex.

## 4. Network-Driven State (Server Authority)

- **Stores as Read-Only Containers**: The Zustand stores in this project act primarily as read-only state containers for the UI. They do not contain actions to mutate state directly.
- **Network Updates**: The `NetworkManager` receives `game_state_update` messages from the WebSocket server and uses `setState` to update the stores directly.
- **UI Actions**: When a user interacts with the UI, the component should send a message to the server via `NetworkManager.send()`, rather than updating local state. The server will calculate the new state and broadcast it back.
- **Why**: This enforces a strict client-server model, prevents cheating, and ensures all clients are synchronized.

## 5. CSS Architecture

- **BEM or Scoped CSS**: Use CSS modules or strict BEM naming to prevent style leakage.
- **Variables First**: Never hardcode a color or pixel value in a component CSS file if it can be derived from a variable.

## 5. Testing Strategy

- **Domain**: 100% unit test coverage for all game rules in `logic.ts` and `actions.ts`.
- **Store**: Integration tests to verify that calling store actions updates state correctly.
- **UI**: Visual QA and snapshot testing where appropriate.
