# Contract: Refine Player Name UI

## Context (Entry)
The user found the recently added black background box behind the player name to be visually unappealing ("a bit ugly"). They requested that the name should just lay naturally on the background without a dedicated box, relying purely on strong text contrast/shadows for visibility.

## Definition of Done (Exit)
1. **Automated Probe (`3_probes/test_natural_name.mjs`)**: A script that inspects the player name element on the Player Board.
2. **Assertion**: Verify that the DOM element for the player name no longer contains background or border utility classes (like `bg-black/80` or `border-[#bf953f]/30`) but still retains the explicit bright text colors (`text-[#4ade80]` / `text-[#E8E2D2]`) and the inline `text-shadow` style. The probe should exit with 0.