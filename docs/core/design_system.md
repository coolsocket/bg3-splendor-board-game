# BG3 Splendor Design System & Component Specification

## I. Introduction (引言)

This document defines the visual standards and component specifications for the "BG3 x Splendor" project. It prioritizes **"Physicality First"**—the philosophy that UI elements should feel like real-world objects from the Baldur's Gate 3 universe (parchment, metal, stone) rather than flat digital windows.

---

## II. Atomic UI Norms (原子 UI 规范)

### 1. Color Palette (色彩系统)
We avoid pure black (#000000) and pure white (#FFFFFF).
- **Backgrounds**: `bg-underdark` (Deep cool grey-blue), `bg-bg-obsidian` (Translucent dark stone).
- **Primary Text**: `text-parchment` (#E8E2D2), aged paper color.
- **Accents**: `accent-gold` (#BF953F), antique gold with metallic reflections.
- **Glows**: `color-gold-glow` (for affordable actions), `color-arcane-glow` (for magical/reserve actions).

### 2. Physical Layout SSOT (单一事实来源)
All critical UI dimensions are centralized in `src/config/gameConfig.ts`. 
- **Grid Layout**: 
  - Left Sidebar: `GAME_CONFIG.UI.SIDEBAR_WIDTH_FULL` (280px).
  - Right Sidebar: 360px.
  - Center: `GAME_CONFIG.UI.MARKET_MAX_WIDTH` (820px).
- **Component Sizes**: Token sizes (sm, md, lg) and Prestige Badge sizes are defined in config to ensure global scalability.

### 3. Atmospheric Lighting (氛围光效)
Interactive elements use dynamic CSS animations instead of simple state changes:
- `animate-card-breathe`: A slow pulsing gold glow for cards the player can afford.
- `animate-arcane-shimmer`: A blue/purple flicker for reserved or magical items.

---

## III. Physical Textures & CSS Classes (材质与 CSS)

### 1. The .bg3-panel Standard
The core container for all UI panels.
- **Texture**: Uses `panel_border.png` as a `border-image`.
- **Shadow**: `shadow-heavy` (Multi-layered offset shadows) to simulate height on a tabletop.

### 2. Parchment Depth
Modals and card details use the `parchment_texture.png` with specific blend modes (`mix-blend-multiply` or `overlay`) to ensure the digital image feels "printed" on the paper.

---

## IV. Core Component Specifications (核心组件规格)

### 1. <Card /> Component
The card is the primary physical object. 
- **Contract**: Every card MUST provide an `assetId` for the `AssetRepository` to fetch the high-fidelity illustration.
- **Action Dock**: The bottom part of the card mimics a physical slot or pedestal where interaction buttons are "embedded".

```typescript
interface CardProps {
  id: string;
  assetId: string;       // Unique ID for asset lookup (e.g., 'dammon')
  tier: 1 | 2 | 3;
  prestigePoints: number;
  providedBonus: ResourceType;
  cost: Record<ResourceType, number>;
  isAffordable: boolean; // Triggers atmospheric breathe animation
  onInteract: (action: 'buy' | 'reserve' | 'select', cardId: string) => void;
}
```

### 2. <UnifiedToken /> Component
A 3D simulation of a gem or tadpole.
- **Layers**: Combines a radial gradient, an asset image (e.g., `radiant_gem.png`), and a `mix-blend-multiply` filter to create volume.

---

## V. Industrialization Principles (工业化原则)

1.  **Pessimistic Boundary Defense**: Every container must have `overflow-hidden` or `min-w-0` to prevent layout explosions from dynamic localization strings (ZH is shorter, EN is longer).
2.  **Context-Obliviousness**: Components like `<Card />` do not set their own absolute widths; they adapt to the parent container (e.g., the `MarketRow` or `PlayerBoard` slot).
3.  **No In-Component Strings**: 100% of UI text must reside in `src/data/translations.ts`.
