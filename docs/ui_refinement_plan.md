# UI/UX Refinement Plan - Phase 3

This plan outlines 20 specific improvements to be made to the BG3 Splendor interface to enhance information density, layout constraints, and material rendering, moving from a "skeleton" to a polished product.

## I. Player Grid Fixes (Priority: High)
Focus on the `PlayerBoard` component, specifically the asset matrix and layout alignment.

1. **Fix Container Overflow**
   - **Action**: Ensure the asset matrix grid does not overflow its container. Add `overflow: hidden` or adjust grid width/padding.
   - **Target**: `PlayerBoard.css`

2. **Adjust Gap**
   - **Action**: Add vertical and horizontal gaps between grid items (`gap-y-2`, `gap-x-1` equivalent in CSS).
   - **Target**: `PlayerBoard.css` (.asset-matrix)

3. **Fix Contrast**
   - **Action**: Change text color of numbers inside light-colored tokens (Yellow/Light Blue) to dark, or add a strong text shadow/stroke.
   - **Target**: `PlayerBoard.css` or `Token.css`

4. **Shrink Squares (Bonus)**
   - **Action**: Reduce size of bonus squares to 70% of the token ball diameter to reduce visual weight.
   - **Target**: `PlayerBoard.css` (.bonus-item)

5. **Style Squares**
   - **Action**: Add border radius and inner glow/border to bonus squares to make them look like cut gems rather than flat divs.
   - **Target**: `PlayerBoard.css` (.bonus-item)

6. **Align Panels**
   - **Action**: Ensure Gale's panel is strictly left-aligned with Astarion's panel.
   - **Target**: `GameArena.css` or `PlayerBoard.css`

## II. Card Information Hierarchy
Focus on the `Card` component to remove noise and highlight core information.

7. **Remove Redundant Roman Numerals**
   - **Action**: Remove the large Roman numerals (Ⅲ, Ⅱ) that were added to the card (they are redundant with the deck tier).
   - **Target**: `Card.tsx` and `Card.css`

8. **Enlarge Cost Icons**
   - **Action**: Double the size of cost icons at the bottom of the card and bold the numbers.
   - **Target**: `Card.css` (.cost-item)

9. **Anchor Cost Bar**
   - **Action**: Create a dark background band at the very bottom of the card to anchor the cost icons neatly.
   - **Target**: `Card.css` (.card-footer or new cost bar container)

10. **Replace Top Right Badges**
    - **Action**: Replace text badges (AR, RA) with colored gem icons matching the bonus type.
    - **Target**: `Card.tsx` and `Card.css`

11. **Optimize Empty Card Placeholder**
    - **Action**: Remove "Card Image" text and add a faint faction logo (e.g., Absolute mark) or parchment crease texture.
    - **Target**: `Card.tsx` and `Card.css`

12. **重塑牌库的厚度 (Deck Thickness)**
    - **Action**: Add multiple box shadows to `.deck` to create a 3D stack effect (further enhancement).
    - **Target**: `CardMarket.css`

## III. Public Resource Pool & Materials
Focus on the `PublicResourcePool` and `Token` aesthetics.

13. **Center Content**
    - **Action**: Ensure all content in the public resource pool is absolutely centered within its container.
    - **Target**: `PublicResourcePool.css`

14. **Desaturate Colors**
    - **Action**: Tone down saturated colors (especially green and blue). Use emerald green and deep blue.
    - **Target**: `Token.css` or `PublicResourcePool.css`

15. **Enhance Skeuomorphism**
    - **Action**: Add a noise filter or a specular highlight (crescent shape) to tokens to simulate glass or gem texture instead of plastic.
    - **Target**: `Token.css`

## IV. Layout & State Cleanup
Focus on general layout and state indicators.

16. **Optimize Astarion Summary View**
    - **Action**: Change "Reserved Cards: 0" and "Total Tokens: 6" to a single line or use icons instead of text.
    - **Target**: `PlayerBoard.tsx`

17. **Soften Border Glow**
    - **Action**: Soften the strong purple border glow on Gale's panel (use diffuse ring effect).
    - **Target**: `PlayerBoard.css`

18. **Reconstruct Prestige Box**
    - **Action**: Replace the simple gold box with a ribbon or shield shape for the prestige score.
    - **Target**: `PlayerBoard.tsx` and `PlayerBoard.css`

19. **Active State Prominence**
    - **Action**: Make the active player's name glow or add a breathing arrow pointing to it instead of just the small hourglass.
    - **Target**: `PlayerBoard.tsx` and `PlayerBoard.css`

20. **Reserve Patron Space**
    - **Action**: Ensure a fixed column on the right is reserved for Patron cards.
    - **Target**: `GameArena.tsx` and `GameArena.css`
