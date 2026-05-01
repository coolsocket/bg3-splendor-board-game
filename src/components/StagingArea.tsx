import React from 'react';
import type { ResourceType } from './TokenTypes';
import { Button } from './common/Button';
import { UnifiedToken } from './common/UnifiedToken';
import { useGameStateStore } from '../store/gameStateStore';
import { ZH, EN } from '../data/translations';

export type StagingMode = 'take' | 'discard' | 'action';

interface StagingAreaProps {
  tokens: Partial<Record<ResourceType, number>>;
  onConfirm: () => void;
  onCancel: () => void;
  onRemoveToken?: (type: ResourceType) => void;
  isValid: boolean;
  mode?: StagingMode;
  discardRequired?: number;
}

export const StagingArea: React.FC<StagingAreaProps> = ({
  tokens,
  onConfirm,
  onCancel,
  onRemoveToken,
  isValid,
  mode = 'take',
  discardRequired = 0
}) => {
  const language = useGameStateStore((state) => state.language);
  const t = language === 'ZH' ? ZH : EN;
  const totalTokens = Object.values(tokens).reduce((sum: number, count) => sum + (count || 0), 0);

  // If nothing is staged and we are in normal 'take' mode, hide the bar
  if (totalTokens === 0 && mode === 'take') return null;

  const isDiscard = mode === 'discard';
  const isAction = mode === 'action';

  const getContainerStyle = () => {
      if (isDiscard) return 'bg-red-900/20 border-red-500/50 shadow-[0_0_20px_rgba(255,0,0,0.2)]';
      if (isAction) return 'bg-blue-900/20 border-blue-500/50 shadow-[0_0_20px_rgba(0,100,255,0.2)]';
      return 'bg-[var(--color-bg-panel-alt)]/95 border-[var(--color-gold-dark)]';
  };

  const getTitle = () => {
      if (isDiscard) return `${t.discardTokens || 'Discard Tokens'} (${totalTokens}/${discardRequired})`;
      if (isAction) return (t as any).actionPending || 'Executing Action';
      return t.stagingArea;
  };

  return (
    <div className={`w-full ${getContainerStyle()} border-2 shadow-[0_10px_25px_rgba(0,0,0,0.8),inset_0_0_15px_rgba(212,175,55,0.2)] backdrop-blur-md rounded-lg p-4 mt-2 transition-all duration-500`}>
      <div className={`text-sm uppercase tracking-wider font-serif mb-2 text-center text-shadow-[0_2px_4px_rgba(0,0,0,0.5)] ${isDiscard ? 'text-red-400 animate-pulse' : 'text-gold'}`}>
        {getTitle()}
      </div>
      
      <div className="staged-tokens flex justify-center gap-2 mb-4 p-2 bg-black/30 rounded-md border border-white/5 min-h-[50px] items-center">
        {Object.entries(tokens).map(([type, count]) => {
          if (!count || count <= 0) return null;
          return Array.from({ length: count }).map((_, index) => (
            <div 
              key={`${type}-${index}`} 
              className="token cursor-pointer transform hover:scale-110 transition-transform"
              onClick={() => onRemoveToken?.(type as ResourceType)}
              title={t.clickToRemove || "Click to remove"}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  onRemoveToken?.(type as ResourceType);
                }
              }}
            >
              <UnifiedToken type={type as ResourceType} amount={1} size="md" />
            </div>
          ));
        })}
        {totalTokens === 0 && isDiscard && (
           <span className="text-xs text-red-400/60 italic">{t.clickBoardToDiscard}</span>
        )}
      </div>

      <div className="flex justify-center gap-4">
        <Button 
          variant="primary"
          onClick={onConfirm}
          disabled={!isValid}
        >
          {isDiscard ? t.confirmDiscard : t.confirm}
        </Button>
        {!isDiscard && (
          <Button 
            variant="secondary"
            onClick={onCancel}
          >
            {t.cancel}
          </Button>
        )}
      </div>
    </div>
  );
};
