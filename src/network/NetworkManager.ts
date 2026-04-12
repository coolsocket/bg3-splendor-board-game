import { useGameSystemStore } from '../store/gameSystemStore';
import { usePublicStore } from '../store/publicStore';
import { usePlayerStore } from '../store/playerStore';
import type { GameState } from '../domain/models';

export class NetworkManager {
    private ws: WebSocket | null = null;
    private connected: boolean = false;
    private pingInterval: ReturnType<typeof setInterval> | null = null;

    constructor() {}

    connect(url?: string) {
        const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
        const wsUrl = url || `${protocol}//${window.location.host}`;

        this.ws = new WebSocket(wsUrl);

        this.ws.onopen = () => {
            console.log('[NetworkManager] Connected to server');
            this.connected = true;
        };

        this.ws.onmessage = (event) => {
            try {
                const message = JSON.parse(event.data);
                this.handleMessage(message);
            } catch (e) {
                console.error('[NetworkManager] Failed to parse message:', e);
            }
        };

        this.ws.onclose = () => {
            console.log('[NetworkManager] Disconnected from server');
            this.connected = false;
            this.stopPing();
        };

        this.ws.onerror = (error) => {
            console.error('[NetworkManager] WebSocket error:', error);
        };

        this.startPing();
    }

    private startPing() {
        this.stopPing();
        this.pingInterval = setInterval(() => {
            if (this.connected && this.ws?.readyState === WebSocket.OPEN) {
                this.send({ type: 'ping' });
            }
        }, 30000);
    }

    private stopPing() {
        if (this.pingInterval) {
            clearInterval(this.pingInterval);
            this.pingInterval = null;
        }
    }

    send(message: unknown) {
        if (this.ws && this.ws.readyState === WebSocket.OPEN) {
            this.ws.send(JSON.stringify(message));
        } else {
            console.warn('[NetworkManager] Cannot send message, socket not open');
        }
    }

    private handleMessage(message: { 
        type: string; 
        payload?: { 
            playerId?: string; 
            playerName?: string; 
            gameState?: GameState 
        } 
    }) {
        switch (message.type) {
            case 'success':
                if (message.payload?.playerId) {
                    usePlayerStore.setState({ id: message.payload.playerId });
                }
                if (message.payload?.playerName) {
                    usePlayerStore.setState({ name: message.payload.playerName });
                }
                break;
            case 'game_state_update':
                if (message.payload?.gameState) {
                    this.syncGameState(message.payload.gameState);
                }
                break;
            case 'pong':
                break;
            default:
                // Other messages can be handled here or passed to listeners
                break;
        }
    }

    private syncGameState(gameState: GameState) {
        // Sync game system store
        useGameSystemStore.setState({
            phase: gameState.phase,
            currentPlayerIndex: gameState.currentPlayerIndex,
            turnNumber: gameState.turnNumber,
            endGameTriggeredBy: gameState.endGameTriggeredBy,
        });

        // Sync public store
        usePublicStore.setState({
            availableResources: gameState.availableResources,
            decks: gameState.decks,
            faceUpCards: gameState.faceUpCards,
            availablePatrons: gameState.availablePatrons,
        });

        // Sync player store for local player
        const localPlayerId = usePlayerStore.getState().id;
        if (localPlayerId && gameState.players) {
            const localPlayer = gameState.players.find(p => p.id === localPlayerId);
            if (localPlayer) {
                usePlayerStore.setState({
                    name: localPlayer.name,
                    resources: localPlayer.resources,
                    bonuses: localPlayer.bonuses,
                    acquiredCards: localPlayer.acquiredCards,
                    reservedCards: localPlayer.reservedCards,
                    patrons: localPlayer.patrons,
                    prestigePoints: localPlayer.prestigePoints,
                });
            }
        }
    }

    disconnect() {
        if (this.ws) {
            this.ws.close();
        }
    }
}

export const networkManager = new NetworkManager();
