# Contract-Driven Subagent Delegation

When dispatching subagents (e.g., `generalist`, `Stylist`), the main agent MUST NOT rely on manual, post-execution line-by-line verification. This defeats the context-saving purpose of delegation.

Instead, follow the **Pre-defined Verifiable Results (PVR)** pattern.

## The Protocol

1.  **Define the Goal**: State what needs to be changed.
2.  **Define the Guardrails**: Remind the subagent of the architectural rules (e.g., "Do not use Tailwind hex codes").
3.  **Task Completion Gateway**: The subagent MUST run `node scripts/subagent-complete.mjs "commit message"` to finish the task. This script automatically runs the AST verifications and, if successful, creates a git commit.

## Example Prompts

**Bad Prompt (Requires manual review):**
> "Fix the alignment of the red coin and make the breathing effect stronger."

**Good Prompt (Contract-Driven):**
> "Fix the red coin alignment and breathing effect.
> **Exit Conditions (You must execute these before terminating):**
> 1. Run `node scripts/subagent-complete.mjs "fix(ui): align red coin and enhance breathing"`.
> 2. You MUST receive the '[GATEWAY-ACCEPTED]' message. If it rejects your code, fix the errors and try again.
> Include the final output of this gateway script in your termination report."

## Subagent Tooling
- **`scripts/subagent-verify.mjs`**: Analyzes uncommitted diffs for syntax, visual purity, and layer integrity.
- **`scripts/subagent-complete.mjs`**: The unified gateway. Runs `verify`, stages all changes (`git add .`), and executes `git commit`.

## Benefits
- **Zero Main-Agent Overhead**: The main agent acts purely as an orchestrator and doesn't need to waste turns running `grep` or `read_file` to check the subagent's homework.
- **Self-Correcting Subagents**: If the exit condition fails during the subagent's run, the subagent will automatically attempt to fix its own mistakes before reporting back.
