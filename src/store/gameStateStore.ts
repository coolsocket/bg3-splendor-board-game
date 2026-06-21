import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { type GameState, type Player, GamePhase, CardTier, ResourceType, type GameAction } from '../domain/models';
import { TIER_1_CARDS, TIER_2_CARDS, TIER_3_CARDS, ALL_PATRONS } from '../data/initialData';
import { takeTokensAction, buyCardAction, reserveCardAction, discardTokensAction } from '../domain/actions';

interface GameStateStore extends GameState {
  language: 'EN' | 'ZH';
  lastActionId: string;
  discardingInfo: { playerId: string; amount: number } | null;
  lastSyncTimestamp: number;
  sequenceNumber: number;
  isAnimationLocked: boolean;
  setDiscardingInfo: (info: { playerId: string; amount: number } | null) => void;
  setAnimationLocked: (locked: boolean) => void;
  setGameState: (state: Partial<GameStateStore>) => void;
  dispatchAction: (action: GameAction, isRemote?: boolean) => void;
  reset: (playerNames?: string[]) => void;
  toggleLanguage: () => void;
}

const shuffle = <T>(array: T[]): T[] => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

export const createInitialState = (playerNames: string[] = ['Gale', 'Astarion']): GameState => {
  const t1Cards = shuffle([...TIER_1_CARDS]);
  const t2Cards = shuffle([...TIER_2_CARDS]);
  const t3Cards = shuffle([...TIER_3_CARDS]);

  const faceUpT1 = t1Cards.splice(0, 4);
  const faceUpT2 = t2Cards.splice(0, 4);
  const faceUpT3 = t3Cards.splice(0, 4);

  const players: Player[] = playerNames.map((name, index) => ({
    id: `player-${index + 1}`,
    name,
    resources: {
      [ResourceType.RADIANT_GEM]: 0,
      [ResourceType.ARCANE_CRYSTAL]: 0,
      [ResourceType.NATURES_BLESSING]: 0,
      [ResourceType.INFERNAL_IRON]: 0,
      [ResourceType.DARK_QUARTZ]: 0,
      [ResourceType.TRUE_SOUL_TADPOLE]: 0,
    },
    bonuses: {},
    acquiredCards: [],
    reservedCards: [],
    patrons: [],
    prestigePoints: 0,
  }));

  const playerCount = players.length;
  const tokenCount = playerCount === 2 ? 4 : playerCount === 3 ? 5 : 7;

  return {
    phase: GamePhase.IN_PROGRESS,
    players,
    currentPlayerIndex: 0,
    availableResources: {
      [ResourceType.RADIANT_GEM]: tokenCount,
      [ResourceType.ARCANE_CRYSTAL]: tokenCount,
      [ResourceType.NATURES_BLESSING]: tokenCount,
      [ResourceType.INFERNAL_IRON]: tokenCount,
      [ResourceType.DARK_QUARTZ]: tokenCount,
      [ResourceType.TRUE_SOUL_TADPOLE]: 5,
    },
    decks: {
      [CardTier.TIER_1]: t1Cards,
      [CardTier.TIER_2]: t2Cards,
      [CardTier.TIER_3]: t3Cards,
    },
    faceUpCards: {
      [CardTier.TIER_1]: faceUpT1,
      [CardTier.TIER_2]: faceUpT2,
      [CardTier.TIER_3]: faceUpT3,
    },
    availablePatrons: shuffle([...ALL_PATRONS]).slice(0, 3),
    turnNumber: 1,
  };
};

const activeSlot = localStorage.getItem('bg3-active-slot') || 'bg3-splendor-session-1';

