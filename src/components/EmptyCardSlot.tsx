import React from 'react';
import './EmptyCardSlot.css';

export const EmptyCardSlot: React.FC = () => {
  return (
    <div className="empty-card-slot card-back-pattern">
      <span>Empty Slot</span>
    </div>
  );
};
