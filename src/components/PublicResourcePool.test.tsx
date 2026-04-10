// @vitest-environment jsdom
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { PublicResourcePool } from './PublicResourcePool';
import '@testing-library/jest-dom';

// Mock store
vi.mock('../store/publicStore', () => ({
  usePublicStore: (selector: any) => selector({
    availableResources: {
      radiant_gem: 5,
      arcane_crystal: 0,
    },
  }),
}));

describe('PublicResourcePool Component', () => {
  it('renders the pool with title', () => {
    render(<PublicResourcePool />);
    expect(screen.getByText('Public Resource Pool')).toBeInTheDocument();
  });

  it('renders tokens with counts from store', () => {
    render(<PublicResourcePool />);
    // radiant_gem count is 5
    expect(screen.getByText('5')).toBeInTheDocument();
  });

  it('calls onTokenClick when a token is clicked', () => {
    const handleTokenClick = vi.fn();
    render(<PublicResourcePool onTokenClick={handleTokenClick} />);
    
    const tokens = screen.getAllByRole('button');
    const radiantGemToken = tokens.find(t => t.textContent?.includes('RG'));
    
    if (radiantGemToken) {
      fireEvent.click(radiantGemToken);
      expect(handleTokenClick).toHaveBeenCalledWith('RADIANT_GEM');
    } else {
      throw new Error('Radiant Gem token not found');
    }
  });

  it('disables tokens when count is 0', () => {
    render(<PublicResourcePool />);
    const tokens = screen.getAllByRole('button');
    const arcaneCrystalToken = tokens.find(t => t.textContent?.includes('AC'));
    
    expect(arcaneCrystalToken).toHaveClass('disabled');
  });
});
