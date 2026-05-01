# Page: Game Arena (游戏主视区)

The Game Arena is the primary interface for BG3 Splendor. It is designed to emulate a physical tabletop in the Underdark.

## Layout Overview (布局概览)

The arena utilizes a three-column CSS Grid layout defined in `GAME_CONFIG.ts`:

1.  **Left Sidebar (Player Boards)**: 
    - Displays the active player at the top.
    - Lists opponent summaries below.
    - Controls for expanding opponent details.
2.  **Center Hub (Card Market)**:
    - The main tactical area displaying Tier 1, 2, and 3 cards.
    - Uses the `MarketRow` and `Card` components.
3.  **Right Sidebar (Management & Logistics)**:
    - **Turn Info**: Turn number and status bar.
    - **Patrons**: Powerful entities waiting for recruitment.
    - **Staging Area**: The temporary slot for unconfirmed token selections or discard tasks.
    - **Public Resource Pool**: The central bank of gems and tadpoles.

## Atmosphere & Depth
- **Cursor**: Custom "Dagger" cursor.
- **Layers**: Multiple fixed-position overlays for `TokenTransfer` and `CardFlight` animations to ensure visual continuity across components.
- **SSOT**: Layout values are strictly pulled from `GAME_CONFIG.UI`.
