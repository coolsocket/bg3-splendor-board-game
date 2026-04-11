import React from 'react';
import { useEventLogStore } from '../store/eventLogStore';
import './EventLog.css';

export const EventLog: React.FC = () => {
  const events = useEventLogStore((state) => state.events);

  if (events.length === 0) return null;

  return (
    <div className="event-log-container bg-obsidian-panel backdrop-blur-sm border border-gold-dark/30 rounded-lg p-2">
      <div className="event-log-header text-gold text-xs uppercase tracking-wider font-serif mb-1 border-bottom border-gold-dark/20 pb-1">
        History
      </div>
      <div className="event-list flex flex-col gap-1">
        {events.map((event) => (
          <div key={event.id} className="event-item text-parchment text-xs flex justify-between items-center gap-2">
            <span className="event-message flex-1">{event.message}</span>
            <span className="event-time text-gold-dark opacity-70 text-2xs">
              {event.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
