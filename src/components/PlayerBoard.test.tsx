// @vitest-environment jsdom
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { PlayerBoard, type PlayerBoardProps } from './PlayerBoard';
import '@testing-library/jest-dom';

// Mock the store
vi.mock('../store/playerStore', () => ({
  usePlayerStore: () => ({
    id: 'player-1',
    name: 'Store Player',
    resources: { RADIANT_GEM: 5 },
    bonuses: { RADIANT_GEM: 1 },
    acquiredCards: [],
    reservedCards: [],
    patrons: [],
    prestigePoints: 10,
  }),
}));

describe('PlayerBoard Component', () => {
  const defaultProps: PlayerBoardProps = {
    playerName: 'Prop Player',
    prestigePoints: 5,
    tokens: {
      RADIANT_GEM: 1,
      ARCANE_CRYSTAL: 0,
      NATURES_BLESSING: 0,
      INFERNAL_IRON: 0,
      DARK_QUARTZ: 0,
      TRUE_SOUL_TADPOLE: 0,
    },
    ownedCards: [],
    reservedCards: [],
    patrons: [],
    isCurrentPlayer: false,
  };

  it('renders player name and prestige points from props when not current player', () => {
    render(<PlayerBoard {...defaultProps} />);
    
    expect(screen.getByText('Prop Player')).toBeInTheDocument();
    expect(screen.getByText('5')).toBeInTheDocument();
  });

  it('renders player name and prestige points from store when is current player', () => {
    render(<PlayerBoard {...defaultProps} isCurrentPlayer={true} />);
    
    expect(screen.getByText('Store Player')).toBeInTheDocument();
    expect(screen.getByText('10')).toBeInTheDocument();
  });

  it('renders resources correctly for non-current player', () => {
    render(<PlayerBoard {...defaultProps} />);
    
    // Prop player has 1 RADIANT_GEM
    expect(screen.getByText('1')).toBeInTheDocument();
  });

  it('renders empty messages when lists are empty', () => {
    render(<PlayerBoard {...defaultProps} />);
    
    expect(screen.getByText('No owned cards')).toBeInTheDocument();
    expect(screen.getByText('No reserved cards')).toBeInTheDocument();
    expect(screen.getByText('No patrons visited')).toBeInTheDocument();
  });
});
