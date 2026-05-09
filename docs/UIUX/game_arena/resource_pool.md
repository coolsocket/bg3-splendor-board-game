# Module: Public Resource Pool (公共资源池)

The Public Resource Pool is located at the top of the Game Arena. it holds the available tokens that players can take during their turn.

## UI & Art (UI 与美术)

### Aesthetic (视觉风格)
- **Dark Fantasy Tabletop**: The pool is rendered as a physical tray or slot on the table.
- **Material**: The background panel is styled as "translucent obsidian" or dark oak with a gold border (`border-[#bf953f]/40`).
- **Tokens**: Tokens are rendered as 3D spheres or coins using heavy radial/conic gradients and inner shadows to simulate volume and light reflection.
    - **Glow**: Active tokens have a subtle outer glow corresponding to their element color.

### Dimensions & Layout
- Tokens are displayed in a horizontal row (or grid if wrapped).
- Token sizes are locked to prevent distortion (e.g., `w-14 h-14` for medium, `w-20 h-20` for large in the main pool).

## Interactions & Usage (交互与使用)

### State Machine
- **Default**: Tokens show their full color and count.
- **Hover**: Token scales up slightly (`hover:scale-110`) and glow intensifies. Mouse cursor changes to pointer.
- **Disabled (Empty/Unavailable)**: When a token count reaches 0 or if the player cannot take it (e.g., limit reached), the token becomes grayscale (`filter grayscale-[100%]`) and dimmed (`opacity-50`).
- **Click**: Triggers a "take token" action and plays a sound effect (`take-token`). Triggers a flying animation towards the player's board.

### Wildcard (True Soul Tadpole)
- Located on the right, separated by a border.
- Has a distinct gold glow and special border.

## Code & Abstractions (代码与抽象)

### Components
- **[PublicResourcePool.tsx](file:///Users/yehao/Desktop/Code/Claude/bg3_splendor_game_2/src/components/PublicResourcePool.tsx)**: Container managing layout and fetching data.
- **[Token.tsx](file:///Users/yehao/Desktop/Code/Claude/bg3_splendor_game_2/src/components/Token.tsx)**: Atomic component for rendering a single token.

### API Contract (Props)

#### `PublicResourcePool`
| Prop | Type | Description |
| :--- | :--- | :--- |
| `onTokenClick` | `(type: ResourceType) => void` | Callback when a token is clicked. |
| `disabledTokens` | `ResourceType[]` | List of token types to disable. |

#### `Token`
| Prop | Type | Description |
| :--- | :--- | :--- |
| `type` | `ResourceType` | The element type (e.g., `RADIANT_GEM`). |
| `count` | `number` | Number to display. |
| `onClick` | `() => void` | Click handler. |
| `disabled` | `boolean` | Grayscale and dim if true. |
| `size` | `'sm' \| 'md' \| 'lg'` | Controls dimensions. |

### Store Context (外部状态依赖)
- **`usePublicStore`**: Reads `availableResources` to display counts.
- **`usePlayerStore`**: Reads player's current resources to check limits.

