import React from 'react';
import { type CardProps } from './Card';
import { useGameStateStore } from '../../../store/gameStateStore';
import { CardTier, type Card as DomainCard } from '../../../domain/models';
import type { ResourceType } from '../../TokenTypes';
import { MarketRow } from './MarketRow';
import { canAffordCard } from '../../../domain/rules/purchaseRules';
import { ZH, EN } from '../../../data/translations';
import { GAME_CONFIG } from '../../../config/gameConfig';

export interface CardMarketProps {
  onCardInteract?: (action: 'buy' | 'reserve' | 'select', cardId: string) => void;
}

export const CardMarket: React.FC<CardMarketProps> = ({
  onCardInteract
}) => {
  const { faceUpCards, decks, players, currentPlayerIndex, language } = useGameStateStore();
  const t = language === 'ZH' ? ZH : EN;
  const currentPlayer = players[currentPlayerIndex];
  
  const player = React.useMemo(() => ({ resources: currentPlayer.resources, bonuses: currentPlayer.bonuses }), [currentPlayer]) as any;

  const mapCardToCardProps = (card: DomainCard): CardProps => {
    const isAffordable = canAffordCard(player, card);

    const cost: Partial<Record<ResourceType, number>> = {};
    for (const [type, amount] of Object.entries(card.cost)) {
      cost[type.toUpperCase() as ResourceType] = amount;
    }

    return {
      id: card.id,
      assetId: card.assetId || '',
      name: card.name,
      tier: card.tier as 1 | 2 | 3,
      prestigePoints: card.points,
      providedBonus: card.bonus.toUpperCase() as ResourceType,
      cost,
      isAffordable,
      isSelected: false,
      description: card.description,
    };
  };

  const tier1Cards = faceUpCards[CardTier.TIER_1]?.map(mapCardToCardProps) || [];
  const tier2Cards = faceUpCards[CardTier.TIER_2]?.map(mapCardToCardProps) || [];
  const tier3Cards = faceUpCards[CardTier.TIER_3]?.map(mapCardToCardProps) || [];

  const tier1DeckCount = decks[CardTier.TIER_1]?.length || 0;
  const tier2DeckCount = decks[CardTier.TIER_2]?.length || 0;
  const tier3DeckCount = decks[CardTier.TIER_3]?.length || 0;

  return (
    <div 
      className="flex flex-col gap-2 items-center w-full mx-auto h-full justify-center"
      style={{ maxWidth: GAME_CONFIG.UI.MARKET_MAX_WIDTH }}
    >
      <div className="w-full flex items-center justify-center relative mb-6">
        <div role="heading" aria-level={2} className="font-serif font-bold text-3xl tracking-[0.2em] text-[var(--color-parchment)] m-0 text-center flex items-center justify-center gap-6 drop-shadow-[0_4px_8px_rgba(0,0,0,0.8)] uppercase">
          <span className="w-24 h-0.5 bg-gradient-to-l from-[var(--color-gold-dark)] to-transparent shadow-lg"></span>
          {t.cardMarket}
          <span className="w-24 h-0.5 bg-gradient-to-r from-[var(--color-gold-dark)] to-transparent shadow-lg"></span>
        </div>
      </div>
      <div className="flex flex-col gap-6 w-full">
        <MarketRow tier={3} cards={tier3Cards} deckCount={tier3DeckCount} onCardInteract={onCardInteract} />
        <MarketRow tier={2} cards={tier2Cards} deckCount={tier2DeckCount} onCardInteract={onCardInteract} />
        <MarketRow tier={1} cards={tier1Cards} deckCount={tier1DeckCount} onCardInteract={onCardInteract} />
      </div>
    </div>
  );
};
