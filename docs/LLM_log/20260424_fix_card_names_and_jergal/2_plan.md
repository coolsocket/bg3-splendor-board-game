# Plan: Fix Card Names and Jergal Asset

## 1. Create Probe
Write `test_fixes.mjs` to:
- Evaluate the DOM to check if the patron "Jergal (Withers)" has a correctly mapped `src` (it shouldn't be missing/fallback text).
- Check the cards on the board to ensure they have an internal `div` or `span` containing text like "戴蒙", "塞夫洛" (Chinese translation) or their English names.

## 2. Fix Jergal AssetId
- In `src/data/cardData.ts`, find `id: 'p_jergal'` and change `assetId: 'jergal_(withers)'` to `assetId: 'jergal'`.

## 3. Render Card Name
- In `src/components/features/market/Card.tsx`, add a banner at the top (or bottom) of the card's inner content.
- Use a `div` with `absolute top-0 w-full bg-black/60 text-center text-xs font-bold text-[#E8E2D2] px-1 truncate`.
- Look up the localized name: `const localizedName = t.card_names?.[name] || name;`
- Insert `{localizedName}` inside the card frame.

## 4. Run and Verify
- Run the probe to get RED.
- Apply fixes.
- Rebuild.
- Run the probe to get GREEN.