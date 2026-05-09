# Contract: Maximize Market Layout

## Context (Entry)
The user requested that the entire Card Market and the cards within it should be larger, filling up the available space in the middle of the screen. Currently, the market is constrained by a maximum width, which prevents the cards from scaling up to fill the central area on larger screens.

## Definition of Done (Exit)
1. **Automated Probe (`tests/llm_probes/20260424_maximize_market_layout/test_market_size.mjs`)**: A script that launches the game and measures the width of the `.card-market` container (or the `CardMarket` wrapper element) to ensure it expands beyond the previous 820px limit when running in a wide viewport.
2. **Implementation**:
    - Update `GAME_CONFIG.UI.MARKET_MAX_WIDTH` in `src/config/gameConfig.ts` to `1400` (or `100%` if converted to string) to allow maximum expansion.
    - Ensure the CSS Grid in `MarketRow.tsx` still functions properly and scales the cards.
3. **Assertion**: The probe exits with 0 if the measured width is significantly larger than 820px on a wide window.