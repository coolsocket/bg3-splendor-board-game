# Plan: Refine Player Name UI

## Changes
In `src/components/PlayerBoard.tsx`, I will remove `bg-black/80`, `px-2`, `py-0.5`, `rounded`, `border`, and `border-[#bf953f]/30` from the player name `div`'s `className`.
I will keep the `text-shadow` inline style which is: `1px 1px 3px rgba(0,0,0,1), 0 0 8px rgba(0,0,0,0.8)` to ensure it remains legible on complex backgrounds without needing a dedicated box.