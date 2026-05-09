# Contract: Fix Out-of-Turn Card Actions

## Context (Entry)
The user reported a bug where the local player (e.g., Player 1) can interact with cards (buying or reserving them) even when it is not their turn (e.g., when it is Player 2's turn). This allows them to act on behalf of other players or disrupt the turn order.

## Definition of Done (Exit)
1. **Automated Probe (`3_probes/test_out_of_turn.mjs`)**: A Playwright script that logs in as Player 1 (Gale), completes their turn (passing the turn to Player 2), and then attempts to click a card to buy/reserve it. 
2. **Assertion**: The probe must verify that the click is intercepted or ignored (the card action modal does not open, or the action does not proceed), leaving the game state unchanged. The probe should exit with 0 when the protection is successfully confirmed.