# 技术总览 (Technical Overview) - BG3 Splendor UI

## 当前架构与设计 (Current Architecture & Design)

本项目已经从传统的“固定像素（Fixed Pixel）”布局全面转向**流式响应（Fluid Responsive）**和**组件驱动（Component-driven）**的现代前端架构。

### 1. 布局策略 (Layout Strategy)
- **全局网格 (Global Grid)**: 游戏主舞台 (`GameArena`) 采用了严格的三列网格布局（`300px 1fr 250px`），撑满整个视口（`100vw`, `100vh`）。
- **流式自适应**: 中间列（卡牌市场与公共池）自动吞噬剩余空间，消除黑边，适应不同分辨率。
- **局部滚动**: 锁死全局滚动（`overflow: hidden`），将滚动权限下放到各列（侧边栏、市场区）。

### 2. 组件工业化 (Component Industrialization)
消灭了巨石组件，提取了高度可复用的原子组件：
- `Card`: 统一 `2/3` 宽高比，具备暗黑材质与悬停魔法光晕。
- `Token`: 具备桌面投影与径向渐变高光的拟真球体。
- `PlayerBoard`: 拆分为 `PlayerAvatar`、`ResourceMatrix` 和 `PrestigeBadge`。
- `PatronSlot`, `DeckStack`, `WildcardPool`: 均已独立，便于维护。

### 3. 材质与美学 (Aesthetics & Polish)
- **暗黑奇幻基调**: 全局叠加 4% 噪点纹理与四周暗角滤镜。
- **数字排印**: 统一使用古典衬线体（`Cinzel`）展示关键决策数值。
- **统一点缀色**: 暗金（边框/高亮）+ 奥术蓝（激活/魔法）。

---

## 为什么还是不能下滑？ (The Scrolling Mystery)

在第 5 阶段中，我们虽然在中间列的包裹 `div` 上加上了 `overflow-y-auto` 和 `h-full`，但滚动条依然没有出现，导致卡牌被截断无法下滑。

这是一个经典的 **CSS Grid/Flexbox 容器溢出陷阱**：

### 1. 问题根源：Grid Item 的默认最小尺寸
1. 我们将滚动容器（`div`）放在了 `.main-area` 内部。
2. `.main-area` 是 `.game-arena` (CSS Grid) 的一个直接子元素（Grid Item）。
3. 在 CSS Grid 规范中，Grid Item 的 `min-height` 默认值是 `auto`（即 `min-content`），**这意味着它默认不会收缩到小于其内容的高度**。
4. 因此，`.main-area` 被内部巨大的卡牌市场**撑高了**，超出了屏幕高度。
5. 因为 `.main-area` 自身变高了，它内部的滚动容器认为自己“没有溢出”，所以绝不触发 `overflow-y-auto` 的滚动条！
6. 最终，超出的内容在最外层 `.game-arena` 的 `overflow: hidden` 作用下被生硬地剪裁掉了。

### 2. 解决方案 (Solution)
要激活滚动，必须打破 Grid Item 的默认最小尺寸限制，强制其收缩：
- **方案 A**: 给 `.main-area` 加上 `min-height: 0;`。这会告诉浏览器，这个 Grid Item 允许收缩到比内容小的高度，从而触发内部子元素的 `overflow-y-auto`。
- **方案 B**: 给 `.main-area` 加上 `height: 100%;` 并配合 `overflow: hidden`，将滚动完全移交给最内层的滚动容器。

我们推荐使用**方案 A**（在 `.main-area` 上加 `min-h-0`），这是最符合现代响应式布局的最佳实践。