export const useGameStateStore = create<GameStateStore>()(
  persist(
    (set) => ({
      ...createInitialState(),
      language: 'ZH',
      lastActionId: '',
      discardingInfo: null,
      lastSyncTimestamp: 0,
      sequenceNumber: 0,
      isAnimationLocked: false,
      setDiscardingInfo: (info) => set({ discardingInfo: info, lastSyncTimestamp: Date.now() }),
      setAnimationLocked: (locked) => set((state) => {
          if (state.isAnimationLocked === locked) return state;
          const nextSeq = state.sequenceNumber + 1;
          const updates = { isAnimationLocked: locked, sequenceNumber: nextSeq, lastSyncTimestamp: Date.now() };
          socket.emit('state-sync', { room: ROOM, state: { ...state, ...updates, sessionId: SESSION_ID } });
          return updates;
      }),
      setGameState: (newState) => set((state) => {
        const actionId = `action-${Date.now()}-${Math.random().toString(36).substring(7)}`;
        return { 
          ...state, 
          ...newState, 
          lastActionId: actionId,
          lastSyncTimestamp: Date.now(),
          sequenceNumber: state.sequenceNumber + 1
        };
      }),

      dispatchAction: (action, isRemote = false) => {
        let result: any;
        set((state) => {
            console.log(`[ACTION] Dispatching ${action.type} (Remote: ${isRemote}) at Sequence #${state.sequenceNumber}`);
            switch (action.type) {
              case 'TAKE_TOKENS':
                result = takeTokensAction(state, action.payload.playerId, action.payload.tokens);
                break;
              case 'BUY_CARD':
                result = buyCardAction(state, action.payload.playerId, action.payload.cardId, action.payload.fromReserved);
                break;
              case 'RESERVE_CARD':
                result = reserveCardAction(state, action.payload.playerId, action.payload.cardId, action.payload.fromDeck);
                break;
              case 'DISCARD_TOKENS':
                result = discardTokensAction(state, action.payload.playerId, action.payload.tokens);
                break;
              case 'END_TURN':
                const nextIndex = (state.currentPlayerIndex + 1) % state.players.length;
                const nextTurnNumber = nextIndex === 0 ? state.turnNumber + 1 : state.turnNumber;
                result = { success: true, data: { ...state, currentPlayerIndex: nextIndex, turnNumber: nextTurnNumber } };
                break;
              case 'RESET_GAME':
                result = { success: true, data: createInitialState(action.payload.playerNames) };
                break;
            }

            if (result?.success) {
                const nextSeq = state.sequenceNumber + 1;
                console.log(`[ACTION] Success! New Sequence: #${nextSeq}`);
                return { 
                  ...result.data, 
                  lastSyncTimestamp: Date.now(),
                  sequenceNumber: nextSeq 
                };
            } else {
                if (result?.error) console.error(`[ACTION] Failed: ${result.error}`);
                return state;
            }
        });

        if (result?.success && !isRemote) {
          socket.emit('game-action', { room: ROOM, action });
        }
      },

      reset: (playerNames) => {
          // Use dispatchAction to ensure sequence increment and network broadcast
          useGameStateStore.getState().dispatchAction({ 
            type: 'RESET_GAME', 
            payload: { playerNames: playerNames || ['Gale', 'Astarion'] } 
          });
      },
      toggleLanguage: () => set((state) => ({ language: state.language === 'EN' ? 'ZH' : 'EN' })),
    }),
    {
      name: activeSlot,
      storage: createJSONStorage(() => localStorage),

      partialize: (state) => {
        // Exclude methods, transient UI locks, and personal preferences from persistence
        const syncableState = { ...state } as any;
        delete syncableState.language;
        delete syncableState.setGameState;
        delete syncableState.reset;
        delete syncableState.toggleLanguage;
        delete syncableState.isAnimationLocked;
        return syncableState;
      },
      onRehydrateStorage: (_state) => {
        return (rehydratedState, error) => {
          if (error) {
            console.error('Failed to rehydrate game state:', error);
          } else if (rehydratedState) {
            // Validate version or force reset if state is corrupted
            if (!rehydratedState.players || rehydratedState.players.length === 0) {
                console.warn('Corrupted state detected, resetting to initial...');
                useGameStateStore.getState().reset();
            }
          }
        };
      },
    }
  )
);

// --- INTERNET MULTIPLAYER SIMULATION ---
import { io } from 'socket.io-client';

const getRoomName = () => {
  if (typeof window !== 'undefined') {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('room') || 'global';
  }
  return 'global';
};

const getSocketUrl = () => {
  if (import.meta.env?.VITE_WS_URL) return import.meta.env.VITE_WS_URL;
  if (typeof window === 'undefined') return 'http://localhost:3001';
  
  // If we are on the Vite preview port or dev port, the backend is likely on 3001
  if (window.location.port.startsWith('417') || window.location.port.startsWith('517')) {
    return 'http://localhost:3001';
  }
  
  // On Cloud Run, frontend and backend share the same origin
  return window.location.origin;
};

const ROOM = getRoomName();
const SOCKET_URL = getSocketUrl();
const SESSION_ID = Math.random().toString(36).substring(7);

const socket = io(SOCKET_URL);
let isReceiving = false;

if (typeof window !== 'undefined') { (window as any).__SOCKET__ = socket; }

socket.on('connect', () => {
  console.log(`[MULTIPLAYER] Connected to server, joining room: ${ROOM}`);
  // Clear any stale animation locks upon connection/reconnection
  useGameStateStore.setState({ isAnimationLocked: false });
  socket.emit('join-room', ROOM);
  // NEW JOINER: Request full state from others in the room
  socket.emit('request-full-state', { room: ROOM });
});

