# Onboarding Guide (新人入门指南)

Welcome to the BG3 Splendor project! This guide will help you get the project running in 30 minutes and guide you on how to make your first change and start debugging.

## 1. Environment Setup (环境准备)

- **Node.js**: Ensure you have Node.js installed (v18+ recommended).
- **Package Manager**: `npm` (comes with Node.js).

## 2. Getting Started (快速启动)

1.  **Clone the repository** (if you haven't already).
2.  **Install dependencies**:
    ```bash
    npm install
    ```
3.  **Start the development server**:
    ```bash
    npm run dev
    ```
4.  **Open the browser**: Navigate to `http://localhost:5173` (or the port shown in your terminal).

## 3. Make Your First Change (第一天任务)

To verify you can modify the app, try changing the game title:
1.  Open `[App.tsx](file:///Users/yehao/Desktop/Code/Claude/bg3_splendor_game_2/src/App.tsx)`.
2.  Search for the title text (e.g., "TURNS" or similar HUD elements).
3.  Change it and verify that the browser auto-refreshes (HMR).

## 4. Debugging & Mocking (调试与作弊模式)

### Running Tests
We use Vitest for unit and integration tests. Run them with:
```bash
npx vitest
```
This is the best way to verify that your logic changes don't break game rules.

### Mocking State for Testing (作弊模式)
Since we use Zustand for state management, you can inspect and modify the state directly if you expose it.
**Tip**: To easily test buying cards or game over conditions, you can temporarily expose the store to the `window` object in `[main.tsx](file:///Users/yehao/Desktop/Code/Claude/bg3_splendor_game_2/src/main.tsx)`:

```typescript
import { usePlayerStore } from './store/playerStore';

if (process.env.NODE_ENV === 'development') {
  (window as any).playerStore = usePlayerStore;
}
```

Then, in the browser console, you can grant yourself resources to test purchase logic:
```javascript
window.playerStore.getState().setState({
  resources: { RED: 10, BLUE: 10, GREEN: 10, WHITE: 10, BLACK: 10 }
});
```

## 5. Entry Points (代码入口)
- **[main.tsx](file:///Users/yehao/Desktop/Code/Claude/bg3_splendor_game_2/src/main.tsx)**: Mounts the React app.
- **[App.tsx](file:///Users/yehao/Desktop/Code/Claude/bg3_splendor_game_2/src/App.tsx)**: The root component containing the `GameArena`.
- **[GameArena.tsx](file:///Users/yehao/Desktop/Code/Claude/bg3_splendor_game_2/src/components/GameArena.tsx)**: The main layout grid for the game.
