# Plan: Fix Player Name Visibility

## 1. Diagnose the Issue
The name text might be:
- Clipped due to flexbox constraints (e.g. `flex-shrink: 1`, `min-width: 0`, overflow hidden).
- Font color might be transparent.
- Z-index might be behind another element.
- The `text-emerald-400` vs `text-red-400` logic might be resolving poorly against `bg-black/60`.
- The new `flex flex-col items-start gap-1 flex-grow` container might be crushing the `h2`.

I will run `inspect_dom.mjs` to dump the computed style and bounding box of the `h2` element.

## 2. Implement Fix
Based on the diagnostic result:
- I will likely need to adjust the flexbox container in `PlayerBoard.tsx` (e.g., ensuring `min-w-0` doesn't clip it to 0 width, or `flex-shrink-0` on the text itself).
- Ensure the text has a solid contrast color (like pure white `#E8E2D2` or bright gold `#f5e6c4` instead of emerald/red which might be too dark, and rely on the active state borders or the "YOU" badge for state indication).

## 3. Verify
Run `test_visibility.mjs` to assert the width > 0, height > 0, and visibility.