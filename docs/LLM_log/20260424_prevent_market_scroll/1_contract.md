# Contract: Prevent Market Vertical Scrolling

## Context (Entry)
The previous change maximized the Card Market width to 100%, causing the cards to scale up. However, because their height is tied to their width (aspect ratio 2:3), wide-but-short screens cause the total height of the market to exceed the viewport, resulting in vertical scrolling. The user wants the cards to be as large as possible *without* exceeding the screen bounds and causing scrolling.

## Definition of Done (Exit)
1. **Automated Probe (`tests/llm_probes/20260424_prevent_market_scroll/test_no_scroll.mjs`)**: A script that loads the game in a wide but short viewport (e.g., 1920x800) and checks if the middle column or the window has a vertical scrollbar.
2. **Implementation**:
    - Modify `GAME_CONFIG.UI.MARKET_MAX_WIDTH` to use a viewport-height-aware CSS calculation (e.g., `min(100%, calc((100vh - 180px) * 1.1))`) so that the width is dynamically constrained by the available screen height.
    - Remove the `overflow-y-auto` from the middle column wrapper in `GameArena.tsx` and replace it with `overflow-hidden flex items-center justify-center` to perfectly center the board and prevent scrolling.
3. **Assertion**: The probe evaluates `scrollHeight > clientHeight` on the container. If scrolling is detected, it fails. On success, it exits with 0.