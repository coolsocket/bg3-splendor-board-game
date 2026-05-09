# Contract: Redesign Resource Counts Layout

## Context (Entry)
The user wants to refine the visual hierarchy of the resource stack on the Player Board. Instead of having both the token count and card count in a single box below the resource icon, they requested:
1. The permanent currency (card count) should be in a metallic box *above* the gem icon.
2. The physical currency (token count) should be in a circle *below* the gem icon.

## Definition of Done (Exit)
1. **Automated Probe (`tests/llm_probes/20260424_redesign_counts_layout/test_layout.mjs`)**: A script that verifies the new DOM structure (card count element comes before the gem icon element, token count element comes after).
2. **Implementation**:
    - Update `src/components/ResourceStack.tsx` to reorder the elements within the flex column.
    - Style the card count as a metallic box.
    - Style the token count as a circle.
3. **Assertion**: The probe checks the visual ordering of elements within `[data-testid="resource-col-RADIANT_GEM"]`.