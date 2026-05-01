# Project Standards: BG3 Splendor

All developers and subagents MUST adhere to these standards to maintain the integrity of the game's engine and UI.

## 1. Coding Standards

### React & Zustand
- **Selective Subscriptions**: Never use `const state = useGameStateStore()`. Always use selectors: `const players = useGameStateStore(s => s.players)`.
- **Action-Bus Only**: Never update state directly via `setState` in components for gameplay logic. Always use `dispatchAction`.
- **Refs for Animation**: Use `useRef` and `framer-motion` for smooth, high-performance visual effects.

### CSS & Styling
- **Material Variables**: Use CSS variables for all thematic elements.
    - Colors: `--color-gold`, `--color-bg-obsidian`, etc.
    - Textures: `--color-parchment`.
- **Tailwind Restraint**: Avoid hardcoding hex codes in Tailwind classes (e.g., `text-[#d4af37]`). Use `text-gold` or `text-gold-light` instead.

### Asset Access
- **Repository Pattern**: Never import images directly into components. Use `AssetRepository.getArt(assetId)`.

## 2. Distributed System Protocol

- **Sequence Guard**: Every state mutation MUST increment the `sequenceNumber`.
- **Passive Heartbeat**: The Host window MUST emit a full state sync every 5 seconds to catch up late joiners or missed packets.
- **Session Filtering**: All socket messages MUST include a `sessionId` to prevent echo loops.

## 3. Testing Standards

- **Rule Integrity**: All business logic in `src/domain/` MUST have corresponding unit tests in `*.test.ts`.
- **Multiplayer QA**: New networking features MUST be verified using a Playwright stress test that simulates at least 2 windows.
- **Contract-First Development**: Use the `llm-contract-workflow` for all significant feature adds or bug fixes.
