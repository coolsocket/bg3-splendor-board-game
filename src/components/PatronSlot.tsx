import React from 'react';
import type { Patron } from '../domain/models';
import type { ResourceType } from './TokenTypes';
import { PrestigeBadge } from './PrestigeBadge';
import { UnifiedToken } from './common/UnifiedToken';
import { useGameStateStore } from '../store/gameStateStore';
import { ZH, EN } from '../data/translations';
import { AssetRepository } from '../repositories/assetRepository';

export interface PatronSlotProps {
  patron?: Patron;
  children?: React.ReactNode;
  onClick?: (patron: Patron) => void;
}

export const PatronSlot: React.FC<PatronSlotProps> = ({ patron, children, onClick }) => {
  const language = useGameStateStore((state) => state.language);
  const t = language === 'ZH' ? ZH : EN;

  if (!patron) {
    return (
      <div className="w-24 aspect-[2/3] bg-gradient-to-br from-ui-empty-start via-ui-empty-mid to-ui-empty-start p-0.5 rounded-lg shadow-inner">
        <div className="w-full h-full bg-[#1a0508] bg-[radial-gradient(circle_at_center,#2a0b10_0%,#0f0204_100%)] rounded-md relative z-10 text-[var(--color-parchment)]">
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
            <svg className="absolute inset-0 w-full h-full opacity-20 pointer-events-none" xmlns="http://www.w3.org/2000/svg">
              <line x1="0" y1="0" x2="100%" y2="100%" stroke="var(--color-gold-dark)" strokeWidth="2" strokeDasharray="5,5" />
              <line x1="100%" y1="0" x2="0" y2="100%" stroke="var(--color-gold-dark)" strokeWidth="2" strokeDasharray="5,5" />
            </svg>
            <div className="relative flex flex-col items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="opacity-30">
                <circle cx="12" cy="12" r="10"/>
                <polygon points="12 2 22 12 12 22 2 12"/>
              </svg>
              {children || <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-xs font-bold font-fantasy uppercase tracking-wider text-shadow-[1px_1px_2px_rgba(0,0,0,0.8)] text-center mt-0.5 bg-[#1a0508]/80 px-1 rounded">{t.patron}</span>}
            </div>
          </div>
        </div>
      </div>
    );
  }

  const localizedName = language === 'ZH' ? (ZH.card_names as any)[patron.name] || patron.name : patron.name;
  const imageUrl = AssetRepository.getArt(patron.assetId || '');

  return (
    <div 
      className="relative w-24 aspect-[2/3] bg-gradient-to-br from-ui-patron-gold-start via-ui-patron-gold-mid to-ui-patron-gold-end p-0.5 rounded-lg shadow-[0_4px_8px_rgba(0,0,0,0.5),inset_0_0_20px_rgba(0,0,0,0.8)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_6px_12px_rgba(212,175,55,0.6)] cursor-pointer active:scale-95 group/patron"
      onClick={() => onClick && onClick(patron)}
      aria-label={`Patron ${localizedName}`}
    >
      <div className="w-full h-full bg-[var(--color-ui-bg-parchment)] rounded-md flex flex-col justify-between p-1.5 relative z-10 text-[var(--color-ui-text-parchment)] overflow-hidden shadow-inner">
        <div className="absolute inset-0 opacity-20 pointer-events-none mix-blend-multiply" style={{ backgroundImage: `url(${AssetRepository.getParchmentTexture()})` }} />
        
        <div className="flex-grow relative flex items-center justify-center pointer-events-none mt-1 overflow-hidden rounded-sm border border-ui-border-tier1/10 bg-white/40">
          {imageUrl ? (
            <img src={imageUrl} alt={localizedName} className="absolute inset-0 w-full h-full object-cover grayscale-[20%] sepia-[10%] brightness-110" />
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="text-black opacity-20 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
               <path d="M50 15 C 30 15, 20 35, 20 50 C 20 70, 40 80, 50 90 C 60 80, 80 70, 80 50 C 80 35, 70 15, 50 15 Z" />
               <path d="M40 40 C 35 55, 25 65, 15 75" />
               <path d="M60 40 C 65 55, 75 65, 85 75" />
               <path d="M50 45 C 50 65, 45 75, 45 95" />
               <path d="M50 45 C 50 65, 55 75, 55 95" />
               <circle cx="40" cy="35" r="4" />
               <circle cx="60" cy="35" r="4" />
            </svg>
          )}
        </div>
        
        <div className="w-full mt-1">
          <div className="flex flex-row justify-center gap-0.5 pb-1 flex-nowrap scale-90 origin-bottom">
            {Object.entries(patron.requirements).map(([resource, amount]) => {
              if (amount && amount > 0) {
                const resourceType = resource.toUpperCase() as ResourceType;
                return (
                  <UnifiedToken 
                    key={resource} 
                    type={resourceType} 
                    amount={amount} 
                    size="sm" 
                    className="relative z-20"
                  />
                );
              }
              return null;
            })}
          </div>
        </div>
      </div>
      <PrestigeBadge prestigePoints={patron.points} size="sm" className="absolute top-0 right-0 translate-x-1/3 -translate-y-1/3 z-30" />
    </div>
  );
};
