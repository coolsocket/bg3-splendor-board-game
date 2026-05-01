# Plan: Workspace Solidification (Sinkin)

## 1. Create Probe
Write `test_i18n.mjs` to check for specific localized strings (like "Initiative Gained" translation) in the DOM.

## 2. Update Documentation
- Rewrite `architecture.md` and `state_management.md` to match the new reality.
- Update `deployment_and_infrastructure.md`.

## 3. Decouple Code
- Update `translations.ts` (ZH and EN).
- Refactor `TurnAnnouncer.tsx` and `SyncStatus.tsx`.

## 4. Final Build Check
Run `npm run build`.
