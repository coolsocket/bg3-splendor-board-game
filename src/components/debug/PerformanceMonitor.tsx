import React, { useState, useEffect } from 'react';
import { useGameStateStore } from '../../store/gameStateStore';

export const PerformanceMonitor: React.FC = () => {
  const [metrics, setMetrics] = useState<{ event: string; duration: string; timestamp: string }[]>([]);
  const [latency, setLatency] = useState<number | null>(null);
  const sequenceNumber = useGameStateStore(state => state.sequenceNumber);
  const currentPlayerIndex = useGameStateStore(state => state.currentPlayerIndex);
  const isDebug = new URLSearchParams(window.location.search).has('debug');

  useEffect(() => {
    if (!isDebug) return;

    // Simulate a ping every 5 seconds
    const intervalId = setInterval(() => {
      // We can use the socket to ping or just a simple fetch
      setLatency(Math.floor(Math.random() * 50) + 10); // Mock for now
    }, 5000);

    const handlePerfEvent = (e: any) => {
      const { event, duration } = e.detail;
      setMetrics(prev => [{
        event,
        duration: duration.toFixed(2) + 'ms',
        timestamp: new Date().toLocaleTimeString()
      }, ...prev].slice(0, 5));
    };

    window.addEventListener('bg3-perf-metric', handlePerfEvent);
    return () => {
      window.removeEventListener('bg3-perf-metric', handlePerfEvent);
      clearInterval(intervalId);
    };
  }, [isDebug]);

  if (!isDebug) return null;

  return (
    <div className="fixed bottom-4 left-4 z-[9999] bg-black/80 border border-[var(--color-gold-dark)] p-2 rounded-md shadow-2xl font-mono text-[10px] text-green-400 pointer-events-none min-w-[200px]">
      <div className="border-b border-[var(--color-gold-dark)]/30 mb-1 pb-1 flex justify-between items-center">
        <span className="font-bold text-amber-500 uppercase tracking-tighter">Observability Log</span>
        <div className="flex gap-2 items-center">
          <span className="text-[9px] text-blue-300">T:{currentPlayerIndex}</span>
          <span className="text-[9px] text-purple-300">#:{sequenceNumber}</span>
          {latency !== null && (
            <span className="text-[9px] text-gray-400">P:{latency}ms</span>
          )}
        </div>
      </div>
      {metrics.length === 0 ? (
        <div className="opacity-50 italic">Waiting for events...</div>
      ) : (
        metrics.map((m, i) => (
          <div key={i} className="flex gap-2">
            <span className="text-gray-500">[{m.timestamp}]</span>
            <span className="text-blue-400">{m.event}:</span>
            <span className="ml-auto font-bold">{m.duration}</span>
          </div>
        ))
      )}
    </div>
  );
};

export const logMetric = (event: string, duration: number) => {
  window.dispatchEvent(new CustomEvent('bg3-perf-metric', { detail: { event, duration } }));
};