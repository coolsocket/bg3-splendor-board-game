# Plan: Fix Player UI & Glow Scopes

## 1. Glow Scope Fix (`Card.tsx`)
Currently, `isAffordable` determines the glow effect.
Change: Only apply the glow effect (the `shadow-[0_0_30px_rgba(212,175,55,0.8)]`, `ring-[#ffd700]`, and `mix-blend-screen` classes) if BOTH `isAffordable` AND `isMyTurn` are true. This ensures a player only sees glowing cards on their own turn.

## 2. Name Contrast (`PlayerBoard.tsx`)
Change: Locate the element rendering `playerName`. Wrap it or add classes like `drop-shadow-[0_2px_4px_rgba(0,0,0,1)]` and `bg-black/40 px-2 py-0.5 rounded` to ensure readability over varied background images.

## 3. "YOU" Badge (`PlayerBoard.tsx`)
Change: Since `PlayerBoard` receives `isCurrentPlayer` (meaning it's their turn), it currently does NOT know if it's the *local* player. We need to pass a new prop `isLocalPlayer: boolean` from `GameArena.tsx` to `PlayerBoard.tsx`.
If `isLocalPlayer` is true, render a golden badge next to the name: `<span className="ml-2 text-xs font-bold bg-[#bf953f] text-black px-1.5 py-0.5 rounded uppercase tracking-wider shadow-md">You</span>`.