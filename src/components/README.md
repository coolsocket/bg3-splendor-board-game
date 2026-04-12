# UI Components Layer

This directory contains the UI components and their specific styles. It represents the presentational layer of the application.

## Main Components

- `GameArena.tsx`: The main container component for the game area, coordinating the layout of the board, market, and player areas.
- `PlayerBoard.tsx`: Displays the state, resources, bonuses, and reserved cards of a player.
- `Card.tsx`: Displays a game card with its costs, points, and bonus effects. Supports hover effects and interactive states.
- `CardMarket.tsx`: Displays the grid of available cards in the market, organized by tiers.
- `PublicResourcePool.tsx`: Displays the available resources (tokens) for players to take.
- `Token.tsx`: A stylized resource token component used throughout the UI.
- `PatronSlot.tsx`: Displays a Patron card and its requirements.
- `EventLog.tsx`: Displays a scrollable log of game events.

## Common Components (`/common`)

Reusable low-level UI elements:
- `Avatar.tsx`: Standard character portrait component.
- `Button.tsx`: Themed button with various variants (primary, secondary, etc.).
- `Modal.tsx` & `Drawer.tsx`: Layout components for overlays and side panels.
- `CardBase.tsx`: Basic card layout used by both game cards and patrons.
- `ResourceIcon.tsx`: Small SVG icons for various game resources.

## Architectural Role

The UI Layer is responsible for presentation and user interaction handling.
- **Store Integration**: Components read state from `src/store` using hooks (e.g., `useGameStore`) and dispatch actions to trigger state changes.
- **Presentational Logic**: Logic within components is restricted to UI concerns (animations, hover states, toggling visibility).
- **Styling**: Uses Tailwind CSS for layout and custom CSS for complex decorative elements (like the parchment texture and metal borders).
- **Decoupling**: Generic UI elements are kept pure and props-driven to ensure reusability.

Refer to the project implementation plan for detailed coding standards regarding components.
