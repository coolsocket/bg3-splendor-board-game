# Domain Layer

This directory contains the core business logic and models for the game. It is designed to be pure TypeScript, with no dependencies on React, Zustand, or browser APIs. This ensures that the game rules are isolated, testable, and potentially reusable in other environments (e.g., a Node.js backend).

## Main Files

-   `models.ts`: Defines the data structures and types used across the application (e.g., Card, Player, GameState).
-   `logic.ts`: Contains pure functions for game rules and state calculations (e.g., checking if a move is valid, calculating score).
-   `actions.ts`: Defines actions that can be performed in the game, which update the state according to the rules in `logic.ts`.
-   `*.test.ts`: Unit tests for the domain logic and actions.

## Architectural Role

The Domain Layer is the source of truth for game rules. It is the innermost layer in the architecture.
-   It must remain pure and decoupled from UI and state management.
-   The Store Layer (`src/store`) calls functions in this layer to execute game logic and update the state.

Refer to `implementation_plan.md` for the industrialization principles regarding the Domain Layer.
