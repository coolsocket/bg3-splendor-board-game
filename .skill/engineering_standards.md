# Engineering Standard: Adding New Assets & Logic

## 1. Physical Component Integrity
When creating or modifying components:
- Always use the `CardBase` and `Modal` (with appropriate variants).
- Never use direct Tailwind colors for theme-critical elements. Use variables like `var(--color-bg-underdark)`.
- Maintain the nested layer structure required for physical shadows.

## 2. Localization First
- Every new UI string must be added to both `ZH` and `EN` objects in `src/data/translations.ts`.
- Use the `t.key` pattern in React components.

## 3. Structured Actions
- Do not modify state directly in hooks.
- Use `ActionResult` patterns from `domain/actions.ts`.
- All logs must be JSON-structured: `{ player, action, target, details }`.

## 4. Multi-window Simulation
- Keep local state (UI toggles, language) separate from global state (Game state).
- Use `usePlayerStore` to identify the "Local Player" of the current window.
