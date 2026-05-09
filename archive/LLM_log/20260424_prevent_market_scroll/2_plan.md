# Plan: Prevent Market Vertical Scrolling

## 1. Create Probe
Write `test_no_scroll.mjs` to launch a browser at `1920x800` resolution. It will navigate to the game, find the middle column wrapper (the parent of `CardMarket`), and assert that its `scrollHeight` is not greater than its `clientHeight` (meaning no scrollbar is active).

## 2. Update Configuration
In `src/config/gameConfig.ts`:
Change `MARKET_MAX_WIDTH: '100%'` to `MARKET_MAX_WIDTH: 'min(100%, calc((100vh - 160px) * 1.15))'`. 
This formula bounds the width based on the viewport height so that the 3 rows of cards never grow tall enough to trigger scrolling.

## 3. Update Layout Wrapper
In `src/components/GameArena.tsx`:
Find the wrapper for the Card Market:
```tsx
        <div className="flex flex-col flex-grow min-h-0 relative">
          <div className="h-full overflow-y-auto pb-6"><CardMarket onCardInteract={handleCardInteractWithModal} /></div>
        </div>
```
And replace it with:
```tsx
        <div className="flex flex-col flex-grow min-h-0 relative overflow-hidden items-center justify-center">
          <div className="w-full"><CardMarket onCardInteract={handleCardInteractWithModal} /></div>
        </div>
```
This entirely disables scrolling in the middle column and ensures the market is perfectly vertically and horizontally centered.