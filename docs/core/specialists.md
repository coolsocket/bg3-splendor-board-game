# Specialist Agent Registry: BG3 Splendor

To manage complexity and ensure industrial-grade quality, we delegate specialized tasks to specific "Roles". Each role carries its own set of tools and "Quality Gates" (Hooks).

## 1. Specialist Roles

| Role | Name | Primary Mission | Tools | Specific Hooks |
| :--- | :--- | :--- | :--- | :--- |
| **Stylist** | `visual-auditor` | Cleanup hardcoded CSS, unify materials. | `grep`, `regex-replace` | **CSS Guard**: Blocks hex codes in `.tsx`. |
| **SyncExpert** | `distributed-tester` | Verify Action-Bus and Sequence integrity. | `packet-injector` | **Seq Guard**: Rejects non-incrementing states. |
| **Librarian** | `doc-solidifier` | Ensure READMEs and docs are in sync with code. | `markdown-lint` | **Dead Link Check**: Scans for broken file refs. |

## 2. Granular Hook Mechanism (A)

Since Gemini CLI hooks are globally scoped, we use a **"Role-Marker"** pattern:

1.  **Activation**: When calling `invoke_agent`, the prompt mandates: `"First, write 'Stylist' to .gemini/current_role"`.
2.  **Execution**: The global hook (`after_edit_hook.cjs`) reads this file.
3.  **Branching**:
    - If `role === 'Stylist'`, it runs the expensive CSS linter.
    - If `role === null` (Main Agent), it only runs syntax checks.

## 3. The Test Interceptor (B)

To prevent "Laziness" in test selection, the TDD workflow now includes a **Physical Constraint Check**:

- **Rule**: If `git diff` shows changes in `src/components/`, the `2_plan.md` MUST contain a `tests/llm_probes/*.mjs` (Playwright) entry.
- **Enforcement**: The TDD Pre-Commit Hook will scan `2_plan.md`. If it detects UI changes without a physical probe, the commit is **Physically Blocked**.

## 4. Subagent Prompt Transparency

To see what a subagent is "thinking", we can use the following command to query the CLI configuration (if available) or ask the helper:

```bash
# How to query CLI policies
gemini policy list
```
*Note: Subagents typically inherit the Global GEMINI.md but have an internal "System Directive" that focuses them on specific tool use (e.g. `codebase_investigator` is biased toward `grep` and `read_file`).*
