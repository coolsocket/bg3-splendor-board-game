# Contract: Codebase as a CLI (Stage 1 - Components)

## Context (Entry)
To solve the "Context Bloat" and "Knowledge Decay" problems, we are transforming the `src/components` directory into a self-describing entity. Instead of reading full `.tsx` files to understand visual materials or dependencies, the agent will use a specialized CLI tool.

## Definition of Done (Exit)
1. **Pilot Annotation**: `UnifiedToken.tsx` and `Card.tsx` are annotated with `@component`, `@material`, and `@atomic` tags.
2. **CLI Infrastructure**: `scripts/bg3-ops.mjs` is implemented with a `components --materials` command.
3. **Verification**: Running `node scripts/bg3-ops.mjs components --info` returns a提炼后的 (refined) summary of the material system without leaking the entire source code into context.
4. **Self-Healing**: A basic check ensures that if a component uses a hardcoded hex color, the CLI flags it.
