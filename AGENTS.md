# BG3 Splendor Project: Engineering Standards & Source of Truth

## 1. The Golden Rule of Physicality
This project prioritizes **Physical Object Quality** over standard web UI patterns. 
- **Layers over Simplicity**: DIV layers are needed for shadows and blend modes. Do not flatten.
- **Color Discipline**: Use CSS variables (e.g., `--color-bg-underdark`) instead of Tailwind color utilities for core UI.
- **Shadow Standards**: Use `shadow-heavy` or custom multi-layer box-shadows to simulate depth.

## 2. Global State & Sync
- **Store**: `useGameStateStore` (Zustand).
- **Versioning**: Each action generates a `lastActionId` to prevent race conditions during `BroadcastChannel` sync.
- **Isolation**: Local preferences (language, notifications) are NEVER synced.

## 3. Localization Protocol
- All UI strings MUST live in `src/data/translations.ts`.
- **Structured Logs**: Send logs as JSON: `{"player": "...", "action": "buy", "target": "..."}`. The `EventLog` component parses these based on the current user's language.

## 4. Notification System
- **DO NOT USE alert()**.
- Use `useNotificationStore.getState().notify(message, type)`.
- Notifications follow the physical design: gold borders, translucent backdrops.

## 5. Layout Configuration
- All critical UI dimensions (sidebar width, card sizes) are centralized in `src/config/gameConfig.ts`.
- Components MUST consume these values to maintain responsive integrity.

## 6. Asset & Data Law
- **Single Point of Image Truth**: Components never construct asset paths. They MUST use `AssetRepository.getArt(assetId)`.
- **assetId Consistency**: Data in `cardData.ts` MUST provide an `assetId` (derived from lowercase name with underscores).
- **Physical Ratio**: Detailed card views MUST respect the `360x360` illustration ratio defined in `GAME_CONFIG`.
