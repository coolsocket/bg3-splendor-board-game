import React from 'react';
import './MarketRow.css';
import { Card, type CardProps } from './Card';
import { EmptyCardSlot } from './EmptyCardSlot';

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
    <div className={`market-row tier-${tier}`}>
      <div className="deck-container">
        <Card 
          id={`deck-${tier}`} 
          tier={tier} 
          isDeck={true} 
          deckCount={deckCount} 
          prestigePoints={0} 
          providedBonus={'RADIANT_GEM'} 
          cost={{}} 
          isAffordable={false} 
        />
      </div>
      <div className="cards-container">
        {cards.map(card => (
          <Card key={card.id} {...card} onInteract={onCardInteract} />
        ))}
        {/* Fill empty slots if less than 4 cards */}
        {Array.from({ length: Math.max(0, 4 - cards.length) }).map((_, index) => (
          <EmptyCardSlot key={`empty-${index}`} />
        ))}
      </div>
    </div>
  );
};
