## 《博德之门3 x 璀璨宝石》前端架构重构技术说明书 (PRD/Tech Spec)

### 一、 架构重构背景与目标

当前项目采用原生 HTML + JavaScript (Imperative UI) 构建，直接操作 DOM 节点导致了严重的数据脱节（如卡牌面板显示的成本与弹窗数据不一致）、UI 层级混乱以及交互反馈僵硬等问题。

本次重构的核心目标是将系统从**指令式渲染（Imperative）**全面迁移至**声明式渲染（Declarative）**。前端架构必须实现“数据与视图解耦”，确保底层游戏状态（State）是唯一事实来源（Single Source of Truth），所有 UI 组件仅作为状态的映射（$UI = f(state)$）。

---

### 二、 核心框架：组件化与声明式 UI (React / Vue 3)

为了解决页面中大量重复元素（代币、卡牌）的代码冗余，并彻底消除数据绑定错误，将全面引入现代前端框架。以下以 React 为例进行技术规范说明：

#### 1. 组件树结构设计 (Component Tree)
页面必须被拆解为单一职责的模块化组件。
* `GameArena` (顶级容器，负责捕获全局交互)
    * `TopNavigation` (回合指示器、目标分数、设置)
    * `PublicResourcePool` (公共代币堆)
        * `TokenStack` (单色代币堆)
    * `CardMarket` (市场区域)
        * `MarketRow` (对应 Tier 1/2/3)
            * `Deck` (牌库剩余数量)
            * `Card` (单张卡牌组件)
    * `PatronsBoard` (贵族/赞助人区域)
    * `PlayerBoard` (玩家状态面板，支持复用，用于展示自己和对手)
        * `ResourceGrid` (玩家持有的代币网格)
        * `BonusGrid` (玩家已激活的永久加成)
        * `ReserveSlots` (保留卡槽)

#### 2. 严格的数据属性传递 (Props Interface)
以经常出错的 `<Card />` 组件为例，其接收的参数（Props）必须被严格定义，彻底杜绝数据错乱：
```typescript
interface CardProps {
  id: string;
  tier: 1 | 2 | 3;
  prestigePoints: number;      // 威望分数
  providedBonus: ResourceType; // 提供的永久加成 (如：蓝钻、力量)
  cost: Record<ResourceType, number>; // 购买成本键值对 (如: { red: 2, blue: 1 })
  imageUrl: string;            // BG3 风格插图
  isAffordable: boolean;       // 由父组件计算传入，决定是否发光
  onInteract: (action: 'buy' | 'reserve', cardId: string) => void;
}
```

---

### 三、 状态管理：单一事实来源 (Zustand / Pinia)

桌游的逻辑极为复杂，决不能在组件之间通过事件总线（Event Bus）或多层回调传递数据。必须引入全局状态管理库。

#### 1. 游戏状态模型 (State Schema)
所有游戏数据必须集中在一个全局 Store 中，结构应类似如下 JSON 树：
```typescript
interface GameState {
  turnInfo: {
    currentTurn: number;
    activePlayerId: string; // 决定哪个玩家面板高亮
  };
  publicPool: {
    tokens: Record<ResourceType, number>; // 当前桌面上剩余的各色代币
  };
  market: {
    tier3: Card[]; // 场上亮出的卡牌
    tier2: Card[];
    tier1: Card[];
    patrons: Patron[]; // 场上的贵族
  };
  players: Record<string, PlayerState>; // 包含所有玩家的状态
}
```

#### 2. 状态变更策略 (Mutations / Actions)
**禁止直接修改状态对象。** 所有交互必须通过触发 Action 来完成。
例如，玩家拿取代币的操作：
1.  触发 `takeTokens(['red', 'blue', 'green'])` 函数。
2.  状态机验证逻辑：检查公共池是否足够、检查玩家拿取后是否超过 10 个上限。
3.  通过校验后，**同时**减少 `publicPool` 中的代币数量，并增加当前 `player` 背包中的代币数量。
4.  UI 自动侦听状态变化并重新渲染。

---

### 四、 视觉引擎与布局约束 (Tailwind CSS)

抛弃松散的原生 CSS 文件，使用 Tailwind CSS 建立严格的设计系统，解决页面中随处可见的对齐错误和留白失控。

#### 1. 空间与网格约束 (Layout Architecture)
* **全局布局**：采用 CSS Grid 实现响应式的分区。左侧分配 `col-span-3` 给所有玩家的状态总览，右侧分配 `col-span-9` 给核心博弈区（市场与公共资源）。
* **卡牌内部排版**：使用 Flexbox。卡牌底部成本区统一使用 `flex flex-row justify-center items-end gap-2`，强制所有成本标签横向紧凑对齐，消除图2中卡牌底部的突兀留白。
* **玩家资产矩阵**：使用 CSS Grid 构建紧凑的图标网络，如 `grid grid-cols-3 gap-1`，保证自己与对手的数据展示面板拥有完美的对称性和一致的阅读体验。

#### 2. 层级与弹窗管理 (Z-Index & Portals)
* 废除通过 `position: absolute` 强行悬浮在卡牌上的无样式菜单。
* 引入 React Portals 或 Vue Teleport 技术，将弹窗（Modal）渲染到 DOM 树的顶层结构，配合半透明的遮罩层（Overlay, `bg-black/70 backdrop-blur-sm`），彻底解决弹窗被其他元素遮挡或位置偏移的问题。

---

### 五、 交互动效与物理反馈 (Framer Motion / GSAP)

解决网页“简陋感”和操作“瞬移”的关键，在于重建游戏操作的视觉启示性。

#### 1. 核心交互反馈链路
* **悬停状态 (Hover Affordance)**：当玩家鼠标悬停在可通过当前资产购买的卡牌上时，触发 `scale: 1.05` 和 `box-shadow` 的平滑过渡，暗示其可交互性。
* **代币轨迹动画 (Tweening)**：当执行“拿取代币”动作时，使用 DOM Rect API 获取公共代币池坐标与玩家面板坐标，利用 GSAP 生成一条带有贝塞尔曲线的抛物线动画，让玩家亲眼看到代币飞入背包的过程。
* **卡牌翻转机制 (Card Flip)**：保留卡牌时，播放 3D 翻转动画（Y轴旋转180度），并在动画结束时将其缩小并移动至玩家的 `ReserveSlots` 槽位中。

#### 2. 回合切换的视觉强化
当 `activePlayerId` 发生变化时，为当前行动玩家的面板容器添加周期性的呼吸灯动效（Pulse Animation），并将非行动玩家的面板透明度适度降低（如降至 60%），通过视觉明暗对比强行聚焦玩家的注意力。