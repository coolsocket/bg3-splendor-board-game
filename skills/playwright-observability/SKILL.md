# Skill: Playwright Observability & E2E Testing

This skill establishes the methodology for using **Playwright** as a headless observability and End-to-End (E2E) testing probe within the BG3 Splendor project.

## Core Philosophy (Traceability & Verifiability)
Based on the Global Strategy (`gemini.md`) **Rule #1 (Traceability)** and **Rule #3 (Verifiable Outcomes)**, complex UI state machines (like Zustand combined with React transitions) cannot be fully validated by unit tests alone. When addressing bugs related to multi-step user interactions or browser-level API integration (e.g., Web Audio API, Canvas rendering), we must deploy a headless browser probe to simulate exact user workflows and intercept console telemetry.

## Why Playwright?
1. **Real Browser Engine**: It runs an actual Chromium/WebKit/Firefox engine, capturing native DOM errors, Audio Context failures, and rendering glitches that Node.js unit tests (Vitest) cannot see.
2. **State Injection**: By exposing `window.__ZUSTAND_STORE__`, Playwright can instantly manipulate the global state (e.g., injecting 8 tokens into a player's inventory) to test highly specific edge cases without needing to click through 20 turns of gameplay.
3. **Console Telemetry**: It acts as a receiver for `[AudioEngine]` or specific UI debug logs, verifying internal system health during the automated run.

## Workflow Integration

When resolving complex UI/UX bugs, follow this standard procedure:

1. **Expose State**: Ensure the target state manager is accessible to the window in non-production builds (e.g., `window.__ZUSTAND_STORE__ = useGameStateStore;`).
2. **Write the Probe**: Create a `.mjs` script in this directory utilizing the `playwright` module.
3. **Simulate Edge Case**:
    - Launch browser with necessary flags (e.g., `--autoplay-policy=no-user-gesture-required`).
    - Navigate to `http://localhost:4173`.
    - Inject the necessary state via `page.evaluate()`.
    - Perform the `page.click()` interactions.
    - Assert the presence of expected UI elements (e.g., `page.isVisible('.text-red-400')`).
    - Catch and report any `page.on('pageerror')` or `page.on('console')` outputs.
4. **Execute**: Run `node .skill/playwright-observability/YOUR_TEST.mjs`.

## Included Probes

- **`test_audio_debug.mjs`**: Validates the Web Audio API initialization, decodes all MP3 files via Howler.js, and ensures no DOM Exceptions occur during rapid interaction.
- **`test_token_limit.mjs`**: Injects exactly 8 tokens, simulates a "Take 3" action, and verifies that the complex "Discard Tokens" UI modal successfully mounts and completes the turn cycle.

## Execution Command
To run an observability probe, ensure the preview server is active, then execute:
```bash
# Start server in one terminal
npm run preview -- --port 4173

# Run probe in another terminal
node .skill/playwright-observability/test_token_limit.mjs
```