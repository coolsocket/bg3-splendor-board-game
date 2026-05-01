# Testing Strategy: BG3 Splendor

This document outlines the procedures for verifying game logic, multi-window synchronization, and visual integrity.

## 1. Unit Testing (Domain Logic)
- **Tool**: Vitest.
- **Focus**: Pure functions in `src/domain/logic.ts` and `src/domain/actions.ts`.
- **Scenarios**:
  - Valid and invalid resource takes.
  - Card purchase with/without Tadpoles.
  - Last round triggers and tie-breaking algorithms.

## 2. Multi-Window Synchronization Testing
Since the game uses `BroadcastChannel`, automated E2E testing requires specific setup.
- **Manual Verification**:
  1. Open two browser windows (Window A and Window B).
  2. Set Window A as "Gale" and Window B as "Astarion".
  3. Perform an action in Window A.
  4. Verify that Window B reflects the updated state instantly.
  5. Verify that Window B's local settings (e.g., language) remain unchanged.
- **Edge Cases**:
  - Action collision (simultaneous clicks).
  - Network disconnect (simulated by closing a window and reopening).

## 3. Visual Regression (Physical Integrity)
- **Aesthetic Checklist**:
  - Do cards have the `animate-card-breathe` glow when affordable?
  - Do modals use the double-parchment border?
  - Are particle effects (TokenTransfer) clearing their memory correctly?
  - Does the text-shadow remain legible on all background variants?

## 4. Performance Auditing
- **FPS Check**: Ensure stable 60FPS during `TokenTransfer` bursts.
- **Memory Check**: Use Chrome DevTools Memory tab to verify that no `FlightInstance` objects are leaked after animation cleanup.
