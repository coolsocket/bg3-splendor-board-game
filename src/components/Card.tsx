import React from 'react';
import { type ResourceType, getDisplayName } from './TokenTypes';
import { useAudioStore } from '../store/audioStore';
import { CardBase } from './common/CardBase';
import { ResourceIcon } from './common/ResourceIcon';



const bonusGradients: Record<ResourceType, string> = {
  'RADIANT_GEM': "bg-[radial-gradient(circle_at_30%_30%,#ffffff_0%,var(--color-radiant)_25%,var(--color-radiant-mid)_70%,var(--color-radiant-dark)_100%)]",
  'ARCANE_CRYSTAL': "bg-[radial-gradient(circle_at_30%_30%,#ffffff_0%,var(--color-arcane)_25%,var(--color-arcane-mid)_70%,var(--color-arcane-dark)_100%)]",
  'NATURES_BLESSING': "bg-[radial-gradient(circle_at_30%_30%,#ffffff_0%,var(--color-natures)_25%,var(--color-natures-mid)_70%,var(--color-natures-dark)_100%)]",
  'INFERNAL_IRON': "bg-[radial-gradient(circle_at_30%_30%,#ffffff_0%,var(--color-infernal)_25%,var(--color-infernal-mid)_70%,var(--color-infernal-dark)_100%)]",
  'DARK_QUARTZ': "bg-[radial-gradient(circle_at_30%_30%,#ffffff_0%,var(--color-dark)_25%,var(--color-dark-mid)_70%,var(--color-dark-dark)_100%)]",
  'TRUE_SOUL_TADPOLE': "bg-[radial-gradient(circle_at_30%_30%,#ffffff_0%,var(--color-wildcard-pink)_25%,var(--color-wildcard-pink-mid)_70%,var(--color-wildcard-pink-dark)_100%)]"
};

const costGradients: Record<ResourceType, string> = {
  'RADIANT_GEM': "bg-[radial-gradient(circle_at_25%_25%,#fef08a,#ca8a04)]",
  'ARCANE_CRYSTAL': "bg-[radial-gradient(circle_at_25%_25%,#38bdf8,#0284c7)]",
  'NATURES_BLESSING': "bg-[radial-gradient(circle_at_25%_25%,#4ade80,#16a34a)]",
  'INFERNAL_IRON': "bg-[radial-gradient(circle_at_25%_25%,#f87171,#dc2626)]",
  'DARK_QUARTZ': "bg-[radial-gradient(circle_at_25%_25%,#c084fc,#9333ea)]",
  'TRUE_SOUL_TADPOLE': "bg-[radial-gradient(circle_at_25%_25%,#f472b6,#db2777)]"
};

const cardInnerStyle = {
  backgroundColor: 'var(--color-parchment)',
  backgroundImage: `linear-gradient(rgba(232, 226, 210, 0.5), rgba(216, 206, 180, 0.7)), url('../assets/parchment_texture.png')`,
  backgroundSize: 'cover',
  backgroundPosition: 'center',
};

export interface CardProps {
  id: string;
  tier: 1 | 2 | 3;
  prestigePoints: number;      // 威望分数，使用 Display Font
  providedBonus: ResourceType; // 提供的永久加成
  cost: Partial<Record<ResourceType, number>>; // 购买成本键值对
  imageUrl?: string;            // BG3 风格插图
  isAffordable: boolean;       // 状态机计算得出，决定是否发光
  isSelected?: boolean;         // 是否被当前玩家选中
  onInteract?: (action: 'buy' | 'reserve' | 'select', cardId: string) => void;
  isDeck?: boolean;
  deckCount?: number;
}

