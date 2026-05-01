import React, { useState, useEffect } from 'react';
import { useGameStateStore } from '../../store/gameStateStore';
import { ZH, EN } from '../../data/translations';

interface TopRightHUDProps {
  onOpenSettings: () => void;
}

export const TopRightHUD: React.FC<TopRightHUDProps> = ({ onOpenSettings }) => {
  const [isConnected, setIsConnected] = useState(false);
  const [lastSync, setLastSync] = useState<number>(0);
  const language = useGameStateStore((state) => state.language);
  const toggleLanguage = useGameStateStore((state) => state.toggleLanguage);
  const t = language === 'ZH' ? ZH : EN;

  useEffect(() => {
    const checkSync = () => {
      setLastSync(useGameStateStore.getState().lastSyncTimestamp);
      setIsConnected(true);
    };

    const interval = setInterval(checkSync, 2000);
    return () => clearInterval(interval);
  }, []);

  const handleManualSync = () => {
    window.dispatchEvent(new CustomEvent('request-sync-broadcast'));
  };

  return (
    <div className="absolute top-4 right-6 z-[5000] flex items-center gap-4 bg-[var(--color-bg-panel)]/80 backdrop-blur-sm border border-[var(--color-gold-dark)]/40 rounded-xl px-4 py-2 shadow-lg shadow-black/50">
      {/* Sync Status */}
      <div className="flex items-center gap-3 border-r border-[var(--color-gold-dark)]/30 pr-4">
        <div className="flex flex-col items-end">
          <div className="flex items-center gap-2">
            <span className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500 shadow-[0_0_5px_#22c55e]' : 'bg-red-500'}`} />
            <span className="text-[10px] font-fantasy text-[var(--color-gold)]/80 uppercase tracking-tighter drop-shadow-md">
              {t.multiplayerLink}
            </span>
          </div>
          <div className="text-[9px] text-[var(--color-text-muted)]/70 font-mono">
            Last Sync: {lastSync > 0 ? new Date(lastSync).toLocaleTimeString() : 'Never'}
          </div>
        </div>
        
        <button 
          onClick={handleManualSync}
          className="p-1.5 bg-black/40 border border-[var(--color-gold-dark)]/30 rounded-md hover:bg-[var(--color-gold-dark)]/20 transition-colors group"
          title={t.forceSync}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-[var(--color-gold)]/60 group-hover:rotate-180 transition-transform duration-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        </button>
      </div>

      {/* Language Toggle */}
      <button 
        className="px-3 py-1 bg-black/40 border border-[var(--color-gold-dark)]/40 rounded text-[10px] text-[var(--color-gold)]/80 font-fantasy uppercase tracking-widest hover:bg-[var(--color-gold-dark)]/20 transition-colors shadow-inner" 
        onClick={toggleLanguage}
      >
        {language === 'ZH' ? '中' : 'EN'}
      </button>

      {/* Settings Button */}
      <button 
        className="text-xl hover:scale-110 transition-transform drop-shadow-[0_0_8px_rgba(201,160,99,0.5)] opacity-80 hover:opacity-100 pl-1" 
        onClick={onOpenSettings} 
        aria-label="Open Settings"
      >
        ⚙️
      </button>
    </div>
  );
};
