# Contract: Fix Player Name Visibility

## Context (Entry)
The user reported that despite the previous contrast improvements (adding a black background and text-shadow), the player name is still not visible on the UI. We need to physically inspect the DOM structure, CSS properties, and layout constraints (e.g., overflow, text-truncation, flexbox clipping) using a Playwright diagnostic script to find the root cause, and then apply a fix.

## Definition of Done (Exit)
1. **Automated Diagnostic Probe (`3_probes/inspect_dom.mjs`)**: A script that extracts the exact computed styles, bounding box, and HTML structure of the player name element to diagnose the issue.
2. **Automated Verification Probe (`3_probes/test_visibility.mjs`)**: After the fix, this probe must verify that the element has a non-zero width/height, is visible in the viewport, and its text content matches the player's name without being visually clipped to 0 pixels.
3. The probe must exit with 0 to prove the name is physically visible to the user.