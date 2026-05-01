# Contract-Driven Subagent Delegation

When dispatching subagents (e.g., `generalist`, `Stylist`), the main agent MUST NOT rely on manual, post-execution line-by-line verification. This defeats the context-saving purpose of delegation.

Instead, follow the **Pre-defined Verifiable Results (PVR)** pattern.

## The Protocol

1.  **Define the Goal**: State what needs to be changed.
2.  **Define the Guardrails**: Remind the subagent of the architectural rules (e.g., "Do not use Tailwind hex codes").
3.  **Define the Verifiable Exit Condition**: The subagent MUST run `node scripts/subagent-verify.mjs` to prove its work is correct BEFORE terminating.
4.  **Git Commit Handover**: Once verified, the subagent MUST commit its changes (`git add .` and `git commit -m "feat/fix: ..."`) before terminating. The main agent reviews the git history, not raw code.

## Example Prompts

**Bad Prompt (Requires manual review):**
> "Fix the alignment of the red coin and make the breathing effect stronger."

**Good Prompt (Contract-Driven):**
> "Fix the red coin alignment and breathing effect.
> **Exit Conditions (You must execute these before terminating):**
> 1. Run `node scripts/subagent-verify.mjs`. This tool analyzes your uncommitted diffs and verifies syntax, visual purity, and layer integrity.
> 2. You MUST receive the 'ALL CHECKS PASSED' message. If it fails, fix your code and run it again.
> 3. Once passed, run `git add .` and `git commit -m "fix(ui): align red coin and enhance breathing"`.
> Include the commit hash in your termination report."

## Subagent Verify Tool (`scripts/subagent-verify.mjs`)
This is a dedicated CLI tool built for subagents. It automatically detects uncommitted Git changes and runs:
1. **Targeted Syntax Check**: Ensures `npm run check` passes.
2. **Visual Audit**: Scans modified UI files for prohibited hardcoded hex colors.
3. **Layer Integrity**: Scans modified Domain files for prohibited imports (e.g., React, Zustand).

## Benefits
- **Zero Main-Agent Overhead**: The main agent acts purely as an orchestrator and doesn't need to waste turns running `grep` or `read_file` to check the subagent's homework.
- **Self-Correcting Subagents**: If the exit condition fails during the subagent's run, the subagent will automatically attempt to fix its own mistakes before reporting back.
