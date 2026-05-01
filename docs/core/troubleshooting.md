# Troubleshooting Guide (排错指南)

This document maps common visual and functional symptoms to their likely causes in the codebase, helping you debug issues quickly.

## 1. Visual & Layout Issues (视觉与布局)

| Symptom (症状) | Likely Cause (病因) | Action (解决办法) |
| :--- | :--- | :--- |
| **Tokens are elliptical** (代币变成椭圆形) | Flex container space is insufficient, forcing items to shrink. | Add `shrink-0` to the token container or force fixed `w-` and `h-` classes. |
| **Background bleeds outside rounded corners** (背景溢出圆角) | Child elements ignore parent's `border-radius` if not clipped. | Add `overflow-hidden` to the parent container. |
| **Text is truncated or overflows** (名字或数字看不清/截断) | Lack of responsive sizing or fixed container width. | Use fluid typography like `text-[clamp(0.8rem,1.5vw,1.2rem)]`. |
| **Duplicate rows of tokens** (多出一行“盘子”或底座) | Absolute positioned element (e.g., animating token) not anchored to a `relative` parent, causing it to stack in a `flex-col` container. | Ensure the parent wrapper has `relative` and the absolute child is properly scoped. |
| **Cost bar is covered by black mask** (卡牌底部成本被遮挡) | Stacking context issue or missing `z-index`. | Check if the container has `relative` and proper `z-` index to lift it above backgrounds. |

## 2. Logic & State Issues (逻辑与状态)

| Symptom (症状) | Likely Cause (病因) | Action (解决办法) |
| :--- | :--- | :--- |
| **Card is affordable but doesn't glow** (买得起但不亮) | `canAffordCard` rule not returning true, or hook not re-calculating. | Verify `purchaseRules.ts` logic with unit tests. Check if hook dependencies are complete. |
| **Resources deducted but card not acquired** (扣了钱没给卡) | `useGameStore` dispatch interrupted or only updated one store. | Check `BUY_CARD` case in `useGameStore.ts`. Ensure both `usePlayerStore` and `usePublicStore` are updated atomically. |

---

## 💡 Pro-Tip for Debugging
When in doubt, use the browser console to inspect the state (if exposed via `window.playerStore` as described in `onboarding.md`). If the state data is correct but the UI is wrong, it is a **CSS/Component** issue. If the state data itself is wrong, it is a **Domain/Store** issue.
