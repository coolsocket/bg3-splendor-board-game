// @vitest-environment jsdom
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Token, type ResourceType } from './Token';
import '@testing-library/jest-dom';

describe('Token Component', () => {
  const defaultProps = {
    type: 'RADIANT_GEM' as ResourceType,
    count: 5,
  };

  it('renders the token with correct count and label', () => {
    render(<Token {...defaultProps} />);
    
    expect(screen.getByText('5')).toBeInTheDocument();
    expect(screen.getByText('RG')).toBeInTheDocument();
  });

  it('applies the correct class for the resource type', () => {
    const { container } = render(<Token {...defaultProps} />);
    
    expect(container.firstChild).toHaveClass('radiant_gem');
  });

  it('calls onClick when clicked', () => {
    const handleClick = vi.fn();
    render(<Token {...defaultProps} onClick={handleClick} />);
    
    fireEvent.click(screen.getByRole('button'));
    
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('renders flying token when clicked', () => {
    const handleClick = vi.fn();
    render(<Token {...defaultProps} onClick={handleClick} />);
    
    fireEvent.click(screen.getByRole('button'));
    
    expect(screen.getByTestId('flying-token-RADIANT_GEM')).toBeInTheDocument();
  });

  it('does not call onClick when disabled', () => {
    const handleClick = vi.fn();
    render(<Token {...defaultProps} onClick={handleClick} disabled={true} />);
    
    fireEvent.click(screen.getByRole('button'));
    
    expect(handleClick).not.toHaveBeenCalled();
  });

  it('applies disabled class when disabled', () => {
    const { container } = render(<Token {...defaultProps} disabled={true} />);
    
    expect(container.firstChild).toHaveClass('disabled');
  });
});
