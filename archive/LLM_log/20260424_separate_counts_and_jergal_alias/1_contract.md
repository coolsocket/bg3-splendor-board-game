# Contract: Separate Counts and Aliased Jergal Image

## Context (Entry)
The user found that displaying a single "total power" number is confusing. They want the token count and permanent asset (card) count clearly separated visually. Furthermore, the empty columns should still display a dimmed version of the resource token so the user knows which column corresponds to which resource type. Lastly, the user shouldn't have to hit "Reset" just to fix the old `jergal_(withers)` state issue; the app should handle the legacy asset ID gracefully.

## Definition of Done (Exit)
1. **Automated Probe (`tests/llm_probes/20260424_separate_counts_and_jergal_alias/test_counts.mjs`)**: A script that verifies the presence of separated count elements and the resolution of the old Jergal asset ID.
2. **Implementation**:
    - `src/components/ResourceStack.tsx`: Replace the `totalPower` number with a two-part badge system showing token count (with a circle icon) and card count (with a rectangle icon). Ensure the `UnifiedToken` is always rendered, applying `opacity-30 grayscale` when `totalPower === 0`.
    - `src/repositories/assetRepository.ts`: Add an alias so that requesting `jergal_(withers)` resolves to the same image as `jergal`.
3. **Assertion**: The probe ensures that `[data-testid="token-count-RADIANT_GEM"]` and `[data-testid="card-count-RADIANT_GEM"]` exist, and that `AssetRepository.getArt('jergal_(withers)')` returns a valid URL.