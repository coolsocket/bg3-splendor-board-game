import React from 'react';
import { useEventLogStore } from '../store/eventLogStore';
import { Drawer } from './common/Drawer';

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
    <Drawer isOpen={isOpen} onClose={onClose} title="History">
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
                <tr key={event.id} className="text-parchment text-sm border-b border-gold-dark/10 hover:bg-white/5 font-serif">
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
    </Drawer>
  );
};
