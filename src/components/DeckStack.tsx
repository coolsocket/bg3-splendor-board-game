import React from 'react';
import './DeckStack.css';

export interface DeckStackProps {
  tier: 1 | 2 | 3;
  deckCount: number;
}

export const DeckStack: React.FC<DeckStackProps> = ({ tier, deckCount }) => {
  const tierClass = `border-tier-${tier}`;
  
  return (
    <div className={`deck-stack card ${tierClass}`} role="button" aria-label={`Deck tier ${tier}, count ${deckCount}`}>
      <div className="card-inner deck-content flex flex-col items-center justify-center">
        <span className="deck-count">{deckCount}</span>
        <span className="deck-label">Tier {tier}</span>
      </div>
    </div>
  );
};
