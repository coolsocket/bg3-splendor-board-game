import React from 'react';
import { type CardProps } from './Card';
import { usePublicStore } from '../../../store/publicStore';
import { usePlayerStore } from '../../../store/playerStore';
import { CardTier, type Card as DomainCard } from '../../../domain/models';
import type { ResourceType } from '../../TokenTypes';
import { MarketRow } from './MarketRow';
import { canAffordCard } from '../../../domain/rules/purchaseRules';

export interface CardMarketProps {
  onCardInteract?: (action: 'buy' | 'reserve' | 'select', cardId: string) => void;
}

export const CardMarket: React.FC<CardMarketProps> = ({
  onCardInteract
}) => {
  const faceUpCards = usePublicStore((state) => state.faceUpCards);
  const decks = usePublicStore((state) => state.decks);
  const resources = usePlayerStore((state) => state.resources);
  const bonuses = usePlayerStore((state) => state.bonuses);
  const player = React.useMemo(() => ({ resources, bonuses }), [resources, bonuses]) as any;

  const mapCardToCardProps = (card: DomainCard): CardProps => {
    const isAffordable = canAffordCard(player, card); // Use domain rule!

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
    <div className="flex flex-col gap-2 p-2 bg-bg-obsidian backdrop-blur-sm rounded-lg border border-gold-dark/40 shadow-heavy flex-grow">
      <h2 className="font-serif font-bold text-2xl tracking-wider text-[#bf953f] mb-0 text-center flex items-center justify-center gap-4">
        <span className="w-16 h-0.5 bg-gradient-to-l from-gold-dark to-transparent shadow-md"></span>
        Card Market
        <span className="w-16 h-0.5 bg-gradient-to-r from-gold-dark to-transparent shadow-md"></span>
      </h2>
      <MarketRow tier={3} cards={tier3Cards} deckCount={tier3DeckCount} onCardInteract={onCardInteract} />
      <MarketRow tier={2} cards={tier2Cards} deckCount={tier2DeckCount} onCardInteract={onCardInteract} />
      <MarketRow tier={1} cards={tier1Cards} deckCount={tier1DeckCount} onCardInteract={onCardInteract} />
    </div>
  );
};