export const Card = React.memo(({
  id,
  tier,
  prestigePoints,
  providedBonus,
  cost,
  imageUrl,
  isAffordable,
  isSelected = false,
  onInteract,
  isDeck = false,
  deckCount = 0
}: CardProps) => {
  const [isReserving, setIsReserving] = React.useState(false);
  const [isBuying, setIsBuying] = React.useState(false);
  const playAudio = useAudioStore((state) => state.playAudio);
  
  const handleAction = (action: 'buy' | 'reserve' | 'select', e: React.MouseEvent) => {
    e.stopPropagation();
    if (action === 'reserve') {
      setIsReserving(true);
      playAudio('reserve-card');
      setTimeout(() => {
        if (onInteract) {
          onInteract(action, id);
        }
      }, 600);
    } else if (action === 'buy') {
      setIsBuying(true);
      playAudio('buy-card');
      setTimeout(() => {
        if (onInteract) {
          onInteract(action, id);
        }
      }, 600);
    } else {
      if (onInteract) {
        onInteract(action, id);
      }
    }
  };

  return (
    <CardBase 
      className={`group bg-bg-underdark shadow-heavy border-2 ${isAffordable ? 'border-[#bf953f] shadow-[0_0_15px_rgba(212,175,55,0.6)] animate-pulse' : 'border-[#bf953f]/30 grayscale-[40%] brightness-70'} ${isReserving ? 'animate-card-reserve' : ''} ${isBuying ? 'animate-card-buy' : ''} ${isDeck ? 'is-deck' : ''} hover:scale-105`}
      onClick={(e) => !isDeck && handleAction('select', e)}
      isHoverable={!isDeck}
      isSelected={isSelected}
      role={isDeck ? "button" : "article"}
      aria-label={isDeck ? `Deck tier ${tier}, count ${deckCount}` : `Card tier ${tier}, prestige points ${prestigePoints}, bonus ${providedBonus}`}
      tabIndex={isDeck ? undefined : -1}
    >
      {isDeck ? (
        <div 
          className="w-full h-full flex flex-col items-center justify-center"
          style={cardInnerStyle}
        >
          <span className="deck-count">{deckCount}</span>
          <span className="deck-label">Tier {tier}</span>
        </div>
      ) : (
        <div 
          className="w-full h-full flex flex-col justify-between p-1 box-border relative"
          style={cardInnerStyle}
        >
          <div className="flex justify-between items-center p-2 mix-blend-multiply">
            <div className="min-w-0">
              {prestigePoints > 0 && (
                <span className="font-fantasy text-3xl font-bold text-text-dark text-shadow-sm">{prestigePoints}</span>
              )}
            </div>
            <div className={`w-[38px] h-[38px] flex items-center justify-center filter drop-shadow-md rounded-full border border-white/60 ${bonusGradients[providedBonus]}`}>
              <ResourceIcon type={providedBonus} size="lg" className="text-white" />
            </div>
          </div>
          
          <div className="flex-grow m-0 bg-bg-obsidian overflow-hidden flex items-center justify-center relative shadow-inner mix-blend-multiply">
            {imageUrl ? (
              <img src={imageUrl} alt={`Card ${id}`} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-[#141414] to-[#050505] shadow-inner flex items-center justify-center" />
            )}
          </div>

          <div className="absolute bottom-0 left-0 right-0 flex justify-center pt-1 px-1 pb-2 bg-black/60 backdrop-blur-sm border-top border-white/10 rounded-b-md z-10">
            <div className="flex flex-wrap justify-center gap-1 mb-1">
              {Object.entries(cost).map(([resource, amount]) => {
                if (amount && amount > 0) {
                  const resourceType = resource.toUpperCase() as ResourceType;
                  return (
                    <div 
                      key={resource} 
                      className={`relative z-10 w-[48px] h-[48px] rounded-full flex items-center justify-center font-fantasy text-3xl font-black text-white text-shadow ring-1 ring-black shadow-md ${costGradients[resourceType]}`}
                      title={`${getDisplayName(resourceType)}: ${amount}`}
                    >
                      <ResourceIcon type={resourceType} size="sm" className="absolute opacity-25 z-0" />
                      <span className="relative z-10">{amount}</span>
                    </div>
                  );
                }
                return null;
              })}
            </div>
          </div>

          <div className="absolute inset-0 bg-black/60 flex flex-col justify-center items-center gap-3 opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity duration-200 backdrop-blur-sm z-badge pointer-events-none group-hover:pointer-events-auto group-focus-within:pointer-events-auto">
            <button 
              className="w-[80%] p-2 rounded-sm border border-[#bf953f] bg-[#2a0808] text-[#E8E2D2] font-fantasy font-bold text-sm cursor-pointer transition-all hover:bg-[#fbbf24] hover:text-black hover:shadow-[0_0_10px_rgba(251,191,36,0.8)] hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:border-gray-500 disabled:bg-[#1a1a1a] disabled:shadow-none" 
              onClick={(e) => handleAction('select', e)}
            >
              Select
            </button>
            <button 
              className="w-[80%] p-2 rounded-sm border border-[#bf953f] bg-[#2a0808] text-[#E8E2D2] font-fantasy font-bold text-sm cursor-pointer transition-all hover:bg-[#38bdf8] hover:text-black hover:shadow-[0_0_10px_rgba(56,189,248,0.8)] hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:border-gray-500 disabled:bg-[#1a1a1a] disabled:shadow-none" 
              onClick={(e) => handleAction('buy', e)}
              disabled={!isAffordable}
            >
              Buy
            </button>
            <button 
              className="w-[80%] p-2 rounded-sm border border-[#bf953f] bg-[#2a0808] text-[#E8E2D2] font-fantasy font-bold text-sm cursor-pointer transition-all hover:bg-[#f87171] hover:text-black hover:shadow-[0_0_10px_rgba(248,113,113,0.8)] hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:border-gray-500 disabled:bg-[#1a1a1a] disabled:shadow-none" 
              onClick={(e) => handleAction('reserve', e)}
            >
              Reserve
            </button>
          </div>
        </div>
      )}
    </CardBase>
  );
});
