# 版本升级与扩展指南 (Extensibility Guide)

本指南旨在指导开发者如何在不修改核心代码的前提下，为《博德之门3：璀璨宝石》扩展新的游戏机制（如大师卡、特殊贵族效果等）。

## 1. 设计原则 (Design Principles)

根据 `docs/README.md` 的架构要求，所有扩展设计必须遵循以下准则：

1.  **配置驱动 (Config-Driven)**: 新的卡牌、贵族等数据应通过 JSON 配置文件添加，而非硬编码在逻辑中。
2.  **插件式设计与策略模式 (Plugin & Strategy Pattern)**: 核心逻辑（如 `rulebook.md` 中的纯函数）保持稳定，特殊效果通过注册“策略”或“插件”来动态注入。
3.  **强类型协议 (TypeScript)**: 扩展字段必须有严格的接口定义，确保类型安全。
4.  **UI 解耦**: 逻辑扩展不应直接依赖 UI 组件，应通过状态派生或事件通知来驱动 UI 更新。

---

## 2. 核心扩展模式 (Core Extension Patterns)

### 2.1 策略模式：卡牌与贵族特殊效果 (Strategy Pattern)

为了支持诸如“大师卡”或“特殊贵族（赞助者）效果”，我们在 `Card` 和 `Patron` 的数据结构中引入可选的 `effectId` 和 `metadata` 字段。这允许核心引擎在不识别具体效果内容的情况下，调用对应的策略。

#### 数据结构扩展定义

在 TypeScript 中，我们可以通过继承或可选字段来扩展基础类型：

```typescript
// 基础类型参考 docs/rulebook.md

// 扩展卡牌元数据
export interface ExtendedCard extends Card {
  effectId?: string; // 对应的效果策略 ID
  metadata?: Record<string, any>; // 效果所需的自定义参数（如：伤害值、持续回合）
}

// 扩展赞助者（贵族）元数据
export interface ExtendedPatron extends Patron {
  effectId?: string;
  metadata?: Record<string, any>;
}
```

#### 策略接口实现

定义一个通用的效果执行器接口，核心引擎在特定生命周期会调用这些方法：

```typescript
export interface EffectStrategy {
  id: string;
  
  // 当玩家获得该卡牌或赞助者时触发
  onAcquired?: (state: GameState, playerId: string) => GameState;
  
  // 在玩家回合开始时触发
  onTurnStart?: (state: GameState, playerId: string) => GameState;
  
  // 在玩家回合结束时触发
  onTurnEnd?: (state: GameState, playerId: string) => GameState;
  
  // 计算成本时的修正（用于打折等效果）
  modifyCost?: (card: Card, player: Player, currentCost: ResourceCollection) => ResourceCollection;
}
```

#### 策略注册表 (Registry)

在逻辑层维护一个单例注册表，用于解耦策略定义与引擎核心：

```typescript
class EffectManager {
  private static strategies = new Map<string, EffectStrategy>();

  static register(strategy: EffectStrategy) {
    this.strategies.set(strategy.id, strategy);
  }

  static get(id: string): EffectStrategy | undefined {
    return this.strategies.get(id);
  }
}
```

### 2.2 插件式设计：游戏流转钩子 (Plugin System)

对于更复杂的机制（如新增一种全新的行动类型，或者改变回合轮转规则），可以使用插件式设计，通过挂载钩子（Hooks）来改变游戏行为。

```typescript
export interface GamePlugin {
  name: string;
  install: (gameSystem: GameSystemEngine) => void;
}

// 在游戏初始化时加载插件
const gameEngine = new GameSystemEngine();
gameEngine.use(new MasterCardExpansionPlugin());
```

---

## 3. 典型扩展场景实现指南

### 3.1 场景一：增加“大师卡” (Master Cards)

**需求**：增加一种更高级的卡牌，购买后除了加分，还能在每回合开始时为玩家提供一次免费的资源重投（或者额外摸一张牌）的机会。

**实现步骤**：

1.  **配置 JSON 数据**：在 `cards.json` 中添加新卡，指定 `effectId: "MASTER_REROLL"`。
2.  **实现策略**：
    ```typescript
    EffectManager.register({
      id: "MASTER_REROLL",
      onTurnStart: (state, playerId) => {
        // 纯函数：复制 state，修改该玩家的可用临时资源或触发标记
        return newState;
      }
    });
    ```
3.  **引擎调用**：在 `rulebook.md` 定义的 `nextTurn` 函数中，遍历当前玩家的 `acquiredCards`，若存在 `effectId` 则调用 `EffectManager.get(effectId).onTurnStart(...)`。

### 3.2 场景二：特殊贵族（赞助者）效果 (Special Noble Effects)

**需求**：某个贵族（如 Raphael）拜访玩家后，玩家在购买“法术(Spell)”类型的卡牌时，可以无视 1 个 `DARK_QUARTZ`（暗黑石英）的成本。

**实现步骤**：

1.  **配置 JSON 数据**：在 `patrons.json` 中为 Raphael 添加 `effectId: "RAPHAEL_SPELL_DISCOUNT"`。
2.  **实现策略**：
    ```typescript
    EffectManager.register({
      id: "RAPHAEL_SPELL_DISCOUNT",
      modifyCost: (card, player, currentCost) => {
        if (card.type !== 'Spell') return currentCost;
        // 纯函数：返回扣减后的 cost 集合
        return subtractResources(currentCost, { DARK_QUARTZ: 1 });
      }
    });
    ```
3.  **引擎调用**：在 `calculateEffectiveCost` 纯函数中，获取玩家拥有的所有赞助者，链式调用 `modifyCost`。

---

## 4. 开发者检查清单 (Developer Checklist)

当你准备添加一个新机制时，请确认以下事项：

* [ ] **配置化**：新增的数据实体（卡牌、贵族）是否已放入 JSON 配置文件，而不是硬编码在代码中？
* [ ] **无副作用**：所有的特殊效果策略是否依然是纯函数（Pure Function），不直接修改传入的 state 而是返回 new state？
* [ ] **类型安全**：新增的 `effectId` 和 `metadata` 是否在 TypeScript 接口中有明确的类型定义或注释？
* [ ] **解耦**：该扩展是否保证了 UI 层不需要知道具体的策略逻辑，仅通过订阅 Store 中的状态变化来渲染？

---

## 5. 当前实现说明 (Current Implementation Notes)

在 `STORY-028` 的实现中，由于缺少独立的数据文件，我们在 `src/simulate.ts` 中直接硬编码了卡牌和赞助者的数据（`TIER_1_CARDS`, `TIER_2_CARDS`, `TIER_3_CARDS`, `ALL_PATRONS`）。

这违反了“配置驱动”的设计原则。在后续的生产版本迭代中，建议将这些硬编码的数据提取到独立的 JSON 文件中（例如 `src/data/cards.json` 和 `src/data/patrons.json`），并实现对应的数据加载逻辑，以确保系统的可扩展性和可维护性。

