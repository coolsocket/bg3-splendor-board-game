import { GameArena } from './components/GameArena';
import { useGameStateStore } from './store/gameStateStore';
import { usePlayerStore } from './store/playerStore';
import { useAudioStore } from './store/audioStore';
import { PerformanceMonitor } from './components/debug/PerformanceMonitor';

function LoginScreen() {
  const players = useGameStateStore(state => state.players);
  const setPlayerName = usePlayerStore(state => state.setName);
  const resetGame = useGameStateStore(state => state.reset);
  const playBgm = useAudioStore(state => state.playBgm);
  const activeSlot = localStorage.getItem('bg3-active-slot') || 'bg3-splendor-session-1';

  const handleSlotSelect = (slot: string) => {
    localStorage.setItem('bg3-active-slot', slot);
    window.location.reload();
  };

  const handleSlotReset = () => {
    if (confirm('Are you sure you want to reset this save slot?')) {
      resetGame();
      window.location.reload();
    }
  };

  const handleJoin = (name: string) => {
    setPlayerName(name);
    playBgm();
  };

  return (
    <div className="h-screen w-screen bg-bg-base flex flex-col items-center justify-center p-4">
      <div className="bg-bg-obsidian border-2 border-[#bf953f] p-8 rounded-lg shadow-heavy max-w-md w-full text-center relative">
        <button 
          onClick={handleSlotReset}
          className="absolute top-4 right-4 text-xs text-red-500 hover:text-red-400 border border-red-500/50 hover:border-red-400 px-2 py-1 rounded"
          title="Reset current slot"
        >
          Reset Slot
        </button>
        <h1 className="text-4xl font-fantasy text-[#E8E2D2] mb-6 drop-shadow-[0_0_15px_rgba(212,175,55,0.8)]">Enter the Arena</h1>

        
        <div className="mb-6 pb-6 border-b border-[#bf953f]/30">
          <p className="text-[#a0a5b5] mb-3 text-sm font-bold uppercase tracking-widest">Select Save Slot</p>
          <div className="flex gap-2 justify-center">
            {['bg3-splendor-session-1', 'bg3-splendor-session-2', 'bg3-splendor-session-3'].map((slot, idx) => (
              <button
                key={slot}
                onClick={() => handleSlotSelect(slot)}
                className={`px-3 py-1 text-sm font-fantasy rounded border ${activeSlot === slot ? 'bg-[#bf953f] text-black border-[#bf953f]' : 'bg-black/50 text-[#bf953f] border-[#bf953f]/50 hover:bg-[#bf953f]/20'}`}
              >
                Slot {idx + 1}
              </button>
            ))}
          </div>
        </div>

        <p className="text-[#a0a5b5] mb-8 text-sm leading-relaxed">
          Select your character to join the game session. 
          <br/>
          <span className="text-[#bf953f]">Tip: Open this URL in another window to simulate a second player.</span>
        </p>
        
        <div className="flex flex-col gap-4">
          {players.map(p => (
            <button
              key={p.id}
              onClick={() => handleJoin(p.name)}
              className="bg-gradient-to-b from-[#2a1b3d] to-[#141414] border border-[#bf953f]/80 text-[#E8E2D2] hover:brightness-125 hover:shadow-[0_0_15px_rgba(212,175,55,0.6)] transition-all py-3 px-6 rounded font-fantasy text-2xl font-bold cursor-pointer"
            >
              Play as {p.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function App() {
  const localPlayerName = usePlayerStore(state => state.name);

  if (typeof window !== 'undefined') {
    (window as any).__LOCAL_PLAYER_NAME__ = localPlayerName;
  }

  if (!localPlayerName) {
    return <LoginScreen />;
  }

  return (
    <div className="app-container h-screen w-screen overflow-hidden">
      <GameArena />
      <PerformanceMonitor />
    </div>
  );
}

export default App;
