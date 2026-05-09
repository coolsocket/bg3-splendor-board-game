---
name: bg3-refactor-harness
description: Use this skill when refactoring the BG3 Splendor codebase, especially when moving logic from Components/Stores to the Domain layer. It ensures functional parity using the Refactor Gate.
---

# BG3 Refactor Harness Protocol

This skill enforces a "Safe-by-Construction" refactoring workflow. You MUST use this before committing any structural changes.

## The 3-Step Strategy

### 1. AST Structural Mapping
- **Action**: Before moving code, use `lsp_get_document_symbols` to map dependencies.
- **Goal**: Identify all call sites of the logic you are about to move.
- **Verification**: Ensure no `ANY` types or broken imports remain.

### 2. Domain Test Parity
- **Action**: If logic is moving to `src/domain`, it MUST have a corresponding test in `src/domain/*.test.ts`.
- **Goal**: Functional parity. The logic must behave IDENTICALLY in its new location.
- **Harness**: Run `node scripts/refactor-gate.mjs` to verify.

### 3. Shadow Refactoring Workflow
- **Step A**: Duplicate logic to the new location.
- **Step B**: Point tests/components to the NEW location while keeping the OLD logic intact (as a comment or backup).
- **Step C**: Once `refactor-gate.mjs` passes, delete the old logic.

## The Refactor Gate (Enforcement)

You are FORBIDDEN from committing refactored code unless the Refactor Gate passes.

```bash
node scripts/refactor-gate.mjs
```

### Gate Failure Scenarios:
- **TSC Fails**: You broke the AST. Fix the types/imports.
- **Vitest Fails**: You changed the game rules. Revert the logic change.
- **Layer Leak**: You imported Store/UI into Domain. Refactor to pass pure data only.
