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
      <div className="card-inner card-back-pattern deck-content flex items-center justify-center">
        <div className="deck-stamp flex flex-col items-center justify-center">
          <span className="deck-count">{deckCount}</span>
          <span className="deck-label">{tier === 1 ? 'I' : tier === 2 ? 'II' : 'III'}</span>
        </div>
      </div>
    </div>
  );
};
