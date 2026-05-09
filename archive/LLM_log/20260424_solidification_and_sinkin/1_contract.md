# Contract: Workspace Solidification (Sinkin)

## Context (Entry)
After implementing the Action-Bus sync and GCS migration, the documentation is outdated and some components still contain minor hardcoded strings. The `sinkin` subagent previously failed to complete its audit due to turn limits.

## Definition of Done (Exit)
1. **Documentation Update**:
    - `docs/core/architecture.md`: Reflect Socket.io and Action-Bus logic.
    - `docs/core/state_management.md`: Reflect `sequenceNumber` and `isAnimationLocked`.
    - `docs/core/deployment_and_infrastructure.md`: Reflect Hong Kong region and GCS CDN strategy.
2. **Code Decoupling**:
    - `src/data/translations.ts`: Add missing strings found in `TurnAnnouncer` and `SyncStatus`.
    - `TurnAnnouncer.tsx` & `SyncStatus.tsx`: Use localized strings.
3. **Directory Knowledge**:
    - Ensure all major `src/` subdirectories have a `README.md`.
4. **Verification**:
    - `npm run build` passes.
    - A simple probe `test_i18n.mjs` confirms localized strings appear in the DOM.
