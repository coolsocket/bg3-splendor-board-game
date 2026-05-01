# Industrialization Principles - BG3 Splendor

This document outlines the engineering principles and architectural patterns used to build the BG3 Splendor web application.

## 1. State Management & Animation Synchronization

A common paradox in React applications is reconciling instantaneous state updates (e.g., purchasing a card) with physical animations that take time to play out. We resolve this through two core strategies:

### Action-Driven Animations & Visual Snapshots

1. **Instantaneous Optimistic State Updates**: Global state updates immediately on action triggers.
2. **Visual Snapshots (Exit Animations)**: Animation engines retain exiting elements or create "ghost" elements to complete transitions.
3. **Interpolated Display values**: Components displaying numeric values (e.g. player resources) interpolate from their old values to their new values driven by an animation timeline, independent of the raw store state.

### Independent Particle & Overlay Layer

For free-floating visual effects (e.g. floating numbers drift upward when resources are deducted), we use a top-level canvas layer to render independent floating particles. This decouples heavy rendering updates from the main React component tree.

## 2. Component Architecture & Decoupling

- **Card Base**: A standard container defining sizing heuristics.
- **Action Docks**: Modularize player action containers directly adjacent to interacting components to eliminate floating UI artifacts.
- **Unified Resource token representations**: Standard representation of sacrifice metrics to reinforce consistency.
- **Fluid Dimensions and Constraints**: Always utilize Tailwind proportional sizes (`w-24`, `max-w-60`) or ratios (`aspect-[2/3]`) instead of absolute pixel values (`[XXpx]`) to ensure elastic responsiveness.
- **Standardized Typography Constraints**: Restrict arbitrary text sizes to pre-established tailwind sizes (`text-xs`, `text-base`) to prevent fragmented readability.

## 3. Subagent Audits & Consistency

- All components must utilize parameterizable interfaces.
- Enforce absolute isolation of local UI states from central authority states (Single Source of Truth).
