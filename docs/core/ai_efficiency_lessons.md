# AI Engineering: Lessons Learned & Telemetry Strategy

## 1. The Power of Micro-Telemetry
**Observation:** Adding `performance.now()` to the subagent gateway revealed that visual AST checks took <2ms, while TypeScript compilation took ~500ms.
**Lesson:** We must not guess where the bottlenecks are. Detailed logging allows us to ruthlessly optimize our verification pipelines.

## 2. Granular AST Verification
**Observation:** The gateway rejected a valid UI fix because it found *existing* hardcoded colors in the same file. This forced a refactor but slowed down the immediate task.
**Lesson:** Verifiers must differentiate between "newly introduced violations" and "legacy debt." 
**Improvement:** Implement diff-aware AST parsing (e.g., parsing the output of `git diff --unified=0` to only flag violations on newly added/modified lines).

## 3. The Orphan Import Trap
**Observation:** A subagent deleted a component (`SyncStatus`) but failed to remove its `import` statement in `App.tsx`. The verifier passed because it only ran `tsc` loosely or skipped global linkage checks.
**Lesson:** Subagents lack global spatial awareness. 
**Improvement:** The gateway must run a strict, global dependency graph check (like `tsc --noEmit` on the whole project) before allowing a commit, even if the subagent only modified one file.

## 4. Subagent Isolation (The Black Hole)
**Observation:** Delegating iterative UI tweaks to the `generalist` subagent kept the main conversation history clean and significantly reduced token bloat.
**Lesson:** The main agent should orchestrate and verify, never iterate on low-level DOM/CSS changes directly.

## 5. Contract-Driven Testing vs. Human Prose
**Observation:** We rarely consulted the human-readable text in `docs/LLM_log/`.
**Lesson:** Documentation for AI must be executable. 
**Improvement:** Future plans in `2_plan.md` must be replaced by Playwright `.mjs` scripts or AST assertions. The definition of done is a passing test, not a checked box in a markdown file.
