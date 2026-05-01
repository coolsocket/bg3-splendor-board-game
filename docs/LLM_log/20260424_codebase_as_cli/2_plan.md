# Plan: Codebase as a CLI (Stage 1)

## 1. Annotate Components
Add metadata tags to `UnifiedToken.tsx` and `Card.tsx`.
- `@module`: Visual Atomic Unit
- `@material`: Used CSS variables (e.g., `--color-gold`)
- `@purity`: UI-only or has side effects.

## 2. Implement `bg3-ops.mjs`
- Create a Node.js CLI script using `yargs` or simple `process.argv`.
- Add a parser that scans files for `@` tags.
- Add a "Hardcode Auditor" that flags `#XXXXXX` in `.tsx` files.

## 3. Verify
Run `node scripts/bg3-ops.mjs components --info` and observe the context-efficient output.
