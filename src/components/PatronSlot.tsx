import React from 'react';
import './PatronSlot.css';
import type { Patron } from '../domain/models';
import { PrestigeBadge } from './PrestigeBadge';

export interface PatronSlotProps {
  patron?: Patron;
  children?: React.ReactNode;
}

export const PatronSlot: React.FC<PatronSlotProps> = ({ patron, children }) => {
  if (!patron) {
    return (
      <div className="patron-card-slot empty">
        <div className="patron-card-inner">
          <div className="patron-center-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="patron-icon-svg opacity-30">
              <circle cx="12" cy="12" r="10"/>
              <polygon points="12 6 7 17 17 17"/>
            </svg>
          </div>
          {children || <span className="patron-placeholder-text">Patron</span>}
        </div>
      </div>
    );
  }

  return (
    <div className="patron-card-slot" title={patron.description}>
      <div className="patron-card-inner flex flex-col justify-between p-2 h-full relative">
        <PrestigeBadge prestigePoints={patron.points} />
        
        <div className="patron-name-container flex justify-center w-full mt-4">
          <span className="patron-name text-parchment text-xs font-bold text-center truncate max-w-[80px]">{patron.name}</span>
        </div>
        
        <div className="patron-center-icon flex-grow flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="patron-icon-svg text-gold opacity-50">
            <circle cx="12" cy="12" r="10"/>
            <polygon points="12 2 22 12 12 22 2 12"/>
            <circle cx="12" cy="12" r="3"/>
          </svg>
        </div>
        
        <div className="patron-footer w-full">
          <div className="patron-cost-grid flex justify-center gap-1 flex-wrap">
            {Object.entries(patron.requirements).map(([resource, amount]) => {
              if (amount && amount > 0) {
                return (
                  <div 
                    key={resource} 
                    className={`patron-cost-item cost-${resource.toLowerCase()}`}
                    title={`${resource}: ${amount}`}
                  >
                    <span className="cost-amount text-white text-xl font-bold">{amount}</span>
                  </div>
                );
              }
              return null;
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
