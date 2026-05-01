# BG3 Splendor Project Documentation

Welcome to the documentation for the *Baldur's Gate 3 x Splendor* digital board game project.

This documentation is organized into two main areas: **Core Systems** (high-level architecture and rules) and **Modules** (page and component-specific details).

## 📂 Directory Structure

### [Core Systems](file:///Users/yehao/Desktop/Code/Claude/bg3_splendor_game_2/docs/core/)
High-level documents covering architecture, design system, and game rules.
- **[Architecture & State Topology](file:///Users/yehao/Desktop/Code/Claude/bg3_splendor_game_2/docs/core/architecture.md)**: Layered architecture, data flow, and store structures.
- **[Data Flow](file:///Users/yehao/Desktop/Code/Claude/bg3_splendor_game_2/docs/core/data_flow.md)**: Sequence diagrams for key actions.
- **[State Management](file:///Users/yehao/Desktop/Code/Claude/bg3_splendor_game_2/docs/core/state_management.md)**: Memory map and selector optimization.
- **[Design System](file:///Users/yehao/Desktop/Code/Claude/bg3_splendor_game_2/docs/core/design_system.md)**: Colors, typography, and visual guidelines.
- **[Rulebook](file:///Users/yehao/Desktop/Code/Claude/bg3_splendor_game_2/docs/core/rulebook.md)**: Domain logic and game rules with code mappings.
- **[Onboarding Guide](file:///Users/yehao/Desktop/Code/Claude/bg3_splendor_game_2/docs/core/onboarding.md)**: Quick start and debug tips.
- **[Troubleshooting](file:///Users/yehao/Desktop/Code/Claude/bg3_splendor_game_2/docs/core/troubleshooting.md)**: Symptom to cause mapping.

### [Modules](file:///Users/yehao/Desktop/Code/Claude/bg3_splendor_game_2/docs/modules/)
Feature-centric documentation organized by page and component.

#### Game Arena (主游戏界面)
- **[Overview](file:///Users/yehao/Desktop/Code/Claude/bg3_splendor_game_2/docs/modules/game_arena/overview.md)**: Layout and atmosphere of the main page.
- **[Public Resource Pool](file:///Users/yehao/Desktop/Code/Claude/bg3_splendor_game_2/docs/modules/game_arena/resource_pool.md)**: UI, interactions, and code for the token pool.
- **[Card Market](file:///Users/yehao/Desktop/Code/Claude/bg3_splendor_game_2/docs/modules/game_arena/card_market.md)**: Grid of cards, selection, and purchase flow.
- **[Player Board](file:///Users/yehao/Desktop/Code/Claude/bg3_splendor_game_2/docs/modules/game_arena/player_board.md)**: Player assets, avatar, and reserved cards.
- **[Patrons](file:///Users/yehao/Desktop/Code/Claude/bg3_splendor_game_2/docs/modules/game_arena/patrons.md)**: Noble cards and acquisition logic.

---

## 🤝 Contributing
When adding new features or modifying existing ones, please ensure that the corresponding documentation in `modules/` or `core/` is updated to reflect the changes.