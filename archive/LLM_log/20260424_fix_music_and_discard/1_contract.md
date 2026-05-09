# Contract: Fix Discard Token Priority & Audio Playlist

## Context (Entry)
1. **Discard Priority**: When a user exceeds 10 tokens and is forced to discard tokens (`discardRequired > 0`), they should be strictly prohibited from buying or reserving cards. Currently, the UI might allow them to interact with cards.
2. **Audio Playlist**: The user reported that only 2 BGM tracks are looping instead of 6. Need to ensure the playlist logic correctly rotates through all 6 songs.

## Definition of Done (Exit)
1. **Automated Probe (`tests/llm_probes/20260424_fix_music_and_discard/test_discard_priority.mjs`)**: A script that injects state where a player has 11 tokens (discard required = 1), and attempts to click the 'Acquire' button on an affordable card.
2. **Assertions**:
    - The probe verifies that when `discardRequired > 0`, the 'Acquire' button is disabled.
    - (For Audio, we will inspect the audio store to confirm the BGM_PLAYLIST array is correctly 6 items, and we will double-check Howler loading mechanisms).
    - The probe must exit with 0.