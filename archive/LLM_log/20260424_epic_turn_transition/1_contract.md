# Contract: Epic Turn Transition

## Context (Entry)
The user feels the current turn transitions are lacklustre and want something "cooler" and "more epic/mythic" similar to the cinematic feel of BG3 or the game's victory screen.

## Definition of Done (Exit)
1. **Implementation**:
    - `TurnAnnouncer.tsx`:
        - Add cinematic letterboxing (top/bottom dark bars).
        - Implement a "center-split" animation where golden borders expand to reveal the name.
        - Add a vignette and subtle animated "embers" or "mist".
        - Use dramatic text entrance with a light sweep.
    - `usePlayerActions.ts`: Ensure timing for animation lock is consistent with the new epic length (3s).
2. **Automated Probe (`tests/llm_probes/20260424_epic_turn_transition/test_announcer_visibility.mjs`)**: Verifies that the turn announcer element appears in the DOM and has the expected classes for epic styling.
3. **Assertion**: Probe confirms the presence of the announcer during a simulated turn change.