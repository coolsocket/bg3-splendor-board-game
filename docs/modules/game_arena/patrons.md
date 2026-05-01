# Module: Patrons (贵族/赞助者)

Patrons are special cards that players can acquire automatically when they meet specific resource requirements. They are usually displayed on the right side of the screen.

## UI & Art (UI 与美术)

### Aesthetic
- **Material**: Similar to cards but often smaller or with a distinct frame to stand out as "Noble" or "Divine".
- **Cost Tokens**: Small tokens (`w-6 h-6`) representing the required resources to attract the patron.

### Layout
- Vertically stacked on the side of the arena.

## Interactions & Usage (交互与使用)

### Acquisition
- Checked automatically at the end of a player's turn.
- If conditions are met, the patron is awarded to the player.

## Code & Abstractions (代码与抽象)

### Components
- **[PatronSlot.tsx](file:///Users/yehao/Desktop/Code/Claude/bg3_splendor_game_2/src/components/PatronSlot.tsx)**: Renders a single patron slot.

### API Contract (Props)

#### `PatronSlot`
| Prop | Type | Description |
| :--- | :--- | :--- |
| `patron` | `Patron` | The patron data object. |
| `children` | `React.ReactNode` | Optional content (e.g., for empty state). |

### Store Context (外部状态依赖)
- **`usePublicStore`**: Read by `GameArena.tsx` to list `availablePatrons`. `PatronSlot` itself is a pure presentation component.

