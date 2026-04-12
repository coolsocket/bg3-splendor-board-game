# Custom Hooks

This directory contains custom React hooks that encapsulate complex UI logic, side effects, and store interactions.

## Overview

The hooks module serves as a bridge between the presentation layer (`src/components`) and the state management/domain layers. They help keep components lean and focused on rendering.

## Main Files

- `usePlayerActions.ts`: Provides standardized handlers for player interactions (taking tokens, buying/reserving cards). It coordinates updates between the event log and potential network calls.
- `useTokenSelection.ts`: Manages the complex logic of selecting tokens from the public pool, including validation rules (e.g., maximum of 3 different or 2 of the same).
- `useCardPurchase.ts`: Orchestrates the card purchase flow, including cost calculation and resource deduction logic (UI side).

## Architectural Role

Hooks in this directory are responsible for:
1. **Interaction Coordination**: Handling sequences of actions that affect multiple parts of the application.
2. **State Abstraction**: Providing a simplified interface for components to interact with one or more stores.
3. **Reusable UI Logic**: Extracting non-visual logic that is shared across different components.

By using hooks, we ensure that the components remain "shallow" and easier to test and maintain.
