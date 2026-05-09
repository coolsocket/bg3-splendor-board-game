# Plan: Enhance Affordable Card Glow

## Current State
In `src/components/features/market/Card.tsx`, the affordability styling is primarily handled by:
1. `getTierBorderClass`: Alters the border opacity (`border-[#d4af37]` vs `border-[#d4af37]/40`).
2. An overlay element at the bottom of the card: 
   `{isAffordable && !isDeck && ( <div className="absolute inset-0 rounded-md shadow-[inset_0_0_20px_rgba(212,175,55,0.5)] animate-pulse pointer-events-none z-20"></div> )}`
3. A shadow and `animate-card-breathe` class applied to the root element.

## Target State
To make the glow "sacred, cool, and prominent":
1. **Outer Glow**: Increase the intensity of the outer box shadow when `isAffordable` is true. We'll add `shadow-[0_0_25px_rgba(212,175,55,0.6)]` to make the card visibly radiate light on the board.
2. **Inner Glow Overlay**: Enhance the current subtle inset shadow overlay. We will make it a combination of a bright inner border and a radiant gradient:
   `shadow-[inset_0_0_30px_rgba(255,215,0,0.4),0_0_15px_rgba(255,215,0,0.5)] ring-2 ring-[#ffd700] ring-offset-2 ring-offset-black` (or something similarly intense but aesthetically pleasing within the BG3 theme).
3. **Pulsing Core**: We will add a mix-blend-screen overlay that pulses to give the card a magical "breathing" artifact feel.

## Implementation Steps
1. Write Playwright probe `test_affordable_glow.mjs`.
2. Inject tokens so cards become affordable.
3. Assert that the DOM element for the card contains the new high-intensity class string (e.g., `ring-[#ffd700]`).
4. Modify `Card.tsx` `render()` logic to use these enhanced classes when `isAffordable && !isDeck` is true.