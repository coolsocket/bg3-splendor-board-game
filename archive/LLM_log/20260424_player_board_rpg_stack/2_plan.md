# Plan: Player Board RPG Stack Refactor

## 1. Create Probe
Write `test_player_board.mjs` to inject a specific game state:
- Player 0 has 3 RADIANT_GEM tokens and 2 RADIANT_GEM cards.
- The probe will search for a data-testid or specific element within Player 0's board that represents the "Total RADIANT_GEM Power".
- It will assert that the value is `5` (3 + 2).

## 2. Refactor `PlayerBoard.tsx`
- Currently, `PlayerBoard` uses `<ResourceMatrix>` to display tokens and maps `ownedCards` horizontally.
- We will replace this with a new visual structure: a horizontal flex container with 6 columns (one for each resource type: Radiant Gem, Arcane Crystal, Nature's Blessing, Infernal Iron, Dark Quartz, True Soul Tadpole - though tadpole is usually wild, we might display it separately or next to them).
- For each column:
  - Top: A glowing number representing `totalPower = tokens[type] + cardBonuses[type]`.
  - Middle: The raw tokens of that type (e.g., using `UnifiedToken` stacked).
  - Bottom: The acquired cards providing that bonus, visually stacked (e.g., using `-mt-X` margins) to only show their top border.
- The "YOU" badge and name contrast from previous PRs must remain.
- The `viewMode="summary"` vs `viewMode="full"` will need to adapt. Summary can just show the total numbers.

## 3. Implement `ResourceColumn` component (Internal to PlayerBoard)
- Create a helper component to render this stack cleanly.

## 4. Update GameArena
- Ensure any props passed to `PlayerBoard` still work correctly.