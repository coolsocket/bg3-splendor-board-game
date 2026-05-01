import React from 'react';

export interface HeroAvatarProps {
  imageUrl?: string;
  name: string;
  title?: string;
  quote?: string;
  className?: string;
}

export const HeroAvatar: React.FC<HeroAvatarProps> = ({
  imageUrl,
  name,
  title = "ORIGIN CHARACTER",
  quote = "FATE SPINS ALONG AS IT SHOULD",
  className = ''
}) => {
  const fullText = `${name.toUpperCase()} • ${title.toUpperCase()} • ${quote.toUpperCase()} • `;

  return (
    <div className={`relative w-full aspect-square overflow-hidden shadow-2xl ${className}`}>
      {/* 1. Underlying Character Image (1:1 crop) */}
      <div className="absolute inset-0 w-full h-full bg-[#110e0d]">
        {imageUrl ? (
          <img src={imageUrl} alt={name} className="w-full h-full object-cover transform scale-110" />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-[#2a1b3d] to-[#050505]"></div>
        )}
      </div>

      {/* 2. Unified Gothic Filigree Frame (SVG Overlay) */}
      <svg 
        viewBox="0 0 500 500" 
        className="absolute inset-0 w-full h-full pointer-events-none drop-shadow-[0_10px_20px_rgba(0,0,0,0.8)]"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Neon Red Glow Filter */}
          <filter id="neon-glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          
          {/* Metallic Bronze Gradient */}
          <linearGradient id="bronze" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#8b6534" />
            <stop offset="25%" stopColor="#b38728" />
            <stop offset="50%" stopColor="#4a3110" />
            <stop offset="75%" stopColor="#b38728" />
            <stop offset="100%" stopColor="#8b6534" />
          </linearGradient>

          {/* Mask for the circular cutout */}
          <mask id="circle-cutout">
            <rect width="500" height="500" fill="white" />
            <circle cx="250" cy="250" r="215" fill="black" />
          </mask>

          {/* Path for the circular text (matches the inner ring) */}
          <path id="text-path" d="M 250, 455 A 205,205 0 1,1 250, 45 A 205,205 0 1,1 250, 455" />
        </defs>

        {/* --- Frame Background (The square corners masking the circle) --- */}
        <rect width="500" height="500" fill="#140f0c" mask="url(#circle-cutout)" />
        
        {/* --- Outer & Inner Metallic Rings --- */}
        <rect x="5" y="5" width="490" height="490" fill="none" stroke="url(#bronze)" strokeWidth="6" rx="10" />
        <rect x="15" y="15" width="470" height="470" fill="none" stroke="url(#bronze)" strokeWidth="2" rx="5" opacity="0.5" />
        
        <circle cx="250" cy="250" r="215" fill="none" stroke="url(#bronze)" strokeWidth="6" />
        <circle cx="250" cy="250" r="195" fill="none" stroke="url(#bronze)" strokeWidth="2" opacity="0.6" />

        {/* --- Gothic Corner Decorations (Bats / Filigree) --- */}
        {/* Top Left */}
        <g fill="url(#bronze)">
          <path d="M 20,20 L 100,20 L 20,100 Z" opacity="0.3" />
          <path d="M 30,30 Q 70,30 80,80 Q 30,70 30,30" />
          {/* Bat silhouette approximation */}
          <path d="M 50,50 L 60,40 L 70,50 L 65,65 L 50,70 L 40,60 Z" />
        </g>
        {/* Top Right */}
        <g fill="url(#bronze)" transform="translate(500, 0) scale(-1, 1)">
          <path d="M 20,20 L 100,20 L 20,100 Z" opacity="0.3" />
          <path d="M 30,30 Q 70,30 80,80 Q 30,70 30,30" />
          <path d="M 50,50 L 60,40 L 70,50 L 65,65 L 50,70 L 40,60 Z" />
        </g>
        {/* Bottom Left */}
        <g fill="url(#bronze)" transform="translate(0, 500) scale(1, -1)">
          <path d="M 20,20 L 100,20 L 20,100 Z" opacity="0.3" />
          <path d="M 30,30 Q 70,30 80,80 Q 30,70 30,30" />
          <path d="M 50,50 L 60,40 L 70,50 L 65,65 L 50,70 L 40,60 Z" />
        </g>
        {/* Bottom Right */}
        <g fill="url(#bronze)" transform="translate(500, 500) scale(-1, -1)">
          <path d="M 20,20 L 100,20 L 20,100 Z" opacity="0.3" />
          <path d="M 30,30 Q 70,30 80,80 Q 30,70 30,30" />
          <path d="M 50,50 L 60,40 L 70,50 L 65,65 L 50,70 L 40,60 Z" />
        </g>

        {/* Center Top/Bottom/Sides small ornaments */}
        <g fill="url(#bronze)">
          <polygon points="240,10 260,10 250,30" />
          <polygon points="240,490 260,490 250,470" />
          <polygon points="10,240 10,260 30,250" />
          <polygon points="490,240 490,260 470,250" />
        </g>

        {/* --- Glowing Red Runic Text on the Circle --- */}
        <text 
          fill="#ff6666" 
          fontSize="22" 
          fontFamily="Cinzel, serif, 'Times New Roman'" 
          fontWeight="bold" 
          letterSpacing="4"
          filter="url(#neon-glow)"
        >
          {/* The textPath wraps the text along the circle we defined */}
          <textPath href="#text-path" startOffset="50%" textAnchor="middle">
            {fullText.repeat(2).substring(0, 100)} {/* Simple repetition to fill the circle */}
          </textPath>
        </text>
        
        {/* Crisp text layer on top of the glow */}
        <text 
          fill="#ffffff" 
          fontSize="22" 
          fontFamily="Cinzel, serif, 'Times New Roman'" 
          fontWeight="bold" 
          letterSpacing="4"
          opacity="0.9"
        >
          <textPath href="#text-path" startOffset="50%" textAnchor="middle">
            {fullText.repeat(2).substring(0, 100)}
          </textPath>
        </text>

      </svg>
    </div>
  );
};
