import React, { useState } from 'react';
import { useEventLogStore } from '../store/eventLogStore';
import { useGameStateStore } from '../store/gameStateStore';
import { ZH, EN } from '../data/translations';
import { AssetRepository } from '../repositories/assetRepository';
import { Drawer } from './common/Drawer';

export interface EventLogProps {
  isOpen: boolean;
  onClose: () => void;
}

export const EventLog: React.FC<EventLogProps> = ({ isOpen, onClose }) => {
  const events = useEventLogStore((state) => state.events);
  const language = useGameStateStore((state) => state.language);
  const t = language === 'ZH' ? ZH : EN;
  const [expandedEventId, setExpandedEventId] = useState<string | null>(null);

  const parseEventMessage = (message: string) => {
    try {
      if (message.startsWith('{')) {
        const data = JSON.parse(message);
        const actionType = `log_${data.action}` as keyof typeof t;
        const actionLabel = t[actionType] || data.action;
        let target = data.target || '';
        
        // Dynamic Translation of Card/Patron Names if they exist in dictionary
        if (['buy', 'reserve', 'patron'].includes(data.action)) {
            const localizedTarget = language === 'ZH' ? (ZH as any).card_names?.[target] : (EN as any).card_names?.[target];
            target = localizedTarget || target;
        }
        
        return {
          player: data.player,
          action: `${actionLabel} ${target} ${data.details || ''}`,
          isSystem: false
        };
      }
    } catch (e) {
      console.warn('Failed to parse event JSON:', message);
    }

    const parts = message.split(' ');
    if (parts[0] === 'Auto-triggered') {
      return { player: language === 'ZH' ? '系统' : 'System', action: message, isSystem: true };
    }
    return { player: parts[0], action: parts.slice(1).join(' '), isSystem: false };
  };

  return (
    <Drawer isOpen={isOpen} onClose={onClose} title={t.history}>
      <div className="relative h-full flex flex-col">
        {/* Parchment texture overlay for the log */}
        <div className="absolute inset-0 opacity-5 pointer-events-none mix-blend-overlay bg-repeat" style={{ backgroundImage: `url(${AssetRepository.getParchmentTexture()})` }} />
        
        {events.length === 0 ? (
          <div className="text-gold/30 italic text-center mt-10 font-fantasy">{t.noEvents}</div>
        ) : (
          <div className="flex flex-col gap-4 overflow-y-auto pr-2 custom-scrollbar">
            {[...events].reverse().map((event) => {
              const { player, action, isSystem } = parseEventMessage(event.message);
              const isExpanded = expandedEventId === event.id;
              
              return (
                <div 
                  key={event.id}
                  className={`relative group border-l-2 transition-all duration-300 p-3 rounded-r bg-white/5 hover:bg-white/10 cursor-pointer ${isSystem ? 'border-blue-500/50' : 'border-gold/40 hover:border-gold'}`}
                  onClick={() => setExpandedEventId(isExpanded ? null : event.id)}
                >
                  <div className="flex justify-between items-start mb-1">
                    <span className={`text-xs font-bold uppercase tracking-widest ${isSystem ? 'text-blue-300' : 'text-gold-light'}`}>{player}</span>
                    <span className="text-[10px] opacity-40 font-mono">{event.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                  <p className={`text-sm font-serif leading-relaxed ${isExpanded ? '' : 'line-clamp-2'} text-parchment/90`}>
                    {action}
                  </p>
                  
                  {isExpanded && (
                    <div className="mt-2 pt-2 border-t border-white/5 animate-fade-in bg-black/20 p-2 rounded">
                       <span className="text-[10px] uppercase font-bold text-gold/50 tracking-widest block mb-1">Chronicle Entry</span>
                       <p className="text-[12px] italic text-parchment/70 leading-relaxed font-serif">
                          {isSystem ? 'The gears of fate turn as the Underdark shifts...' : `${player} ${action}.`}
                       </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </Drawer>
  );
};
