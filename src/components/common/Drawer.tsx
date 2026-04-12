import React from 'react';
import { Button } from './Button';

export interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export const Drawer: React.FC<DrawerProps> = ({ isOpen, onClose, title, children }) => {
  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 transition-opacity"
          onClick={onClose}
          role="button"
          tabIndex={0}
          aria-label="Close drawer"
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              onClose();
            }
          }}
        />
      )}
      
      {/* Drawer */}
      <div className={`bg-obsidian-panel backdrop-blur-md border-l border-gold-dark/30 shadow-heavy transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : 'translate-x-full'} fixed top-0 right-0 h-full w-96 z-50 flex flex-col`}>
        <div className="p-4 border-b border-gold-dark/20 flex justify-between items-center">
          <span className="text-gold text-lg uppercase tracking-wider font-serif font-bold">{title}</span>
          <Button 
            variant="icon"
            onClick={onClose}
            aria-label={`Close ${title}`}
            className="p-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </Button>
        </div>
        <div className="flex-1 overflow-y-auto p-4">
          {children}
        </div>
      </div>
    </>
  );
};
