# Plan: Remove Card Names from Standard View

## 1. Create Probe
Write `test_card_name_visibility.mjs` to launch the browser and assert that no `.card-name` elements exist within the market grid cards.

## 2. Refactor `Card.tsx`
Locate the block in the standard view return statement:
```tsx
          {/* Header (Overlay) */}
          <div className="absolute top-0 left-0 right-0 flex justify-start items-start p-1.5 z-20 bg-gradient-to-b from-black/80 to-transparent pointer-events-none h-8">
            {/* Gem (Bonus) top-left */}
            <UnifiedToken type={providedBonus} size="sm" className="ml-0.5 mt-0.5 scale-90" />
            {/* Name Banner */}
            <div className="flex-1 px-1 mt-1 text-center truncate">
              <span className="card-name text-[9px] font-bold font-fantasy text-[#E8E2D2] tracking-widest uppercase drop-shadow-md">
                {localizedName}
              </span>
            </div>
          </div>
```
Remove the Name Banner `div` entirely and restore the header to its previous simpler state:
```tsx
          {/* Header (Overlay) */}
          <div className="absolute top-0 left-0 right-0 flex justify-start items-start p-1.5 z-20 bg-gradient-to-b from-black/60 to-transparent pointer-events-none">
            {/* Gem (Bonus) top-left */}
            <UnifiedToken type={providedBonus} size="sm" className="ml-1.5 mt-1.5" />
          </div>
```

## 3. Verify
Run the Playwright probe to ensure it passes (GREEN).