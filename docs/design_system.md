# BG3 Splendor Design System & Component Specification

## 一、 引言 (Introduction)

本文档旨在为《博德之门3 x 璀璨宝石》重构项目提供统一的视觉规范和组件设计标准。基于 `UIUX.md` 的美术指导和 `technical.md` 的技术规划，我们将从原有的指令式 DOM 操作（如老版本 `UIRenderer.js` 中所示）全面转向基于现代前端框架（如 React/Vue）的声明式组件化架构。

---

## 二、 原子 UI 规范 (Atomic UI Norms)

### 1. 色彩系统 (Color Palette)
彻底放弃原有纯黑背景，引入符合 BG3 世界观的暗黑奇幻风格调色板：

*   **背景底色 (Canvas / Background)**:
    *   `bg-underdark`: 深冷灰蓝色，用于模拟幽暗地域的神秘感。
    *   `bg-camp-table`: 深棕色做旧皮革纹理，用于主游戏桌面。
    *   *原则*: 杜绝纯黑 (`#000000`)。
*   **主文本色 (Primary Text)**:
    *   `text-parchment`: `#E8E2D2`（做旧羊皮纸色），降低视觉疲劳。
    *   `text-ivory`: 象牙白，用于次要高亮文本。
    *   *原则*: 杜绝纯白 (`#FFFFFF`)。
*   **交互与高光 (Action & Accent)**:
    *   `accent-arcane`: 盖尔法术般的深空蓝或夺心魔寄生虫的紫红色，用于“可购买/正向操作”状态。
    *   `accent-gold`: 古董金（Antique Gold），带金属反光质感，用于“终极目标/威望分数”。
    *   `state-disabled`: 低饱和度灰暗色调，降低透明度，用于“买不起/不可用”状态。

### 2. 字体排印 (Typography)
*   **标题与数字字体 (Display Font)**:
    *   使用具有古典哥特风格或类似 BG3 官方标题的衬线体（Serif Font）。
    *   应用于：卡牌威望分数、代币总数、回合指示器。
*   **正文与详情字体 (Body Font)**:
    *   使用高可读性的无衬线体（Sans-serif）或衬线体。
    *   应用于：规则说明、设置菜单、玩家名称。
*   **文字特效 (Text Effects)**:
    *   所有漂浮在插画或深色背景上的文字，必须强制使用深色文本阴影 (`text-shadow`) 以确保清晰度。

### 3. 空间与网格 (Spacing & Grid)
*   遵循 `technical.md` 规范，采用 CSS Grid 进行全局布局。
*   主游戏区采用三列网格布局：左侧玩家面板 (`250px`)，中间核心博弈区 (`1fr`)，右侧贵族面板 (`200px`)。

---

## 三、 BG3 Style 材质与 CSS 类规范 (Textures & CSS Classes)

### 1. 卡牌材质 (Cards)
*   **卡牌背景**: `bg-card-parchment`，带有粗糙纸张或羊皮纸纹理。
*   **卡牌边框**:
    *   `border-tier-1`: 破损的铁边质感。
    *   `border-tier-2`: 打磨过的青铜/黄铜质感。
    *   `border-tier-3`: 雕花暗金与宝石镶嵌质感。
*   **深度感**: 强制应用 `shadow-xl` 或自定义的深色、偏移 `box-shadow`，模拟卡牌放置在桌面上的物理阴影。

### 2. 资源代币 (Tokens)
*   放弃原有的纯色圆圈设计。
*   使用 CSS 渐变（如 `conic-gradient` 或 `radial-gradient`）和内阴影模拟具有体积感的 3D 球体或硬币。
*   交互时配合 `translate-y-[-4px]` 和发光滤镜。

### 3. UI 容器 (Containers)
*   **面板底板**: `bg-oak-panel`（镶嵌铁钉的深色橡木板）或 `bg-obsidian-panel`（半透明黑曜石板）。
*   **毛玻璃效果**: 配合 `backdrop-blur-sm`，使 UI 容器与背景拉开空间感。

---

## 四、 现有组件分析与重构计划 (Component Refactor Plan)

### 1. 现有 `UIRenderer.js` 分析
在老版本的 `/bg3_splendor_game/public/js/modules/UIRenderer.js` 中，UI 是通过指令式代码管理的：
*   **屏幕切换**: 使用 `showScreen(screenName)` 手动切换类名和透明度。
*   **角色选择**: `initializeAvatarSelection()` 通过原生 JS 拼接 HTML 并手动绑定点击事件。
*   **游戏板更新**: `updateGameBoard()` 包含大量庞大的 DOM 拼接逻辑，如 `renderResources`、`renderTierCards` 等，极易导致数据与视图不同步。

### 2. 声明式组件树规格 (Declarative Component Tree)

我们将把 `UIRenderer.js` 中的指令式渲染逻辑拆解并重构为以下声明式组件树（以 React 为例）：

#### 根组件: `GameArena`
负责捕获全局交互，持有或连接全局游戏状态。

#### 子组件 1: `TopNavigation`
*   **职责**: 渲染回合指示器、目标分数、游戏设置入口。
*   **源自老版本**: `updateGameBoard` 中的 turn banner 逻辑及 `showSettingsModal`。

#### 子组件 2: `PublicResourcePool`
*   **职责**: 渲染公共代币堆。
*   **下级组件**: `TokenStack`（单色代币堆，需展示堆叠感和剩余数量）。
*   **源自老版本**: `renderResources('board-resources', ...)`。

#### 子组件 3: `CardMarket`
*   **职责**: 渲染 3 个级别的市场卡牌。
*   **下级组件**:
    *   `MarketRow` (对应 Tier 1/2/3)
    *   `Deck` (牌库剩余数量)
    *   `Card` (单张卡牌)
*   **源自老版本**: `renderTierCards(...)`。

#### 子组件 4: `PatronsBoard`
*   **职责**: 渲染可用的贵族/赞助人卡片。
*   **源自老版本**: `renderPatrons(...)`。

#### 子组件 5: `PlayerBoard` (高复用组件)
*   **职责**: 渲染玩家的资产状态面板（支持主玩家视图 and 对手视图）。
*   **下级组件**:
    *   `ResourceGrid` (代币网格)
    *   `BonusGrid` (永久加成)
    *   `ReserveSlots` (保留卡槽)
*   **源自老版本**: `table-bottom-player` 和 `table-opponents` 的渲染逻辑。

---

## 五、 核心组件属性接口定义 (Props Interface)

为了确保重构后的组件具有强类型和确定性，以 `<Card />` 组件为例，规范其 Props 如下：

```typescript
interface CardProps {
  id: string;
  tier: 1 | 2 | 3;
  prestigePoints: number;      // 威望分数，使用 Display Font
  providedBonus: ResourceType; // 提供的永久加成
  cost: Record<ResourceType, number>; // 购买成本键值对
  imageUrl: string;            // BG3 风格插图
  isAffordable: boolean;       // 状态机计算得出，决定是否发光
  isSelected: boolean;         // 是否被当前玩家选中
  onInteract: (action: 'buy' | 'reserve' | 'select', cardId: string) => void;
}
```

此规范将作为 STORY-004（组件重构实施）的直接指导依据。
