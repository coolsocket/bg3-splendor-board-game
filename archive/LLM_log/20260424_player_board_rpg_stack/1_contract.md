# Contract: Player Board RPG Stack Refactor

## Context (Entry)
The current `PlayerBoard` displays tokens and acquired cards separately, requiring the player to manually calculate their total purchasing power for each color. The user wants to change this to an "RPG Inventory Stack" style: group assets by color, stack the cards beneath the tokens, and display a prominent "Total Power" number for each color.

## Definition of Done (Exit)
1. **Automated Probe (`tests/llm_probes/20260424_player_board_rpg_stack/test_player_board.mjs`)**: A Playwright script that injects specific tokens and acquired cards into Player 1's state (e.g., 2 Radiant Gem tokens and 3 Radiant Gem cards).
2. **Implementation**:
    - Refactor `PlayerBoard.tsx` (and its subcomponents like `ResourceMatrix`) to group by the 6 standard token types.
    - Each group column will display the total power at the top (tokens + card bonuses).
    - It will display the tokens, and the acquired cards of that color stacked (partially overlapping) to save space.
3. **Assertion**: The probe will evaluate the DOM of the player board, finding the total power element for a specific color and verifying it displays the correct sum (e.g., 5). The probe exits with 0 on success.