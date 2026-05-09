---
name: bg3-ops
description: Use this skill to verify architectural decoupling, audit visual components, and sync the knowledge graph.
---

# bg3-ops

This skill provides a set of automated operations to verify the structural integrity of the BG3 Splendor codebase.

## Purpose
- **Architecture Police**: Verifies that the Domain layer is perfectly decoupled from Store and UI layers.
- **Visual Auditor**: Finds hardcoded hex colors in UI components to ensure CSS variables are used for physical aesthetics.
- **Sync Knowledge Graph**: Updates the component dependency graph.

## Usage
Run the script using Node.js:

```bash
node .gemini/skills/bg3-ops/scripts/bg3-ops.mjs [verify | audit | sync | digest]
```

## Troubleshooting
If you encounter `Error: Cannot find module 'typescript'`, run `npm install --no-save typescript`.