// AGGRESSIVE CATCH-UP: Request state when window regains focus
if (typeof window !== 'undefined') {
  window.addEventListener('focus', () => {
    console.log('[MULTIPLAYER] Window focused, requesting state catch-up');
    socket.emit('request-full-state', { room: ROOM });
  });
}

socket.on('player-joined', () => {
  console.log('[MULTIPLAYER] New player joined, broadcasting current state');
  const state = useGameStateStore.getState();
  const { language, setGameState, reset, toggleLanguage, dispatchAction, ...pureState } = state;
  socket.emit('state-sync', { room: ROOM, state: { ...pureState, sessionId: SESSION_ID } });
});

socket.on('game-action', (action: GameAction) => {
  console.log('[MULTIPLAYER] Received remote action:', action.type);
  useGameStateStore.getState().dispatchAction(action, true);
});

socket.on('request-full-state', () => {
  const state = useGameStateStore.getState();
  const { language, setGameState, reset, toggleLanguage, dispatchAction, ...pureState } = state;
  socket.emit('state-sync', { room: ROOM, state: { ...pureState, sessionId: SESSION_ID } });
});

// HEARTBEAT SYNC: Every 5 seconds, the authoritative client broadcasts state
if (typeof window !== 'undefined') {
  setInterval(() => {
    const state = useGameStateStore.getState();
    const localName = (window as any).__LOCAL_PLAYER_NAME__;
    const isHost = state.players[0]?.name === localName;
    
    if (isHost && !isReceiving) {
       const { language, setGameState, reset, toggleLanguage, dispatchAction, ...pureState } = state;
       socket.emit('state-sync', { room: ROOM, state: { ...pureState, sessionId: SESSION_ID } });
       console.log(`[MULTIPLAYER] Heartbeat sync sent by ${localName} (Host)`);
    }
  }, 5000);
}

// REMOVE the global subscribe that broadcasts everything. 
// We will rely on dispatchAction for sync.

socket.on('state-sync', (remoteState) => {
  const start = performance.now();
  const state = useGameStateStore.getState();
  
  // Ignore updates from our own session
  if (remoteState.sessionId === SESSION_ID) return;

  // STRICT SEQUENCE ENFORCEMENT
  // We only accept state updates that have a strictly higher sequence number.
  // If they have the same sequence number, we ignore to avoid "shimmering" or feedback loops.
  if (remoteState.sequenceNumber <= state.sequenceNumber) {
      // If we are significantly behind in time but sequence is same (impossible?), log it
      return;
  }

  console.log(`[MULTIPLAYER] SYNC -> New Seq #${remoteState.sequenceNumber} from ${remoteState.sessionId} (Internal Seq #${state.sequenceNumber})`);

  isReceiving = true;
  // Apply the remote state
  useGameStateStore.setState({
      ...remoteState,
      language: state.language // Preserve local UI setting
  });
  
  // Guard duration for ignoring local changes after sync
  setTimeout(() => { isReceiving = false; }, 100);
  
  const duration = performance.now() - start;
  import('../components/debug/PerformanceMonitor').then(m => m.logMetric('Network Sync', duration));
});

// RESILIENCE: Periodically announce room presence
setInterval(() => {
  if (socket.connected) {
    socket.emit('join-room', ROOM);
  }
}, 10000);

socket.on('animation-event', (data) => {
  const start = performance.now();
  const customEvent = new CustomEvent(data.eventName, {
    detail: { ...data.detail, fromNetwork: true }
  });
  window.dispatchEvent(customEvent);
  const duration = performance.now() - start;
  import('../components/debug/PerformanceMonitor').then(m => m.logMetric(`Anim: ${data.eventName}`, duration));
});

if (typeof window !== 'undefined') {
  window.addEventListener('request-sync-broadcast', () => {
    // Clear lock locally
    useGameStateStore.setState({ isAnimationLocked: false });
    // Increment sequence number so others will accept this manual override
    const state = useGameStateStore.getState();
    const nextSeq = state.sequenceNumber + 1;
    useGameStateStore.setState({ sequenceNumber: nextSeq });
    
    const updatedState = useGameStateStore.getState();
    const { language, setGameState, reset, toggleLanguage, dispatchAction, ...pureState } = updatedState;
    console.log(`[MULTIPLAYER] Manual Force Sync. Incremented sequence to #${nextSeq}`);
    socket.emit('state-sync', { room: ROOM, state: { ...pureState, sessionId: SESSION_ID } });
  });
}

export const broadcastAnimationEvent = (eventName: string, detail: any) => {
  if (detail?.fromNetwork) return;
  socket.emit('animation-event', { room: ROOM, eventName, detail });
};

if (typeof window !== 'undefined') { (window as any).__ZUSTAND_STORE__ = useGameStateStore; }
