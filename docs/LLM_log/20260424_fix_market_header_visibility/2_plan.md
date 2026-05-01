# Plan: Fix Card Market Header Visibility

## Changes
In `src/components/features/market/CardMarket.tsx`:
1. Change the `<h2 className="...">` tag to a `<div className="..." role="heading" aria-level={2}>` tag to decouple it from global `h2` CSS overrides (`index.css`) while preserving semantics.
2. The existing `text-[#f5e6c4]` Tailwind class should now properly apply and render the text in bright gold.