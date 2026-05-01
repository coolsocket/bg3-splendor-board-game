# Plan: Separate Counts and Jergal Alias

## 1. Create Probe
Write `test_counts.mjs` to inject a state where Gale has 1 Radiant Gem token and 1 Radiant Gem card. It will then evaluate the DOM to find `[data-testid="token-count-RADIANT_GEM"]` and `[data-testid="card-count-RADIANT_GEM"]`. It will also check `window.__ASSET_REPOSITORY__.getArt('jergal_(withers)')`.

## 2. Implement Changes
- In `src/components/ResourceStack.tsx`, replace the `<div data-testid="total-power-*">` with a wrapper containing the two count badges.
- Always render the `UnifiedToken`, and use `totalPower === 0 ? 'opacity-30 grayscale' : 'drop-shadow-lg'` classes.
- In `src/repositories/assetRepository.ts`, attach `AssetRepository` to `window` for testing purposes, and add the alias mapping logic.

## 3. Verify
Run probe. Verify RED -> fix -> GREEN.