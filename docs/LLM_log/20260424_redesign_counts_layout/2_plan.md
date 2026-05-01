# Plan: Redesign Resource Counts Layout

## 1. Create Probe
Write `test_layout.mjs` to inject a state where Gale has 1 token and 1 card.
It will select `[data-testid="resource-col-RADIANT_GEM"]` (which needs to be added).
It will verify that the first child is the card count, the second child is the gem icon, and the third child is the token count.

## 2. Refactor `ResourceStack.tsx`
- Add `data-testid={\`resource-col-\${type}\`}` to the main wrapper of each column.
- Move the card count logic to the top:
```tsx
            {/* Engine (Cards) - Metallic Box Above */}
            <div className={`flex items-center justify-center w-6 h-5 rounded-sm border-[1.5px] border-[#bf953f] bg-gradient-to-b from-[#4a3b2c] to-[#2a1d12] shadow-[0_2px_4px_rgba(0,0,0,0.8),inset_0_1px_2px_rgba(255,255,255,0.2)] mb-1 z-20 ${cardCount > 0 ? 'text-[#f5e6c4]' : 'text-gray-500 opacity-60 grayscale'}`} data-testid={`card-count-${type}`}>
              <span className="text-[12px] font-bold font-fantasy leading-none drop-shadow-md">{cardCount}</span>
            </div>
```
- Middle: Main resource icon (`UnifiedToken`).
- Move the token count logic below:
```tsx
            {/* Wallet (Tokens) - Circle Below */}
            <div className={`flex items-center justify-center w-5 h-5 rounded-full border-[1.5px] border-[#e2e8f0] bg-gradient-to-b from-[#1e293b] to-[#0f172a] shadow-[0_2px_4px_rgba(0,0,0,0.8)] mt-1 mb-1 z-20 ${tokenCount > 0 ? 'text-[#e2e8f0]' : 'text-gray-600 opacity-60 grayscale'}`} data-testid={`token-count-${type}`}>
              <span className="text-[11px] font-bold font-fantasy leading-none">{tokenCount}</span>
            </div>
```

## 3. Verify
Run the Playwright probe to ensure it passes (GREEN).