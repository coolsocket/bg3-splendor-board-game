import React from 'react';
import { Token, type ResourceType } from './Token';
import { Button } from './common/Button';
import './StagingArea.css';

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
  const totalTokens = Object.values(tokens).reduce((sum, count) => sum + (count || 0), 0);

  if (totalTokens === 0) return null;

  return (
    <div className="staging-area bg-obsidian-panel backdrop-blur-md border border-gold-dark/50 rounded-lg p-4 shadow-2xl">
      <div className="staging-area-title text-gold text-sm uppercase tracking-wider font-serif mb-2 text-center">
        Staging Area
      </div>
      <div className="staged-tokens flex justify-center gap-2 mb-4">
        {Object.entries(tokens).map(([type, count]) => {
          if (!count || count <= 0) return null;
          return Array.from({ length: count }).map((_, index) => (
            <div 
              key={`${type}-${index}`} 
              className="staged-token-wrapper cursor-pointer transform hover:scale-105 transition-transform"
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
              <Token type={type as ResourceType} count={1} hideLabel={true} />
            </div>
          ));
        })}
      </div>
      <div className="staging-actions flex justify-center gap-4">
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
