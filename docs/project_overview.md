# Project Overview & Architecture

This document provides an overview of the BG3 Splendor project directory structure, component responsibilities, and implementation details, specifically reflecting the Phase 3 UI/UX industrialization refinements.

## Directory Structure

```text
bg3_splendor_game_2/
├── docs/                  # Project documentation and guidelines
│   ├── UIUX.md            # Original UI/UX guidance (Read-only)
│   ├── design_system.md   # Original Design System guidance (Read-only)
│   ├── ui_refinement_plan.md # Phase 3 refinement tasks
│   └── project_overview.md # This file (Component map and architecture)
├── src/
│   ├── components/        # React components and their styles
│   │   ├── Card.tsx / Card.css
│   │   ├── CardMarket.tsx / CardMarket.css
│   │   ├── GameArena.tsx / GameArena.css
│   │   ├── PlayerBoard.tsx / PlayerBoard.css
│   │   ├── PublicResourcePool.tsx / PublicResourcePool.css
│   │   └── Token.tsx / Token.css
│   ├── store/
│   │   └── gameSystemStore.ts # Zustand store for game state
│   ├── App.tsx            # Root component
│   └── main.tsx           # Entry point
├── progress.txt           # Task completion log
└── tasks.json            # Detailed task tracking
```

## Component Responsibilities

### 1. `GameArena`
- **Role**: The main layout container for the game.
- **Implementation**:
  - Uses a 12-column CSS Grid layout (`GameArena.css`).
  - Splits the screen into `sidebar` (col-span-3), `main-area` (col-span-7), and `patron-area` (col-span-2).
  - Handles responsive layout switching to a single column on screens <= 1024px.

### 2. `PlayerBoard`
- **Role**: Displays the state of a player (Current Player or Opponent).
- **Implementation**:
  - Supports `full` and `summary` view modes.
  - Opponents default to `summary` mode to save space, expandable on click.
  - Displays name, prestige (shield shape), resources (balls), and bonuses (squares) in a 2x6 matrix.
  - Highlights active player with a gold glow and breathing arrow `▶`.

### 3. `CardMarket`
- **Role**: Displays the decks and available cards for purchase.
- **Implementation**:
  - Renders rows for different tiers (Tier 3, Tier 2, Tier 1).
  - Each row contains a deck and up to 4 cards.
  - Uses flexbox row layout.

### 4. `Card`
- **Role**: Represents an individual Splendor card.
- **Implementation**:
  - Thematic design with parchment background and tier-specific borders.
  - Displays cost at the bottom anchored in a dark band.
  - Displays bonus type as a diamond-shaped gem in the top right.
  - High-density layout with enlarged cost icons for readability.

### 5. `PublicResourcePool`
- **Role**: Displays the shared pool of tokens available for players to take.
- **Implementation**:
  - Centered layout of tokens.
  - Displays count for each resource type.

### 6. `Token`
- **Role**: Reusable component for rendering resources (gems/gold).
- **Implementation**:
  - Skeuomorphic design with radial gradients and a crescent specular highlight to simulate glass/gem texture.
  - Desaturated colors (Emerald, Deep Blue) to fit the Dark Fantasy theme.

## State Management

- **`gameSystemStore`**: A Zustand store that holds the global game state, including:
  - Player inventories (tokens, bonuses, prestige).
  - Market state (available cards, deck counts).
  - Public pool resource counts.
  - Active player index.

## Recent Refinements (Phase 3)

We completed 20 specific UI/UX refinements focused on:
- **Information Density**: Compressing layout, removing redundant text.
- **Material Aesthetics**: Adding highlights to tokens, thickness to decks, diamond gems to cards.
- **Layout Constraints**: Fixing alignment, preventing grid overflow, reserving space for Patrons.
