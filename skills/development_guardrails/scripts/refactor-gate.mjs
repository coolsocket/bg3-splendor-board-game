import { execSync } from 'child_process';
import { performance } from 'perf_hooks';

/**
 * REFACTOR GATE: The physical enforcement for the BG3 Splendor Project.
 * Ensures that refactoring (Shadow Refactoring) does not break the core logic.
 */

const log = (msg) => console.log(`\x1b[1m\x1b[34m[REFACTOR-GATE]\x1b[0m ${msg}`);
const fail = (msg) => {
    console.error(`\x1b[1m\x1b[31m[GATE-REJECTED]\x1b[0m ${msg}`);
    process.exit(1);
};
const pass = (msg, duration) => console.log(`\x1b[1m\x1b[32m[PASS]\x1b[0m ${msg} \x1b[2m(${duration.toFixed(2)}ms)\x1b[0m`);

async function run() {
    const startTime = performance.now();
    log('Starting verification sequence...');

    // 1. AST SAFETY CHECK (Strict Build Mode)
    log('Step 1: Running AST Structural Integrity Check (tsc -b)...');
    const tscStart = performance.now();
    try {
        execSync('npx tsc -b', { stdio: 'inherit' });
        pass('AST Check: No broken references found.', performance.now() - tscStart);
    } catch (e) {
        fail('AST Check Failed: Your refactor broke code references or types.');
    }

    // 2. DOMAIN LOGIC CHECK (Vitest)
    log('Step 2: Running Domain Logic Regression Tests (vitest)...');
    const testStart = performance.now();
    try {
        execSync('npx vitest run src/domain', { stdio: 'inherit' });
        pass('Domain Logic: All core rules still match.', performance.now() - testStart);
    } catch (e) {
        fail('Logic Regression: The refactored code changed game behavior.');
    }

    // 3. CIRCULAR DEPENDENCY CHECK (Optional but recommended)
    log('Step 3: Checking for architectural leaks (Store <-> Domain)...');
    // Simple grep for prohibited imports in domain
    try {
        const checkImports = execSync('grep -r "from \'../store\'" src/domain || true', { encoding: 'utf8' });
        if (checkImports.trim()) {
            fail('Architectural Leak: Domain logic must not import from Store.');
        }
        pass('Architecture: Layer isolation preserved.', 0);
    } catch (e) {}

    const totalTime = performance.now() - startTime;
    log(`\x1b[42m\x1b[30m REFACTOR GATE PASSED (${totalTime.toFixed(2)}ms) \x1b[0m`);
    console.log('You are cleared to commit the changes.');
}

run().catch(err => {
    console.error(err);
    process.exit(1);
});
