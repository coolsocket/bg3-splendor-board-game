# Subagent Usage Standards

When using subagents in this project:
1. **Never** let subagents interact with the UI or block the main event loop.
2. **Always** require subagents to run `subagent-verify.mjs` before completing a task.
3. Subagents must use the Action-Bus for any state changes, never mutating the store directly.