# Contract: Fix Missing Image & Display Card Names

## Context (Entry)
1. The user reported that "The Final Scribe" (Jergal) is missing its image. This is due to a mismatch between the `assetId` (`jergal_(withers)`) and the actual file name (`jergal.png`).
2. The user also reported that cards do not display their names on the UI. They should have their names displayed at the top or inside the card frame to easily identify characters/locations.

## Definition of Done (Exit)
1. **Automated Probe (`tests/llm_probes/20260424_fix_card_names_and_jergal/test_fixes.mjs`)**: A script that verifies the fixes in the DOM.
2. **Implementation**:
    - Update `src/data/cardData.ts` to set `assetId: 'jergal'` for Jergal.
    - Update `src/components/features/market/Card.tsx` to render the `cardName` (localized via `t.card_names[name] || name`) elegantly near the top or bottom of the card frame. 
3. **Assertion**: The probe must check that the Jergal patron object in the DOM no longer has a broken asset ID, and that card elements contain text nodes with valid card names. The probe must exit with 0.