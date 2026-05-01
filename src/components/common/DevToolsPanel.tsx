import React, { useState } from 'react';
import { useGameStateStore } from '../../store/gameStateStore';
import { ResourceType, GamePhase } from '../../domain/models';
import { GAME_CONFIG } from '../../config/gameConfig';

export const DevToolsPanel: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const setGameState = useGameStateStore((state) => state.setGameState);
  const players = useGameStateStore((state) => state.players);
  const currentPlayerIndex = useGameStateStore((state) => state.currentPlayerIndex);

  const currentPlayer = players[currentPlayerIndex];

  const handleAddGems = () => {
    if (!currentPlayer) return;
    const newPlayers = [...players];
    const newResources = { ...currentPlayer.resources };
    Object.values(ResourceType).forEach(type => {
        newResources[type] = (newResources[type] || 0) + 1;
    });
    newPlayers[currentPlayerIndex] = { ...currentPlayer, resources: newResources };
    setGameState({ players: newPlayers });
  };

  const handleAddPoints = () => {
    if (!currentPlayer) return;
    const newPlayers = [...players];
    newPlayers[currentPlayerIndex] = { 
        ...currentPlayer, 
        prestigePoints: currentPlayer.prestigePoints + 5 
    };
    
    let phase = useGameStateStore.getState().phase;
    if (newPlayers[currentPlayerIndex].prestigePoints >= GAME_CONFIG.WINNING_PRESTIGE) {
        phase = GamePhase.COMPLETED;
    }
    
    setGameState({ players: newPlayers, phase });
  };

  const handleInstantWin = () => {
    if (!currentPlayer) return;
    const newPlayers = [...players];
    newPlayers[currentPlayerIndex] = { 
        ...currentPlayer, 
        prestigePoints: GAME_CONFIG.WINNING_PRESTIGE 
    };
    setGameState({ players: newPlayers, phase: GamePhase.COMPLETED });
  };

  if (!isOpen) {
    return (
      <button 
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 z-[9999] bg-red-900/80 text-white text-xs px-2 py-1 rounded border border-red-500 opacity-50 hover:opacity-100 font-mono"
      >
        DEV
      </button>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 z-[9999] bg-black/90 border-2 border-red-500 rounded p-4 shadow-[0_0_20px_rgba(255,0,0,0.4)] w-64 font-mono text-xs">
      <div className="flex justify-between items-center border-b border-red-500/50 pb-2 mb-3">
        <span className="text-red-400 font-bold">DEV TOOLS (Cheats)</span>
        <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-white px-2 py-1 bg-gray-800 rounded">Close</button>
      </div>
      
      <div className="space-y-2">
        <p className="text-gray-300">Target: <strong className="text-white">{currentPlayer?.name || 'None'}</strong></p>
        
        <button 
          onClick={handleAddGems}
          className="w-full bg-blue-900/60 hover:bg-blue-800 border border-blue-500/50 text-white py-1.5 rounded transition-colors"
        >
          +1 All Gems
        </button>
        
        <button 
          onClick={handleAddPoints}
          className="w-full bg-purple-900/60 hover:bg-purple-800 border border-purple-500/50 text-white py-1.5 rounded transition-colors"
        >
          +5 Prestige Points
        </button>

        <button 
          onClick={handleInstantWin}
          className="w-full bg-red-900/60 hover:bg-red-800 border border-red-500/50 text-white py-1.5 rounded transition-colors font-bold"
        >
          Instant Win (18 pts)
        </button>

        <button 
          onClick={() => {
            if (!currentPlayer) return;
            const newPlayers = [...players];
            newPlayers[currentPlayerIndex] = { ...currentPlayer, resources: { RADIANT_GEM: 4, ARCANE_CRYSTAL: 4 } as any };
            setGameState({ players: newPlayers });
          }}
          className="w-full bg-green-900/60 hover:bg-green-800 border border-green-500/50 text-white py-1.5 rounded transition-colors font-bold"
        >
          Inject 8 Gems
        </button>
      </div>
    </div>
  );
};
