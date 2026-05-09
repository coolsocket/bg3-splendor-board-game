# bg3-ops Standards

When adding or modifying operational scripts:
1. Operations must be stateless and idempotent.
2. Do not use external runtime dependencies beyond `typescript` and built-in Node modules.
3. Output must clearly indicate pass/fail status using exit codes (0 for success, 1 for failure).