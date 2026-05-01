# Plan: Maximize Market Layout

## 1. Modify Configuration
- Change `MARKET_MAX_WIDTH` in `src/config/gameConfig.ts` from `820` to `"100%"` (which requires updating the type from `number` to `number | string` or just changing it) or simply remove the constraint inside `CardMarket.tsx`.
- Let's change `MARKET_MAX_WIDTH: '100%'` in `src/config/gameConfig.ts`. Wait, if I change it to `100%`, it will scale infinitely, which might make cards look overly stretched on ultra-wide monitors. A generous limit like `1600` is safer, but `100%` with some padding in the parent is also fine since the parent is `1fr` bounded by sidebars. We will change `MARKET_MAX_WIDTH` to `'100%'` to fully fill the middle.

## 2. Probe Implementation
- Write `test_market_size.mjs` using Playwright.
- Set viewport size to 1920x1080.
- Navigate to the game.
- Measure the width of the `.bg-bg-obsidian` container inside `CardMarket.tsx` (it's the first child).
- Assert that its width is greater than 850px.

## 3. Apply Code Changes
- Use the `replace` tool to update `src/config/gameConfig.ts` and `src/components/features/market/CardMarket.tsx` if necessary.