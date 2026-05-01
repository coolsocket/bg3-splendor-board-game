# Source Directory Overview

This directory contains the source code for the BG3 Splendor Game. It follows a strictly decoupled, layered architecture.

## Directory Structure

-   `domain/`: **The Brain**. Pure business logic and Splendor rule enforcement. Zero external dependencies.
-   `store/`: **The Heart**. State management using Zustand. 
    - `gameStateStore.ts`: The unified, synchronized source of truth for all players.
    - `audioStore.ts`: Lorentz-accurate sound management.
    - `playerStore.ts`: Local identity management.
-   `components/`: **The Body**. High-fidelity React components using Framer Motion for physical UI simulation.
-   `hooks/`: Shared React logic (e.g., `usePlayerActions`, `useTokenSelection`).
-   `repositories/`: Data access layer (e.g., `AssetRepository` for GCS CDN resolution).
-   `data/`: Static lore data, initial board states, and translations.

## Core Architectural Patterns

1.  **Action-Bus Synchronization**: Instead of complex state diffing, the system broadcasts `GameAction` intents.
2.  **Sequence Guards**: Every state update is versioned with a `sequenceNumber` to prevent network race conditions.
3.  **Global Sync Lock**: Animation locks are part of the synchronized state, ensuring all clients stay perfectly timed during cinematic transitions.
4.  **Asset Cloudification**: All heavy media are served via GCS to ensure a lightweight deployment image.
