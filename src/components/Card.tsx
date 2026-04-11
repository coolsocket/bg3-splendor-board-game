import React from 'react';
import './Card.css';
import type { ResourceType } from './Token';

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

export const Card: React.FC<CardProps> = ({
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
}) => {
  const tierClass = `border-tier-${tier}`;
  const [isReserving, setIsReserving] = React.useState(false);
  const [isBuying, setIsBuying] = React.useState(false);
  
  const handleAction = (action: 'buy' | 'reserve' | 'select', e: React.MouseEvent) => {
    e.stopPropagation();
    if (action === 'reserve') {
      setIsReserving(true);
      setTimeout(() => {
        if (onInteract) {
          onInteract(action, id);
        }
      }, 600);
    } else if (action === 'buy') {
      setIsBuying(true);
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
    <div 
      className={`card ${tierClass} ${isAffordable ? 'affordable' : 'unaffordable'} ${isSelected ? 'selected' : ''} ${isReserving ? 'reserving' : ''} ${isBuying ? 'buying' : ''} ${isDeck ? 'is-deck' : ''}`}
      onClick={(e) => !isDeck && handleAction('select', e)}
      role="button"
      aria-label={isDeck ? `Deck tier ${tier}, count ${deckCount}` : `Card tier ${tier}, prestige points ${prestigePoints}, bonus ${providedBonus}`}
    >
      {isDeck ? (
        <div className="card-inner deck-content flex flex-col items-center justify-center">
          <span className="deck-count">{deckCount}</span>
          <span className="deck-label">Tier {tier}</span>
        </div>
      ) : (
        <div className="card-inner p-2">
          <div className="card-header flex justify-between items-center">
            <div className="card-prestige-container">
              {prestigePoints > 0 && (
                <span className="card-prestige">{prestigePoints}</span>
              )}
            </div>
            <div className={`card-bonus-gem bonus-${providedBonus.toLowerCase()}`} />
          </div>
          
          <div className="card-image-container">
            {imageUrl ? (
              <img src={imageUrl} alt={`Card ${id}`} className="card-image" />
            ) : (
              <div className="card-image-placeholder" />
            )}
          </div>

          <div className="card-footer">
            <div className="card-cost-grid flex justify-center gap-1">
              {Object.entries(cost).map(([resource, amount]) => {
                if (amount && amount > 0) {
                  return (
                    <div 
                      key={resource} 
                      className={`cost-item cost-${resource.toLowerCase()}`}
                      title={`${resource}: ${amount}`}
                    >
                      <span className="cost-amount">{amount}</span>
                    </div>
                  );
                }
                return null;
              })}
            </div>
          </div>

          <div className="card-actions-overlay">
            <button 
              className="action-btn action-buy" 
              onClick={(e) => handleAction('buy', e)}
              disabled={!isAffordable}
            >
              Buy
            </button>
            <button 
              className="action-btn action-reserve" 
              onClick={(e) => handleAction('reserve', e)}
            >
              Reserve
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
