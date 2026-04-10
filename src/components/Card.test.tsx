// @vitest-environment jsdom
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Card, type CardProps } from './Card';
import '@testing-library/jest-dom';

describe('Card Component', () => {
  const defaultProps: CardProps = {
    id: 'card-1',
    tier: 1,
    prestigePoints: 3,
    providedBonus: 'RADIANT_GEM',
    cost: { ARCANE_CRYSTAL: 2, NATURES_BLESSING: 1 },
    isAffordable: true,
    isSelected: false,
  };

  it('renders card details correctly', () => {
    render(<Card {...defaultProps} />);
    
    expect(screen.getByText('3')).toBeInTheDocument();
    expect(screen.getByText('RA')).toBeInTheDocument();
    expect(screen.getByTitle('ARCANE_CRYSTAL: 2')).toBeInTheDocument();
    expect(screen.getByTitle('NATURES_BLESSING: 1')).toBeInTheDocument();
  });

  it('applies affordable class when affordable', () => {
    const { container } = render(<Card {...defaultProps} isAffordable={true} />);
    expect(container.firstChild).toHaveClass('affordable');
  });

  it('applies unaffordable class when not affordable', () => {
    const { container } = render(<Card {...defaultProps} isAffordable={false} />);
    expect(container.firstChild).toHaveClass('unaffordable');
  });

  it('calls onInteract with select when card is clicked', () => {
    const handleInteract = vi.fn();
    render(<Card {...defaultProps} onInteract={handleInteract} />);
    
    fireEvent.click(screen.getByRole('button'));
    
    expect(handleInteract).toHaveBeenCalledWith('select', 'card-1');
  });

  it('calls onInteract with buy when buy button is clicked', () => {
    const handleInteract = vi.fn();
    render(<Card {...defaultProps} onInteract={handleInteract} />);
    
    const buyButton = screen.getByText('Buy');
    fireEvent.click(buyButton);
    
    expect(handleInteract).toHaveBeenCalledWith('buy', 'card-1');
  });

  it('disables buy button when not affordable', () => {
    render(<Card {...defaultProps} isAffordable={false} />);
    
    const buyButton = screen.getByText('Buy');
    expect(buyButton).toBeDisabled();
  });

  it('calls onInteract with reserve when reserve button is clicked', async () => {
    vi.useFakeTimers();
    const handleInteract = vi.fn();
    render(<Card {...defaultProps} onInteract={handleInteract} />);
    
    const reserveButton = screen.getByText('Reserve');
    fireEvent.click(reserveButton);
    
    vi.advanceTimersByTime(600);
    
    expect(handleInteract).toHaveBeenCalledWith('reserve', 'card-1');
    vi.useRealTimers();
  });
});
