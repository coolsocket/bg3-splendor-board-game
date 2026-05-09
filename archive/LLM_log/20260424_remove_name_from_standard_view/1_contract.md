# Contract: Remove Card Names from Standard View

## Context (Entry)
The user found that displaying the card name on every card in the standard grid view makes the UI too cluttered. The names should only be visible when the card is expanded into the detailed modal view (`isDetailed = true`).

## Definition of Done (Exit)
1. **Automated Probe (`tests/llm_probes/20260424_remove_name_from_standard_view/test_card_name_visibility.mjs`)**: A Playwright script that inspects the standard card grid in the market.
2. **Implementation**:
    - In `src/components/features/market/Card.tsx`, remove the `card-name` span and its wrapper from the standard render path (when `isDeck` is false and `isDetailed` is false).
    - Ensure the name still displays correctly in the `isDetailed` block.
3. **Assertion**: The probe will verify that `.card-name` elements do not exist inside standard `div[id^="card-"]` elements. The probe exits with 0 on success.