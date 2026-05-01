# Skill: TDD Enforcement Hook (Physical AI Barrier)

This skill documents the programmatic hook mechanism deployed in this workspace to physically enforce the **LLM Contract Workflow** on AI Agents.

## The Mechanism
Simply telling an AI to "write tests first" in a prompt (like `agents.md`) is often ignored when the AI takes shortcuts. To solve this, we leverage the Gemini CLI's **`BeforeTool` Hook Architecture**.

### 1. The Configuration (`.gemini/settings.json`)
The hook intercepts any AI attempt to execute the `write_file` or `replace` tools, routing them to our enforcement script:
```json
{
  "hooks": {
    "BeforeTool": [
      {
        "matcher": "write_file|replace",
        "hooks": [
          {
            "name": "enforce-test-driven",
            "type": "command",
            "command": "node .gemini/hooks/enforce_tests.cjs"
          }
        ]
      }
    ]
  }
}
```

### 2. The Exclusions (The "Sandbox" Areas)
The hook uses a **Blacklist** approach. It prevents edits to core business logic unless tests are run. However, the AI is freely permitted to modify files in specific exemption zones without triggering the TDD lock. These include:
- `docs/LLM_log/`: For drafting contracts and plans.
- `.skill/` and `.gemini/`: For configuring the AI's own tools and rules.
- `scripts/`: A dedicated safe zone for temporary bash, python, or node.js utility scripts.
- Test files (`*.test.*`, `*.spec.*`, `test_*.mjs`): For writing the actual probes (the "RED" phase).
- Configuration files (`.json`, `.toml`, `.yaml`, `.md`).

### 3. The Enforcer Script (`.gemini/hooks/enforce_tests.cjs`)
When the AI attempts to modify any non-exempt file (e.g., source code in `src/`), this script acts as an impenetrable gateway. It performs two strict checks:

**Check A: File System Integrity (The Contract)**
It scans `docs/LLM_log/` to find the most recently created task folder. If the folder does not exist, or if it is missing any of the required artifacts (`1_contract.md`, `2_plan.md`), the hook returns a hard `deny`. (Note: Probes are now decoupled and must be placed in `tests/llm_probes/`).
*Hook Error Example:*
`🔒 Code change blocked: Missing [1_contract.md, 2_plan.md] in latest LLM_log. Please refer to the 'llm-contract-workflow' skill.`

**Check B: Execution Verification (The Transcript / The RED Phase)**
Even if the files exist, the hook parses the AI's current session history (`transcript`). If the AI has *not* executed a test command (`vitest`, `playwright`, `tests/llm_probes/...`) via the `run_shell_command` tool in the current session to verify its intent, the script returns a hard `deny`. This physically enforces the "RED" phase of TDD—the AI must write the probe in `tests/llm_probes/` and run the failing test before it can write the code to fix it.
*Hook Error Example:*
`🔒 Code change blocked: Test probe not executed. Review the 'llm-contract-workflow' skill.`

### Result
The AI is physically blocked from modifying source code and receives a red system error forcing it to step back, establish the contract in `docs/LLM_log/`, and execute an automated test first. This ensures 100% adherence to the project's verifiability and traceability standards.