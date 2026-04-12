import React from 'react';
import './CardMarket.css';
import { type CardProps } from './Card';
import { usePublicStore } from '../store/publicStore';
import { usePlayerStore } from '../store/playerStore';
import { calculateEffectiveCost } from '../domain/logic';
import { CardTier, ResourceType as DomainResourceType, type Card as DomainCard } from '../domain/models';
import type { ResourceType } from './Token';
import { MarketRow } from './MarketRow';

export interface CardMarketProps {
  tier1Cards?: CardProps[];
  tier2Cards?: CardProps[];
  tier3Cards?: CardProps[];
  tier1DeckCount?: number;
  tier2DeckCount?: number;
  tier3DeckCount?: number;
  onCardInteract?: (action: 'buy' | 'reserve' | 'select', cardId: string) => void;
}

export const CardMarket: React.FC<CardMarketProps> = ({
  onCardInteract
}) => {
  const faceUpCards = usePublicStore((state) => state.faceUpCards);
  const decks = usePublicStore((state) => state.decks);
  const playerResources = usePlayerStore((state) => state.resources);
  const playerBonuses = usePlayerStore((state) => state.bonuses);

  const mapCardToCardProps = (card: DomainCard): CardProps => {
    const effectiveCost = calculateEffectiveCost(card, playerBonuses);
    
    // Check if player has enough resources (including tadpoles as wildcards)
    const tadpoles = playerResources[DomainResourceType.TRUE_SOUL_TADPOLE] || 0;
    let tadpolesNeeded = 0;

    for (const [type, needed] of Object.entries(effectiveCost)) {
        const resourceType = type as DomainResourceType;
        const available = playerResources[resourceType] || 0;
        if (available < (needed || 0)) {
            const shortage = (needed || 0) - available;
            tadpolesNeeded += shortage;
        }
    }

    const isAffordable = tadpolesNeeded <= tadpoles;

    const cost: Partial<Record<ResourceType, number>> = {};
    for (const [type, amount] of Object.entries(card.cost)) {
      cost[type.toUpperCase() as ResourceType] = amount;
    }

    return {
      id: card.id,
      tier: card.tier as 1 | 2 | 3,
      prestigePoints: card.points,
      providedBonus: card.bonus.toUpperCase() as ResourceType,
      cost,
      isAffordable,
      isSelected: false,
    };
  };

  const tier1Cards = faceUpCards[CardTier.TIER_1]?.map(mapCardToCardProps) || [];
  const tier2Cards = faceUpCards[CardTier.TIER_2]?.map(mapCardToCardProps) || [];
  const tier3Cards = faceUpCards[CardTier.TIER_3]?.map(mapCardToCardProps) || [];

  const tier1DeckCount = decks[CardTier.TIER_1]?.length || 0;
  const tier2DeckCount = decks[CardTier.TIER_2]?.length || 0;
  const tier3DeckCount = decks[CardTier.TIER_3]?.length || 0;

  return (
    <div className="card-market">
      <h2 className="market-title">Card Market</h2>
      <MarketRow tier={3} cards={tier3Cards} deckCount={tier3DeckCount} onCardInteract={onCardInteract} />
      <MarketRow tier={2} cards={tier2Cards} deckCount={tier2DeckCount} onCardInteract={onCardInteract} />
      <MarketRow tier={1} cards={tier1Cards} deckCount={tier1DeckCount} onCardInteract={onCardInteract} />
    </div>
  );
};
