# Contract: Remove Redundant Market Boxes

## Context (Entry)
The user feels that the central Card Market looks like a "big box" and wants the cards to naturally fill the entire middle area. This is caused by heavily styled, nested container `div`s in both `GameArena.tsx` and `CardMarket.tsx` that add unnecessary padding, borders, and dark backgrounds, squeezing the cards into a smaller visual space and making it look like a "box within a box".

## Definition of Done (Exit)
1. **Automated Probe (`tests/llm_probes/20260424_remove_market_boxes/test_market_style.mjs`)**: A Playwright script that inspects the parent containers of the market cards.
2. **Implementation**:
    - Remove the `bg-[#503c28]/30`, `border`, `shadow`, and radial gradient from the middle column wrapper in `GameArena.tsx`.
    - Remove the `bg-bg-obsidian`, `backdrop-blur-sm`, `border-gold-dark/40`, and `p-4` from the root wrapper in `CardMarket.tsx`.
    - Allow the cards and deck stacks to float naturally on the main game background, utilizing the full available width and height without artificial padding constraints.
3. **Assertion**: The probe verifies that the wrapper elements no longer contain these restrictive box-styling classes, exiting with 0.