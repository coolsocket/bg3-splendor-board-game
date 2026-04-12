import React from 'react';
import './PatronSlot.css';
import type { Patron } from '../domain/models';
import { PrestigeBadge } from './PrestigeBadge';
import { CardBase } from './common/CardBase';

export interface PatronSlotProps {
  patron?: Patron;
  children?: React.ReactNode;
}

export const PatronSlot: React.FC<PatronSlotProps> = ({ patron, children }) => {
  if (!patron) {
    return (
      <CardBase className="patron-card-slot empty" isHoverable={false}>
        <div className="patron-card-inner">
          <div className="patron-center-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="patron-icon-svg opacity-30">
              <circle cx="12" cy="12" r="10"/>
              <polygon points="12 6 7 17 17 17"/>
            </svg>
          </div>
          {children || <span className="patron-placeholder-text">Patron</span>}
        </div>
      </CardBase>
    );
  }

  return (
    <CardBase className="patron-card-slot" title={patron.description} aria-label={`Patron ${patron.name}`}>
      <div className="patron-card-inner flex flex-col justify-between p-2 h-full relative">
        <div className="patron-name-container flex justify-center w-full min-w-0 mb-1">
          <span className="patron-name text-gold text-sm font-serif font-bold text-center truncate w-full">{patron.name}</span>
        </div>
        
        <PrestigeBadge prestigePoints={patron.points} />
        
        <div className="patron-center-icon flex-grow flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="patron-icon-svg text-gold opacity-50">
            <circle cx="12" cy="12" r="10"/>
            <polygon points="12 2 22 12 12 22 2 12"/>
            <circle cx="12" cy="12" r="3"/>
          </svg>
        </div>
        
        <div className="patron-footer w-full">
          <div className="patron-cost-grid flex flex-row justify-center gap-1">
            {Object.entries(patron.requirements).map(([resource, amount]) => {
              if (amount && amount > 0) {
                const isWildcard = resource === 'TRUE_SOUL_TADPOLE';
                return (
                  <div 
                    key={resource} 
                    className={`patron-cost-item cost-${resource.toLowerCase()} ${isWildcard ? 'is-wildcard' : ''}`}
                    title={`${resource}: ${amount}`}
                  >
                    {isWildcard ? (
                      <div className="relative flex items-center justify-center w-full h-full">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="#ffd700" stroke="#b8860b" strokeWidth="1" className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" style={{ transform: 'translate(-50%, -50%) rotate(-45deg)' }}>
                          <path d="M2 4 L5 12 L12 6 L19 12 L22 4 L18 20 L6 20 Z" />
                        </svg>
                        <span className="cost-amount text-white text-xl font-bold z-10">{amount}</span>
                      </div>
                    ) : (
                      <span className="cost-amount text-white text-xl font-bold">{amount}</span>
                    )}
                  </div>
                );
              }
              return null;
            })}
          </div>
        </div>
      </div>
    </CardBase>
  );
};
