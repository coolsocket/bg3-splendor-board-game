# Module: Player Board (玩家面板)

The Player Board provides a comprehensive view of a player's standing and assets.

## Physical Design
- **Material**: Encased in the `.bg3-panel` framework with gold studs and physical shadows.
- **Contextual Appearance**: 
  - **Active State**: Brightened with an inner gold glow.
  - **Inactive State**: Grayscale/Dimmed to 70% opacity to focus attention on the active player.

## View Modes
- **Full View**: Displays Name, Avatar, Resource Matrix (Wallet + Engine), Patrons, and Reserved Cards.
- **Summary View**: A collapsed version used for opponents to save space while still showing core stats (Points, Total Tokens).

## Key Features
- **Resource Matrix**: A 2x3 grid combining current tokens and permanent bonuses.
- **Interactive Tokens**: During the **Discard Phase**, tokens in the Matrix become clickable, allowing the player to select which gems to return to the bank.
- **Reserved Preview**: Hovering over a reserved card slot shows a high-fidelity preview of the card.

## Implementation Details
- **Component**: `src/components/PlayerBoard.tsx`.
- **Props**: Uses the `PlayerBoardProps` interface which includes `viewMode`, `isActive`, and `interactiveTokens`.
- **Optimization**: Uses `React.memo` and specific data mapping in `GameArena` to prevent unnecessary re-renders.
