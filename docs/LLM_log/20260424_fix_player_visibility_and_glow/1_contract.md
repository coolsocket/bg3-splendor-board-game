# Contract: Fix Player UI & Glow Scopes

## Context (Entry)
1. **Glow Scope**: The new enhanced affordable card glow currently shows up based on the active player's resources. In a multi-window setup, this means Player B sees cards glowing that Player A can afford during Player A's turn, which is confusing. The glow should only appear if the local player is the active player (i.e., `isMyTurn` is true).
2. **Name Contrast**: Player names on the player boards are hard to read against certain backgrounds.
3. **Local Player Identification**: It's hard to quickly tell which player board belongs to the local player. A "YOU" badge is needed.

## Definition of Done (Exit)
1. **Automated Probe (`3_probes/test_player_ui.mjs`)**: A Playwright script that logs in as Gale, but forces the game state such that it is Astarion's turn (Gale is not the active player).
2. **Assertions**:
   - The probe verifies that no cards have the enhanced affordable glow (because it is not Gale's turn).
   - The probe verifies that Gale's `PlayerBoard` contains a distinct "YOU" identifier (e.g., a specific data-testid or text element).
   - The probe verifies that the player name element has strong contrast CSS classes (e.g., strong drop-shadow or text-shadow).
   - The probe exits with 0 upon success.