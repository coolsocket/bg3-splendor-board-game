# Common Components & Animations

This directory contains reusable low-level UI elements and the core Animation & VFX engines for the application.

## Core UI Components
- `Avatar.tsx`: Standard character portrait component.
- `Button.tsx`: Themed button with various variants (primary, secondary, etc.).
- `Modal.tsx` & `Drawer.tsx`: Layout components for overlays and side panels.
- `CardBase.tsx`: Basic card layout used by both game cards and patrons.
- `ResourceIcon.tsx`: Small SVG icons for various game resources.

## Animation & VFX Engines

Following the Phase 10 Overhaul, this directory houses the highly-optimized physical animation engines. 

### 1. `CardFlight.tsx`
- **Purpose**: Handles the physical flight of cards from the market to the player's board or reserve.
- **Technology**: React & Framer Motion.
- **Features**: 
  - Simulates 3D space with `rotateX` and `rotateZ`.
  - Supports "Arcane Lock" (purple spinning magic circle) for reserves.
  - Supports "Searing Slam" (golden impact glow) for purchases.
  - Uses `circOut` and `circIn` non-linear easing for dynamic visual weight.

### 1.5. `PatronFlight.tsx` & `TurnAnnouncer.tsx`
- **`PatronFlight.tsx`**: Orchestrates epic 3D flight animations when a Patron visits a player, utilizing Hearthstone-like fast-slow-fast easing and complex flips to convey grandeur.
- **`TurnAnnouncer.tsx`**: Manages the 3-second turn transition focus, aggressively dimming inactive players while brightly highlighting the active player's board.

### 2. `TokenTransfer.tsx`
- **Purpose**: Handles the transfer of resource tokens (coins) and the global particle system.
- **Technology**: React/Framer Motion (for the coins) + Global Canvas Engine (for particles).
- **Features**:
  - Emits thematic elemental particles (smoke, leaves, shards).
  - Handles high-performance trails and impact shockwaves via Canvas.
  - Independent of the main React DOM tree to ensure 60FPS.

### 3. `animationConfig.ts`
- **Purpose**: The single source of truth for all animation magic numbers, physical constants, and colors.
- **Features**:
  - `ANIMATION_COLORS`: Defines the exact hex codes for resources, magic circles, and glows.
  - `PHYSICS_CONFIG`: Defines particle lifespans, transfer durations, and rigid cleanup timeouts to prevent memory leaks.

## Important Rule
**No hardcoding**: Do not hardcode colors or timeout durations directly in the `.tsx` components. Always import from `animationConfig.ts`.