import {
    createGameState,
    getCurrentPlayer,
    nextTurn,
    isGameOver,
    getWinners,
    createPlayer,
} from './domain/logic';
import { CardTier } from './domain/models';
import { executeAITurn as aiExecuteTurn, SHADOWHEART_AI } from './ai/GreedyAI';
import type { Player, GameState, CardDeck, Patron } from './domain/models';
import { TIER_1_CARDS, TIER_2_CARDS, TIER_3_CARDS, ALL_PATRONS } from './data/initialData';


// ANSI color codes for pretty console output
const colors = {
    reset: '\x1b[0m',
    bright: '\x1b[1m',
    dim: '\x1b[2m',
    red: '\x1b[31m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    magenta: '\x1b[35m',
    cyan: '\x1b[36m',
};

function log(message: string, color: string = colors.reset) {
    console.log(`${color}${message}${colors.reset}`);
}

function logSection(title: string) {
    console.log('\n' + '='.repeat(70));
    log(`  ${title}`, colors.bright + colors.cyan);
    console.log('='.repeat(70) + '\n');
}

function logAction(playerName: string, action: string) {
    log(`[${playerName}] ${action}`, colors.green);
}

function logError(message: string) {
    log(`  ❌ ${message}`, colors.red);
}

function logScore(player: Player) {
    const prestigeEmoji = '⭐';
    const scoreColor = player.prestigePoints >= 15 ? colors.yellow + colors.bright : colors.blue;
    log(`  ${prestigeEmoji} ${player.name}: ${player.prestigePoints} points`, scoreColor);
}



function createCardDecks(): CardDeck[] {
    return [
        { tier: CardTier.TIER_1, cards: [...TIER_1_CARDS] },
        { tier: CardTier.TIER_2, cards: [...TIER_2_CARDS] },
        { tier: CardTier.TIER_3, cards: [...TIER_3_CARDS] },
    ];
}



function getRandomPatrons(count: number = 5): Patron[] {
    return [...ALL_PATRONS].sort(() => Math.random() - 0.5).slice(0, Math.min(count, ALL_PATRONS.length));
}

/**
 * Execute one turn for the current player using AI
 */
function executeTurn(state: GameState): GameState {
    const player = getCurrentPlayer(state);

    log(`\n--- Turn ${state.turnNumber} ---`, colors.bright);
    log(`Current Player: ${player.name}`, colors.cyan);
    logScore(player);

    // Use the AI module (both players use Shadowheart AI config in simulation)
    const result = aiExecuteTurn(state, SHADOWHEART_AI);
    logAction(player.name, result.action);

    // Check if player won any patrons
    const updatedPlayer = result.state.players.find((p) => p.id === player.id)!;
    if (updatedPlayer.patrons.length > player.patrons.length) {
        const newPatron = updatedPlayer.patrons[updatedPlayer.patrons.length - 1];
        log(
            `  🎉 ${player.name} gained patron: ${newPatron.name}! (+3 pts)`,
            colors.magenta + colors.bright
        );
    }

    return result.state;
}

/**
 * Main simulation function
 */
function simulateGame() {
    logSection('BG3 SPLENDOR - GAME SIMULATION');

    // Create players
    const gale = createPlayer('player1', 'Gale');
    const astarion = createPlayer('player2', 'Astarion');

    log(`Players: ${gale.name} vs ${astarion.name}`, colors.blue);

    // Create decks and patrons
    const decks = createCardDecks();
    const patrons = getRandomPatrons(3); // 3 patrons for a 2-player game

    log(`Patrons available: ${patrons.map((p) => p.name).join(', ')}`, colors.magenta);

    // Initialize game state
    let gameState = createGameState([gale, astarion], decks, patrons);

    log(`Game starting...\n`, colors.green + colors.bright);

    // Game loop
    let turnCount = 0;
    const maxTurns = 100; // Safety limit to prevent infinite loops

    while (!isGameOver(gameState) && turnCount < maxTurns) {
        gameState = executeTurn(gameState);
        gameState = nextTurn(gameState);
        turnCount++;
    }

    // Game over
    logSection('GAME OVER');

    const winners = getWinners(gameState);

    // Display final scores
    log('Final Scores:', colors.bright);
    for (const player of gameState.players) {
        logScore(player);
        log(`  Bonuses: ${JSON.stringify(player.bonuses)}`, colors.dim);
        log(`  Patrons: ${player.patrons.map((p) => p.name).join(', ')}`, colors.dim);
    }

    console.log('');

    if (winners.length === 1) {
        log(
            `🎊 WINNER: ${winners[0].name} with ${winners[0].prestigePoints} points! 🎊`,
            colors.yellow + colors.bright
        );
    } else {
        log(
            `🤝 TIE GAME! Winners: ${winners.map((w) => w.name).join(', ')}`,
            colors.yellow + colors.bright
        );
    }

    log(`\nTotal turns played: ${turnCount}`, colors.dim);

    if (turnCount >= maxTurns) {
        logError('Game reached maximum turn limit');
    }
}

// Run the simulation
simulateGame();
