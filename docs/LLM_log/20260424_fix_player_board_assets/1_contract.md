# Contract: Fix Resource Stack Details and Tadpole Visibility

## Context (Entry)
The user noticed that the stacked cards beneath the tokens only show colored blocks instead of actual card illustrations. Additionally, the True Soul Tadpole column completely disappears when empty, which the user dislikes. Finally, Jergal's image was missing because the old game state still holds `jergal_(withers)` in the active multiplayer game session instead of grabbing the newly updated `jergal` assetId.

## Definition of Done (Exit)
1. **Automated Probe (`tests/llm_probes/20260424_fix_player_board_assets/test_board_details.mjs`)**: A script that verifies tadpole is visible, card images render, and Jergal works.
2. **Implementation**:
    - In `src/components/ResourceStack.tsx`, remove the logic that hides `TRUE_SOUL_TADPOLE`.
    - In `src/components/ResourceStack.tsx`, import `AssetRepository` and render `<img src={AssetRepository.getArt(card.assetId)} />` instead of the placeholder colored div.
    - We must inform the user that a "Game Reset" is required for Jergal to appear, because the patron state is baked into the saved game state (which we will simulate in the probe by hitting "Reset").
3. **Assertion**: The probe ensures that the tadpole column exists even when empty, and that stacked cards have `<img src="...">` tags.