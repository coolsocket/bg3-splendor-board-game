import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNotificationStore, type NotificationType } from '../../store/notificationStore';

const getNotificationStyle = (type: NotificationType) => {
  switch (type) {
    case 'error': return 'border-[#ff4444] bg-[#2a0808]/90 text-[#ffcccc]';
    case 'success': return 'border-[#00ff88] bg-[#082a1a]/90 text-[#ccffeb]';
    case 'warning': return 'border-[#ffaa00] bg-[#2a2008]/90 text-[#ffeedd]';
    default: return 'border-[var(--color-gold-dark)] bg-[var(--color-bg-panel-alt)]/90 text-[var(--color-parchment)]';
  }
};

export const NotificationOverlay: React.FC = () => {
  const notifications = useNotificationStore((state) => state.notifications);

  return (
    <div className="fixed top-8 left-1/2 -translate-x-1/2 z-[9999] flex flex-col gap-3 pointer-events-none w-full max-w-md px-4">
      <AnimatePresence mode="popLayout">
        {notifications.map((n) => (
          <motion.div
            key={n.id}
            initial={{ opacity: 0, y: -20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
            layout
            className={`px-6 py-3 rounded-lg border-2 shadow-[0_10px_30px_rgba(0,0,0,0.8)] backdrop-blur-md flex items-center justify-center text-center font-fantasy tracking-wide ${getNotificationStyle(n.type)}`}
          >
            {n.type === 'error' && <span className="mr-2 text-xl">⚠️</span>}
            {n.type === 'success' && <span className="mr-2 text-xl">✨</span>}
            <span className="text-sm font-bold uppercase">{n.message}</span>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};
