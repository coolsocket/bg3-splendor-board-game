import React from 'react';
import { Card, type CardProps } from './Card';
import { EmptyCardSlot } from '../../EmptyCardSlot';
import { DeckStack } from './DeckStack';

interface MarketRowProps {
  tier: 1 | 2 | 3;
  cards: CardProps[];
  deckCount: number;
  onCardInteract?: (action: 'buy' | 'reserve' | 'select', cardId: string) => void;
}

export const MarketRow: React.FC<MarketRowProps> = ({
  tier,
  cards,
  deckCount,
  onCardInteract
}) => {
  return (
    <div className="grid grid-cols-5 gap-4 items-center justify-center">
      <div className="col-span-1">
        <DeckStack 
          tier={tier} 
          deckCount={deckCount} 
          onClick={(t) => onCardInteract?.('reserve', `TIER_${t}`)}
        />
      </div>
      <div className="col-span-4 grid grid-cols-4 gap-4 [perspective:1000px] justify-center">
        {cards.map(card => (
          <div key={card.id} className="animate-card-flip">
            <Card {...card} onInteract={onCardInteract} />
          </div>
        ))}
        {/* Fill empty slots if less than 4 cards */}
        {Array.from({ length: Math.max(0, 4 - cards.length) }).map((_, index) => (
          <EmptyCardSlot key={`empty-${index}`} />
        ))}
      </div>
    </div>
  );
};
