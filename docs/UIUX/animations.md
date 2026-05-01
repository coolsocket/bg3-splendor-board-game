# Animation & VFX Standards

This document outlines the architecture, standards, and strict rules for implementing physical animations and visual effects within the BG3 Splendor project.

## 1. Dual-Engine Architecture

To maintain a high-performance 60FPS experience while dealing with complex state transitions, we utilize a dual-engine approach:

### A. React & Framer Motion Layer
- **Responsibility**: Bounded, discrete, and layout-aware animations.
- **Use Cases**: Card flying across the screen (`CardFlight.tsx`), panels opening, modal transitions, and basic token routing.
- **Why**: Framer Motion integrates seamlessly with React's lifecycle and allows for complex orchestration (like spring physics and drag gestures).

### B. Canvas Engine Layer
- **Responsibility**: High-volume, free-floating, and "fire-and-forget" particles.
- **Use Cases**: Elemental token impacts, smoke effects, coin trails, magic circle rendering, and physics-driven particle debris (`TokenTransfer.tsx`).
- **Why**: React cannot handle the rendering of hundreds of individual DOM nodes per frame. A single global Canvas overlay handles these transient pixels natively and efficiently.

## 2. Physical Animation Primitives

Animations must adhere to our "Tactile Skeuomorphism" design pillar. Elements should feel like physical objects interacting in a 3D space.

- **Gravity & Momentum**: Elements moving across the screen should have an arc (bezier curves) or utilize spring physics.
- **Impacts**: Heavy actions (like taking resources or buying a card) must have a visual impact (e.g., a screen-blend mode shockwave or camera shake).
- **Thematic Fidelity**: Animations must match the Baldur's Gate 3 theme:
  - *Reserving*: "Arcane Lock" (Purple, spinning, scaling magic circles).
  - *Buying*: "Searing Slam" (Golden, glowing, heavy impacts).
  - *Resources*: Elemental particles (Smoke for iron, shards for crystals, fluttering leaves for nature).
- **Epic Flights & Non-Linear Easing**: For high-impact moments (e.g., a Patron visiting the player or cards being reserved), animations use "Hearthstone-like" fast-slow-fast easing (`circOut` followed by `circIn`) coupled with complex 3D flips (`rotateX`, `rotateZ`) to convey significant weight and grandeur.

## 3. Strict Memory Management Rules (红线)

Animations are the leading cause of memory leaks in React applications. The following rules are mandatory:

1. **Never Trust `onAnimationComplete` for Cleanup**: 
   React/Framer Motion event callbacks can be interrupted or dropped if a user spams actions rapidly.
2. **Forced Lifecycle Timeouts**:
   Every dynamic animation element MUST have a rigid, `setTimeout`-based cleanup mechanism initiated immediately upon spawn.
   ```typescript
   // Correct
   setTimeout(() => {
     setItems(prev => prev.filter(i => i.id !== id));
   }, PHYSICS_CONFIG.flight.cleanupDelay);
   ```
3. **Decoupled Configurations**:
   No magic numbers (durations, max particle counts, velocities) or hardcoded hex colors should exist within the `.tsx` components. All physical properties and colors must be exported from `src/components/common/animationConfig.ts`.
## 4. Inter-Window Synchronization

Since the game supports multi-window simulation, animations must be orchestrated across instances.

- **The `fromNetwork` Flag**: Every animation trigger (e.g., `spawnCardFlight`) includes a `fromNetwork` boolean.
- **Broadcast**: If an action is triggered locally (e.g., a player clicks "Buy"), the animation is triggered AND broadcast via `BroadcastChannel`.
- **Reception**: Other windows receive the animation event. If `fromNetwork` is true, they play the visual effect without re-broadcasting, ensuring all players "see" the move simultaneously.
- **Reverse Flow**: Animations for "Discarding" or "Returning to Pool" use reverse coordinate mapping (Player -> Public Pool) to maintain physical continuity.

