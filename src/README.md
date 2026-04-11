# Source Directory Overview

This directory contains the source code for the BG3 Splendor Game. It follows a layered architecture to ensure decoupling and maintainability.

## Directory Structure

-   `ai/`: AI logic for single-player mode or opponent simulation.
-   `assets/`: Static assets like images and fonts.
-   `components/`: UI components and their specific styles (Presentational layer).
-   `data/`: Static data or configuration files.
-   `domain/`: Core business logic and models (Pure logic, source of truth).
-   `hooks/`: Custom React hooks.
-   `network/`: Network communication (WebSockets) for real-time synchronization.
-   `store/`: State management using Zustand (Bridges domain and UI).
-   `test-utils/`: Utilities for testing.

## Main Files

-   `App.tsx`: Main application component, sets up the layout and routing.
-   `main.tsx`: Entry point for the React application.
-   `variables.css`: Global CSS variables (colors, spacing, etc.) for theming.
-   `index.css`: Global styles.
-   `simulate.ts`: Script for simulating game flow or testing.

## Architectural Role

This directory is the root of the application source. It orchestrates the different layers defined in the subdirectories. It follows a strict layered architecture as outlined in the `implementation_plan.md`:
-   **Domain Layer** (`src/domain`): Pure business logic.
-   **Store Layer** (`src/store`): State management and coordination.
-   **UI Layer** (`src/components`): Presentational components.
-   **Network Layer** (`src/network`): WebSocket communication.
