import React from 'react';

const cardBackSvg = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'><circle cx='50' cy='50' r='45' fill='none' stroke='rgba(139, 115, 85, 0.2)' stroke-width='1'/><circle cx='50' cy='50' r='35' fill='none' stroke='rgba(139, 115, 85, 0.1)' stroke-width='0.5'/><polygon points='50,5 90,75 10,75' fill='none' stroke='rgba(139, 115, 85, 0.15)' stroke-width='0.5'/><polygon points='50,95 90,25 10,25' fill='none' stroke='rgba(139, 115, 85, 0.15)' stroke-width='0.5'/></svg>";

export const EmptyCardSlot: React.FC = () => {
  return (
    <div 
      className="w-full aspect-[2/3] border-2 border-dashed border-[#8b7355]/30 rounded-md flex items-center justify-center text-[#E8E2D2] font-fantasy text-sm relative overflow-hidden"
      style={{
        backgroundColor: 'var(--color-card-back-bg)',
        backgroundImage: `url("${cardBackSvg}"), linear-gradient(to bottom, var(--color-card-back-gradient-start), var(--color-card-back-bg))`,
        backgroundRepeat: 'no-repeat, no-repeat',
        backgroundPosition: 'center, center',
        backgroundSize: '80%, cover'
      }}
    >
      <div 
        className="absolute top-0 left-0 w-full h-full pointer-events-none bg-no-repeat bg-center bg-[length:80%] [filter:drop-shadow(0_0_2px_rgba(139,115,85,0.3))]"
        style={{ backgroundImage: 'url(\'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200"><g fill="none" stroke="%238b7355" stroke-width="1" opacity="0.95"><circle cx="100" cy="100" r="60" stroke-dasharray="10,5,2,5"/><circle cx="100" cy="100" r="40" stroke-dasharray="20,10"/><polygon points="100,20 120,70 180,100 120,130 100,180 80,130 20,100 80,70" stroke-dasharray="15,5"/><line x1="40" y1="40" x2="160" y2="160" stroke-dasharray="30,10"/><line x1="160" y1="40" x2="40" y2="160" stroke-dasharray="5,25"/></g><path d="M50,30 L80,70 L70,100 L120,130 L140,180" fill="none" stroke="%238b7355" stroke-width="1.5" opacity="1.0"/><path d="M170,60 L130,90 L140,120 L90,150" fill="none" stroke="%238b7355" stroke-width="1.5" opacity="1.0"/></svg>\')' }}
      ></div>
    </div>
  );
};
