# Plan: Epic Turn Transition

## 1. Create Probe
Write `test_announcer_visibility.mjs` to:
- Open the game.
- Manually trigger an `announce-turn` event.
- Check for `[data-testid="epic-announcer"]`.
- Verify it has the `cinematic-mode` class or similar.

## 2. Refactor `TurnAnnouncer.tsx`
- Wrap the entire component in an `AnimatePresence`.
- Add a full-screen background with a radial gradient (vignette).
- Add two horizontal "Golden Ribbons" that start in the center and move up/down.
- Animate the text with `letterSpacing` and `opacity`.
- Add "Cinematic Particles" (CSS-based embers).

## 3. Update CSS
Add custom animations to `index.css` if needed for the light sweep.

## 4. Verify
Run probe. Verify RED -> fix -> GREEN.