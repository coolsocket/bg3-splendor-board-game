# Development Guardrails Standards

When modifying or adding new guardrails:
1. Guardrails must execute in less than 5000ms.
2. They must intercept the CI pipeline or pre-commit hooks, not just run passively.
3. Must use the standard logger `[REFACTOR-GATE]` format for output.