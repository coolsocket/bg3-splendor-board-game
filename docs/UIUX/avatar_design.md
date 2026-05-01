# BG3 Splendor Avatar & Token Design

This document covers the UI/UX design choices and implementations for player avatars and card assets.

## 1. HeroAvatar Component (`HeroAvatar.tsx`)
The `HeroAvatar` component replaces the generic circular avatars with a rich, dark fantasy token design that perfectly encapsulates the BG3 aesthetic.

### Visual Architecture:
- **Base Layer (1:1 Ratio)**: A strictly cropped 1:1 image container with a deep void-black fallback background. The image automatically scales up to remove borders.
- **Filigree Frame**: A handcrafted SVG overlay acting as a physical "tabletop token" frame. It uses a metallic bronze linear gradient (`#8b6534` -> `#b38728`) to simulate physical depth.
- **Gothic Corners**: The SVG features intricate bat and gothic architecture motifs at the four corners outside the main circle cutout.
- **Runic Text Path**: 
  - A glowing red neon text (`#ff6666`) curves perfectly around the inside of the circular frame. 
  - It utilizes an SVG `<textPath>` linked to a hidden circular path.
  - A custom `<filter id="neon-glow">` creates a cinematic volumetric light bleed, ensuring the text feels deeply rooted in dark magic (reminiscent of the Absolute's or Astarion's motifs).

## 2. Card Detail Modals
When examining a card in the market, the UI shifts to a detailed view:
- **Prestige Badge Anchoring**: The prestige point shield (Prestige Badge) is heavily z-indexed and absolutely positioned to strictly overlap the **top-right corner** of the illustration box, not the outer card frame. This preserves internal rectangular layouts.
- **Action Dock (Console Base)**: The bottom section features an inset-shadowed dark panel acting as a "physical base" for the card. The margin above this dock has been increased to ensure resource costs never overlap.
- **Missing Resources Tooltip**:
  - The "Acquire" button features a strict `group/acquire` hover area.
  - If a card cannot be bought, hovering reveals a dark-red pill container showing **exactly** which resources are missing.
  - It uses native, vividly colored `UnifiedToken` assets with `disableBlend={true}` to prevent the `mix-blend-multiply` CSS rule from turning the tokens black against the dark tooltip background.
