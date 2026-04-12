import React from 'react';
import { Token } from './Token';
import type { ResourceType } from './TokenTypes';
import { Button } from './common/Button';

interface StagingAreaProps {
  tokens: Partial<Record<ResourceType, number>>;
  onConfirm: () => void;
  onCancel: () => void;
  onRemoveToken?: (type: ResourceType) => void;
  isValid: boolean;
}

export const StagingArea: React.FC<StagingAreaProps> = ({
  tokens,
  onConfirm,
  onCancel,
  onRemoveToken,
  isValid
}) => {
  const totalTokens = Object.values(tokens).reduce((sum: number, count) => sum + (count || 0), 0);

  if (totalTokens === 0) return null;

  return (
    <div className="fixed top-[100px] left-1/2 -translate-x-1/2 z-[var(--z-dropdown)] min-w-[300px] max-w-[90vw] bg-[#1a1c23]/95 border-2 border-[var(--color-gold-dark)] shadow-[0_10px_25px_rgba(0,0,0,0.8),inset_0_0_15px_rgba(212,175,55,0.2)] animate-slide-down backdrop-blur-md rounded-lg p-4">
      <div className="text-gold text-sm uppercase tracking-wider font-serif mb-2 text-center text-shadow-[0_2px_4px_rgba(0,0,0,0.5)]">
        Staging Area
      </div>
      <div className="staged-tokens flex justify-center gap-2 mb-4 p-2 bg-black/30 rounded-md border border-[#d4af37]/10 min-h-[60px] items-center">
        {Object.entries(tokens).map(([type, count]) => {
          if (!count || count <= 0) return null;
          return Array.from({ length: count }).map((_, index) => (
            <div 
              key={`${type}-${index}`} 
              className="cursor-pointer transform hover:scale-105 transition-transform"
              onClick={() => onRemoveToken?.(type as ResourceType)}
              title="Click to remove"
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  onRemoveToken?.(type as ResourceType);
                }
              }}
            >
              <Token type={type as ResourceType} count={1} hideLabel={true} size="md" />
            </div>
          ));
        })}
      </div>
      <div className="flex justify-center gap-4">
        <Button 
          variant="primary"
          onClick={onConfirm}
          disabled={!isValid}
        >
          CONFIRM
        </Button>
        <Button 
          variant="secondary"
          onClick={onCancel}
        >
          CANCEL
        </Button>
      </div>
    </div>
  );
};
