# UI Components Layer

This directory contains the UI components and their specific styles. It represents the presentational layer of the application.

## Main Files

-   `GameArena.tsx`: The main container component for the game area.
-   `PlayerBoard.tsx`: Displays the state and resources of a player.
-   `Card.tsx`: Displays a game card with its costs, points, and effects.
-   `Token.tsx`: Displays a resource token.
-   `CardMarket.tsx`: Displays the market of available cards.
-   `PublicResourcePool.tsx`: Displays the available resources for players to take.
-   `*.css`: Scoped styles for each component.

## Architectural Role

The UI Layer is responsible for presentation and user interaction handling.
-   It should be "dumb" where possible, relying on data from the stores (`src/store`).
-   It reads from the store and dispatches actions to the store, not calculating game logic directly.
-   Generic UI elements like `Token`, `PrestigeBadge`, and `Card` should be as generic as possible, accepting props for customization.
-   Colors and spacing use CSS variables defined in `src/variables.css` to allow easy reskinning.

Refer to `implementation_plan.md` for the industrialization principles regarding the UI Layer.
