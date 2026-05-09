# Contract: Fix Card Market Header Visibility

## Context (Entry)
The user reported that the title text in the Card Market (the text between the two horizontal lines) is invisible, looking like a black box. This is likely the exact same issue we faced with the Player Board name: a global CSS `h2` rule is overriding the Tailwind text color classes, forcing the text to render in a dark color that blends into the background.

## Definition of Done (Exit)
1. **Automated Probe (`3_probes/test_market_header.mjs`)**: A script that inspects the Card Market header element.
2. **Assertion**: Verify that the text color is bright/legible (e.g. not `rgb(8, 6, 13)` or transparent) and that it's no longer using an `h2` tag that could conflict with global styles. The probe should exit with 0.