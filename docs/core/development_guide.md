# BG3 Splendor: The Grimoire of Development

This guide serves as the ultimate manual for extending and maintaining the BG3 Splendor framework.

## 1. The Asset ID Protocol (AIP)
To ensure visual stability, assets are never referenced by display name.
- **Contract**: Every card and patron must have an `assetId` (e.g., `isobel`).
- **Resolution**: UI components call `AssetRepository.getArt(assetId)`, which automatically resolves to `src/assets/cards/isobel.png`.
- **Constraint**: Digital illustrations MUST be `360x360` pixels to fit the physical card frame.

## 2. Synchronization Architecture
The game uses a **Local Multi-Window Broadcast System**.
- **The Sync ID**: Every state change generates a timestamped `lastActionId`.
- **Anti-Echo**: Windows ignore incoming messages where `lastActionId` matches their current local ID.
- **Preference Isolation**: Local keys (e.g., `language`) are filtered out during synchronization to allow Gale and Astarion to have different UI settings in the same game.

## 3. Physical Component Guidelines
- **Nesting**: Do not simplify DIV structures. Layers are required for shadows and blend modes.
- **Glows**: Interactive elements should use `animate-card-breathe` (CSS) to signal validity.
- **Centralized Constants**: All UI widths, heights, and margins MUST be pulled from `src/config/gameConfig.ts`.

## 4. Lore-Accurate Logging
Logs are not just text; they are "Chronicle Entries".
- **Format**: All events are stored as JSON strings in `EventLogStore`.
- **Translation**: The `EventLog` component parses these JSON strings on the fly, translating card names and actions into the user's local language.

## 5. Adding New Content
1.  **Generate Asset**: Place a `360x360` PNG in `src/assets/cards/`.
2.  **Define Template**: Add a entry to `src/data/cardData.ts` with a matching `assetId`.
3.  **Localize**: Add the Lore description and Display Name to `src/data/translations.ts`.
