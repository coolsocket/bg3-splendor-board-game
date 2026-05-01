# BG3 Splendor: Digital Board Game Framework

A high-fidelity implementation of the Splendor board game mechanics, reimagined within the dark fantasy universe of Baldur's Gate 3.

## 🏛️ Engineering Philosophy (Sink-in Protocol)
This project adheres to the **"Physicality First"** directive. UI elements are designed as nested physical objects rather than flat web components.
- **Visual Depth**: Layered DIVs with custom blend modes and shadow offsets.
- **Atmospheric Logic**: Dynamic lighting (CSS variables) reflects game state (e.g., affordability glows).
- **Single Source of Truth**: All UI dimensions are configuration-driven via `GAME_CONFIG.ts`.

## 🛠️ Core Technologies
- **State**: Zustand with multi-window synchronization via `BroadcastChannel`.
- **Logic**: Immutable domain rules with complex tie-breaking and phase management.
- **Assets**: Digital illustrations generated via Vertex AI, indexed by a strict `assetId` contract.
- **Localization**: Full ZH/EN support with structured event logging.

## 📂 Project Structure
- `src/domain`: Pure game logic and rule enforcement.
- `src/store`: Global state management and synchronization logic.
- `src/components/common`: Physical UI component library.
- `src/config`: Centralized balance and layout parameters.
- `.skill`: Solidified project capabilities (Asset generation, Style research).

## 🚀 Development Standards
Refer to `AGENTS.md` for strict coding standards regarding visual integrity, localization, and state isolation.
EOF
