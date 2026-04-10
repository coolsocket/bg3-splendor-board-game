import React from 'react';
import './PatronSlot.css';

export interface PatronSlotProps {
  children?: React.ReactNode;
}

export const PatronSlot: React.FC<PatronSlotProps> = ({ children }) => {
  return (
    <div className="patron-card-slot">
      <div className="patron-card-inner">
        {children || 'Patron'}
      </div>
    </div>
  );
};
