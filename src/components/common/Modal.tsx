import React from 'react';

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/60 z-50"
        onClick={onClose}
      />
      {/* Modal */}
      <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-obsidian-panel border border-gold-dark/30 p-6 rounded-lg z-50 shadow-heavy min-w-[300px] font-serif">
        <div className="flex justify-between items-center mb-4 border-b border-gold-dark/20 pb-2">
          <h3 className="text-gold font-serif text-lg font-bold">{title}</h3>
          <button 
            onClick={onClose}
            className="text-gold hover:text-white transition-colors"
            aria-label={`Close ${title}`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
        <div className="flex flex-col gap-4">
          {children}
        </div>
      </div>
    </>
  );
};
