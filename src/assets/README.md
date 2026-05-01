# Assets

This directory contains static assets used throughout the BG3 Splendor game.

## Overview

The assets include images, icons, and textures that define the visual style of the application, leaning towards a Baldur's Gate 3 / Dungeons & Dragons aesthetic.

## Folder Structure

- **`tokens/`**:
    - Contains all resource gems (e.g., `arcane_crystal.png`, `infernal_iron.png`, `radiant_gem.png`, `tadpole.png`).
- **`portraits/`**:
    - Character portraits (e.g., `astarion_portrait.png`, `gale_portrait.png`). Generated using a 1:1 format to fit into the `HeroAvatar.tsx` border frame.
- **`ui/`**:
    - General UI Elements like `dagger_cursor.png` and `parchment_texture.png`.

## Usage

These assets are typically imported into React components using Vite's asset handling.

Example:
```tsx
import astarionPortrait from '../../assets/portraits/astarion_portrait.png';
```
