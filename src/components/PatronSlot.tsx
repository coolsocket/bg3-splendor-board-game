import React from 'react';
import type { Patron, ResourceType } from '../domain/models';
import { PrestigeBadge } from './PrestigeBadge';

const costGradients: Record<ResourceType, string> = {
  'radiant_gem': "bg-[radial-gradient(circle_at_25%_25%,#fef08a,#ca8a04)]",
  'arcane_crystal': "bg-[radial-gradient(circle_at_25%_25%,#38bdf8,#0284c7)]",
  'natures_blessing': "bg-[radial-gradient(circle_at_25%_25%,#4ade80,#16a34a)]",
  'infernal_iron': "bg-[radial-gradient(circle_at_25%_25%,#f87171,#dc2626)]",
  'dark_quartz': "bg-[radial-gradient(circle_at_25%_25%,#c084fc,#9333ea)]",
  'true_soul_tadpole': "bg-[radial-gradient(circle_at_25%_25%,#f472b6,#db2777)]"
};

export interface PatronSlotProps {
  patron?: Patron;
  children?: React.ReactNode;
}

export const PatronSlot: React.FC<PatronSlotProps> = ({ patron, children }) => {
  if (!patron) {
    return (
      <div className="w-[120px] aspect-[2/3] bg-gradient-to-br from-[#5a4a22] via-[#3a2f15] to-[#5a4a22] p-[2px] rounded-lg shadow-inner">
        <div className="w-full h-full bg-[#1a0508] bg-[radial-gradient(circle_at_center,#2a0b10_0%,#0f0204_100%)] rounded-md flex flex-col justify-between p-2 relative z-10 text-[#F5E6C4]">
          <div className="flex-grow flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="opacity-30">
              <circle cx="12" cy="12" r="10"/>
              <polygon points="12 2 22 12 12 22 2 12"/>
            </svg>
          </div>
          {children || <span className="text-xs font-bold uppercase tracking-wider text-shadow-[1px_1px_2px_rgba(0,0,0,0.8)] absolute bottom-2.5 left-0 right-0 text-center">Patron</span>}
        </div>
      </div>
    );
  }

  return (
    <div 
      className="relative w-[120px] aspect-[2/3] bg-gradient-to-br from-[#bf953f] via-[#fcf6ba] to-[#aa771c] p-[2px] rounded-lg shadow-[0_4px_8px_rgba(0,0,0,0.5),inset_0_0_20px_rgba(0,0,0,0.8)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_6px_12px_rgba(0,0,0,0.6),0_0_15px_rgba(212,175,55,0.5)]"
      title={patron.description}
      aria-label={`Patron ${patron.name}`}
    >
      <div className="w-full h-full bg-[#4a0e17] rounded-md flex flex-col justify-between p-2 relative z-10 text-[#F5E6C4] overflow-hidden">
        <div className="flex justify-center w-full min-w-0 mb-1 pt-1">
          <span className="text-[#ffd700] text-[11px] font-serif font-bold text-center w-full">{patron.name}</span>
        </div>
        
        
        <div className="flex-grow flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-[#ffd700] opacity-50">
            <circle cx="12" cy="12" r="10"/>
            <polygon points="12 2 22 12 12 22 2 12"/>
            <circle cx="12" cy="12" r="3"/>
          </svg>
        </div>
        
        <div className="w-full">
          <div className="flex flex-row justify-center gap-3 pb-3">
            {Object.entries(patron.requirements).map(([resource, amount]) => {
              if (amount && amount > 0) {
                const isWildcard = resource === 'TRUE_SOUL_TADPOLE';
                return (
                  <div 
                    key={resource} 
                    className={`w-7 h-7 rotate-45 flex items-center justify-center shadow-[inset_0_1px_2px_rgba(255,255,255,0.4),0_1px_2px_rgba(0,0,0,0.6)] ${isWildcard ? 'bg-[radial-gradient(circle_at_25%_25%,#1f1f1f,#0d0d0d)]' : costGradients[resource.toUpperCase() as ResourceType]}`}
                    title={`${resource}: ${amount}`}
                  >
                    {isWildcard ? (
                      <div className="relative flex items-center justify-center w-full h-full">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="#ffd700" stroke="#b8860b" strokeWidth="1" className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rotate-[-45deg]">
                          <path d="M2 4 L5 12 L12 6 L19 12 L22 4 L18 20 L6 20 Z" />
                        </svg>
                        <span className="rotate-[-45deg] font-fantasy text-shadow-[0_1px_2px_rgba(0,0,0,0.8)] font-bold text-[#ffd700] text-xs z-10">{amount}</span>
                      </div>
                    ) : (
                      <span className="rotate-[-45deg] font-fantasy text-shadow-[0_1px_2px_rgba(0,0,0,0.8)] font-bold text-white text-xs">{amount}</span>
                    )}
                  </div>
                );
              }
              return null;
            })}
          </div>
        </div>
      </div>
      <PrestigeBadge prestigePoints={patron.points} />
    </div>
  );
};
