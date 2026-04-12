import { useEffect } from 'react';
import { GameArena } from './components/GameArena';
import type { ResourceType } from './components/Token';
import type { PlayerBoardProps } from './components/PlayerBoard';
import type { CardMarketProps } from './components/CardMarket';
import { usePublicStore } from './store/publicStore';
import { usePlayerStore } from './store/playerStore';
import { TIER_1_CARDS, TIER_2_CARDS, TIER_3_CARDS, ALL_PATRONS } from './data/initialData';
import { CardTier, ResourceType as ModelResourceType } from './domain/models';

function App() {
  useEffect(() => {
    const t1Cards = [...TIER_1_CARDS];
    const t2Cards = [...TIER_2_CARDS];
    const t3Cards = [...TIER_3_CARDS];

    const faceUpT1 = t1Cards.splice(0, 4);
    const faceUpT2 = t2Cards.splice(0, 4);
    const faceUpT3 = t3Cards.splice(0, 4);

    usePublicStore.setState({
      decks: {
        [CardTier.TIER_1]: t1Cards,
        [CardTier.TIER_2]: t2Cards,
        [CardTier.TIER_3]: t3Cards,
      },
      faceUpCards: {
        [CardTier.TIER_1]: faceUpT1,
        [CardTier.TIER_2]: faceUpT2,
        [CardTier.TIER_3]: faceUpT3,
      },
      availablePatrons: ALL_PATRONS.slice(0, 3),
      availableResources: {
        [ModelResourceType.RADIANT_GEM]: 7,
        [ModelResourceType.ARCANE_CRYSTAL]: 7,
        [ModelResourceType.NATURES_BLESSING]: 7,
        [ModelResourceType.INFERNAL_IRON]: 7,
        [ModelResourceType.DARK_QUARTZ]: 7,
        [ModelResourceType.TRUE_SOUL_TADPOLE]: 5,
      },
    });

    usePlayerStore.setState({
      name: 'Gale',
    });
  }, []);

  const dummyResources: Record<ResourceType, number> = {
    RADIANT_GEM: 5,
    ARCANE_CRYSTAL: 5,
    NATURES_BLESSING: 5,
    INFERNAL_IRON: 5,
    DARK_QUARTZ: 5,
    TRUE_SOUL_TADPOLE: 3,
  };

  const dummyPlayer: PlayerBoardProps = {
    playerName: 'Gale',
    prestigePoints: 5,
    tokens: {
      RADIANT_GEM: 2,
      ARCANE_CRYSTAL: 1,
      NATURES_BLESSING: 0,
      INFERNAL_IRON: 3,
      DARK_QUARTZ: 1,
      TRUE_SOUL_TADPOLE: 1,
    },
    ownedCards: [],
    reservedCards: [],
    patrons: [],
    isCurrentPlayer: true,
  };

  const dummyOpponent: PlayerBoardProps = {
    playerName: 'Astarion',
    prestigePoints: 3,
    tokens: {
      RADIANT_GEM: 1,
      ARCANE_CRYSTAL: 2,
      NATURES_BLESSING: 1,
      INFERNAL_IRON: 0,
      DARK_QUARTZ: 2,
      TRUE_SOUL_TADPOLE: 0,
    },
    ownedCards: [],
    reservedCards: [],
    patrons: [],
    isCurrentPlayer: false,
  };

  const dummyMarket: CardMarketProps = {
    tier1Cards: [],
    tier2Cards: [],
    tier3Cards: [],
    tier1DeckCount: 36,
    tier2DeckCount: 26,
    tier3DeckCount: 16,
  };

  return (
    <div className="app-container h-screen w-screen overflow-hidden">
      <GameArena
        currentPlayer={dummyPlayer}
        opponents={[dummyOpponent]}
        market={dummyMarket}
        resources={dummyResources}
      />
    </div>
  );
}

export default App;
