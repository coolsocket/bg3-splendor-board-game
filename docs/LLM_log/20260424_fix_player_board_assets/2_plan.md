# Plan: Fix Player Board Assets

## 1. Probe
Create `test_board_details.mjs` to:
- Inject an acquired card to a player's board.
- Check if `[data-testid="total-power-TRUE_SOUL_TADPOLE"]` exists even if it's 0.
- Check if `.card-stack-image` (or an `img` inside the stacked cards) exists and has a valid `src`.

## 2. Refactor `ResourceStack.tsx`
- Remove: `if (totalPower === 0 && type === 'TRUE_SOUL_TADPOLE') return null;`
- Import `AssetRepository`.
- Inside the card stack map:
```tsx
  const imgUrl = AssetRepository.getArt(card.assetId);
  return (
    <div key={`${card.id}-${idx}`} ...>
       {imgUrl ? (
           <img src={imgUrl} alt={card.name} className="w-full h-full object-cover origin-top scale-125 card-stack-image" />
       ) : (
           <div className={`w-full h-full border-t-[3px] ...`} />
       )}
    </div>
  )
```

## 3. Verify
Run probe. Expected to fail (RED). Apply fix. Expected to pass (GREEN).