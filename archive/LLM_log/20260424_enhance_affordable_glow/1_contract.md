# Contract: Enhance Affordable Card Glow

## Context (Entry)
The user feels that the current "affordable" visual effect on cards (which indicates that a player can buy the card) is too weak. The current implementation relies on a subtle `animate-card-breathe` and standard border colors. The goal is to make the card visibly pop out with a strong, immersive glow and richer textures when it can be purchased.

## Definition of Done (Exit)
1. **Automated Probe (`3_probes/test_affordable_glow.mjs`)**: A Playwright script that injects massive resources into the active player's state (making all cards affordable) and verifies that the affordable cards now possess a new, high-intensity glow class (e.g., a specific strong box-shadow or ring effect that signifies affordability).
2. **Assertion**: The probe must locate at least one face-up card in the DOM that has `isAffordable` true and verify the presence of the enhanced visual CSS classes (`ring-[var(--color-gold)]` or a strong `shadow-[...rgba(255,215,0,...)]`). The probe should exit with 0.