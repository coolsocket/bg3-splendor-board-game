# Plan: Remove Redundant Market Boxes

## 1. Clean `GameArena.tsx`
Find the middle column div:
```tsx
<div className="flex flex-col gap-4 p-4 rounded-lg shadow-[0_0_20px_rgba(181,138,62,0.1),inset_0_0_50px_rgba(0,0,0,0.8),0_10px_30px_rgba(0,0,0,0.5)] border border-[rgba(181,138,62,0.2)] min-h-0 bg-[#503c28]/30" style={{ backgroundImage: 'radial-gradient(circle at center, rgba(80, 60, 40, 0.3) 0%, rgba(5, 3, 2, 0.95) 100%)' }}>
```
Change it to just:
```tsx
<div className="flex flex-col flex-grow min-h-0 relative">
```
(We'll let the child decide padding if needed, or maybe no padding so it fills completely).

## 2. Clean `CardMarket.tsx`
Find the outer div:
```tsx
<div 
  className="flex flex-col gap-2 p-4 bg-bg-obsidian backdrop-blur-sm rounded-lg border border-gold-dark/40 shadow-heavy items-center w-full mx-auto"
  style={{ maxWidth: GAME_CONFIG.UI.MARKET_MAX_WIDTH }}
>
```
Change it to:
```tsx
<div 
  className="flex flex-col gap-2 items-center w-full mx-auto h-full justify-center"
  style={{ maxWidth: GAME_CONFIG.UI.MARKET_MAX_WIDTH }}
>
```
This removes the dark box, the border, the shadow, and the padding, letting the cards float naturally on the main arena background.

## 3. Create Probe
The probe `test_market_style.mjs` will load the page, locate the `.card-market` equivalent (we will query by role="heading" or similar), traverse up to its parents, and assert that `bg-bg-obsidian` and the heavy inline `style` with `radial-gradient` are gone.