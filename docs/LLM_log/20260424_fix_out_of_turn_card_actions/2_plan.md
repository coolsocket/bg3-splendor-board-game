# Plan: Fix Out-of-Turn Card Actions

## Problem
The UI currently allows any local player to click "Buy" or "Reserve" on cards in the `CardMarket` or on `PlayerBoard`s, regardless of whether it is their turn. The `handleCardInteractWithModal` function in `GameArena.tsx` processes these actions directly, applying them to the currently active player globally.

## Solution
1. In `GameArena.tsx`, update `handleCardInteractWithModal` to immediately block any action other than `'select'` if `!isMyTurn` is true. This prevents the state mutation from occurring.
2. In `GameArena.tsx`, ensure that `PlayerBoard` interaction callbacks also respect the `isMyTurn` constraint.
3. This is a lightweight, non-invasive fix that intercepts the event at the exact boundary between the UI components and the Zustand action dispatchers. It guarantees that out-of-turn players can still view (select) cards, but cannot mutate game state.