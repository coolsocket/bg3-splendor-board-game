import React from 'react';
import { Button } from './Button';
import { AssetRepository } from '../../repositories/assetRepository';

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  variant?: 'default' | 'parchment' | 'clean';
}

export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children, variant = 'default' }) => {
  if (!isOpen) return null;

  const isParchment = variant === 'parchment';
  const isClean = variant === 'clean';

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100]"
        onClick={onClose}
        role="button"
        tabIndex={0}
        aria-label="Close modal"
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            onClose();
          }
        }}
      />
      
      {/* Modal Container */}
      <div className={`fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-[101] transition-all duration-300 animate-fade-in-up ${
        isClean 
          ? 'w-auto h-auto' 
          : isParchment 
            ? 'w-[90%] max-w-[600px] min-h-[400px] p-1 shadow-[0_20px_50px_rgba(0,0,0,0.9)]' 
            : 'bg-ui-bg-modal border-2 border-gold/40 p-6 rounded-lg min-w-[320px] shadow-[0_20px_50px_rgba(0,0,0,0.9)]'
      }`}>
        
        {isClean ? (
          /* Card Detail Mode: No wrapper box, just the card content */
          <div className="relative">
            {children}
          </div>
        ) : isParchment ? (
          /* Rules Mode: Parchment Shell */
          <div className="relative w-full h-full bg-ui-bg-parchment text-ui-text-parchment rounded-sm overflow-hidden border-[12px] border-double border-ui-border-tier1 shadow-inner">
            <div className="absolute inset-0 opacity-20 pointer-events-none mix-blend-multiply" style={{ backgroundImage: `url(${AssetRepository.getParchmentTexture()})` }} />
            <div className="relative flex justify-between items-center px-6 py-4 border-b-2 border-ui-border-tier1/20 bg-ui-bg-parchment-dark">
              <h3 className="text-text-dark font-serif text-2xl font-bold tracking-tight uppercase border-b-2 border-gold pb-1">{title}</h3>
              <button className="w-10 h-10 flex items-center justify-center text-ui-border-tier1 hover:text-red-800 transition-colors text-3xl font-bold cursor-pointer" onClick={onClose}>×</button>
            </div>
            <div className="relative p-8 max-h-[70vh] overflow-y-auto scrollbar-thin scrollbar-thumb-ui-border-tier1/40">
              {children}
            </div>
            <div className="relative h-8 bg-gradient-to-t from-ui-bg-parchment-dark to-transparent flex items-center justify-center">
               <div className="w-24 h-0.5 bg-ui-border-tier1/30" />
            </div>
          </div>
        ) : (
          /* Default Dark Panel */
          <>
            <div className="flex justify-between items-center mb-4 border-b border-gold-dark/20 pb-2">
              <h3 className="text-gold font-serif text-xl font-bold drop-shadow-md">{title}</h3>
              <Button variant="icon" onClick={onClose} aria-label={`Close ${title}`}>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </Button>
            </div>
            <div className="flex flex-col gap-4">
              {children}
            </div>
          </>
        )}
      </div>
    </>
  );
};
