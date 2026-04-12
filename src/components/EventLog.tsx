import React from 'react';
import { useEventLogStore } from '../store/eventLogStore';
import './EventLog.css';

export interface EventLogProps {
  isOpen: boolean;
  onClose: () => void;
}

export const EventLog: React.FC<EventLogProps> = ({ isOpen, onClose }) => {
  const events = useEventLogStore((state) => state.events);

  const parseEventMessage = (message: string) => {
    const parts = message.split(' ');
    if (parts[0] === 'Auto-triggered') {
      return { player: 'System', action: message };
    }
    const player = parts[0];
    const action = parts.slice(1).join(' ');
    return { player, action };
  };

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 transition-opacity"
          onClick={onClose}
        />
      )}
      
      {/* Drawer */}
      <div className={`event-log-drawer bg-obsidian-panel backdrop-blur-md border-l border-gold-dark/30 shadow-heavy transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : 'translate-x-full'} fixed top-0 right-0 h-full w-96 z-50 flex flex-col`}>
        <div className="event-log-header p-4 border-b border-gold-dark/20 flex justify-between items-center">
          <span className="text-gold text-lg uppercase tracking-wider font-serif font-bold">History</span>
          <button 
            onClick={onClose}
            className="text-gold hover:text-white transition-colors p-2"
            aria-label="Close History"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
        <div className="event-list-container flex-1 overflow-y-auto p-4">
          {events.length === 0 ? (
            <div className="text-parchment opacity-50 text-center mt-4">No events recorded</div>
          ) : (
            <table className="w-full text-left border-collapse table-fixed">
              <thead>
                <tr className="text-gold-dark text-xs uppercase tracking-wider border-b border-gold-dark/20">
                  <th className="pb-2 pr-2 font-serif w-20">Time</th>
                  <th className="pb-2 pr-2 font-serif w-24">Player</th>
                  <th className="pb-2 font-serif">Action</th>
                </tr>
              </thead>
              <tbody>
                {[...events].reverse().map((event) => {
                  const { player, action } = parseEventMessage(event.message);
                  return (
                    <tr key={event.id} className="text-parchment text-sm border-b border-gold-dark/10 hover:bg-white/5">
                      <td className="py-2 pr-2 whitespace-nowrap text-xs text-gold-dark opacity-70">
                        {event.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                      </td>
                      <td className="py-2 pr-2 font-bold text-gold-light truncate" title={player}>
                        {player}
                      </td>
                      <td className="py-2 truncate" title={action}>
                        {action}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </>
  );
};
