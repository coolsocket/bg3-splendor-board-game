import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { performance } from 'perf_hooks';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');

const log = (msg) => console.log(`\x1b[1m\x1b[36m[SUBAGENT-VERIFY]\x1b[0m ${msg}`);
const fail = (msg) => {
    console.error(`\x1b[1m\x1b[31m[FAIL]\x1b[0m ${msg}`);
    process.exit(1);
};
const pass = (msg, durationMs) => console.log(`\x1b[1m\x1b[32m[PASS]\x1b[0m ${msg} \x1b[2m(${durationMs.toFixed(2)}ms)\x1b[0m`);

const startTime = performance.now();

log('Analyzing uncommitted changes...');

let changedFiles = [];
try {
    const gitOutput = execSync('git diff --name-only HEAD', { encoding: 'utf8' });
    changedFiles = gitOutput.split('\n').filter(f => f.trim().length > 0).map(f => path.join(ROOT, f));
} catch (e) {
    fail('Git diff failed. Ensure you are in a git repository.');
}

if (changedFiles.length === 0) {
    log('No changes detected. Nothing to verify.');
    process.exit(0);
}

const tsFiles = changedFiles.filter(f => f.endsWith('.ts') || f.endsWith('.tsx'));
const uiFiles = tsFiles.filter(f => f.includes('src/components'));

log(`Found ${tsFiles.length} TS/TSX files changed (${uiFiles.length} UI components).`);

let hasErrors = false;

// 1. FAST SYNTAX CHECK (Only on changed files)
log('Running targeted syntax check...');
const tscStart = performance.now();
try {
    execSync('npm run check', { stdio: 'ignore', cwd: ROOT });
    pass('TypeScript Compilation: OK', performance.now() - tscStart);
} catch (e) {
    console.error(`\x1b[31mTypeScript Error detected in your changes. Please run 'npm run check' manually to see details and fix them.\x1b[0m`);
    hasErrors = true;
}

// 2. HARDCODE COLOR AUDIT (Only on changed UI files)
if (uiFiles.length > 0) {
    log('Running Visual Auditor on modified UI components...');
    const auditStart = performance.now();
    let auditErrors = 0;
    uiFiles.forEach(file => {
        if (!fs.existsSync(file)) return;
        const content = fs.readFileSync(file, 'utf8');
        const hexMatch = content.match(/#[0-9a-fA-F]{3,6}\b/g);
        if (hexMatch && hexMatch.length > 0) {
            console.error(`  ❌ ${path.relative(ROOT, file)}: Contains unauthorized hardcoded hex colors (${hexMatch.join(', ')}). Use CSS variables instead.`);
            auditErrors++;
        }
    });
    
    if (auditErrors > 0) {
        hasErrors = true;
    } else {
        pass('Visual Audit: OK', performance.now() - auditStart);
    }
}

// 3. LAYER INTEGRITY
const domainFiles = tsFiles.filter(f => f.includes('src/domain'));
if (domainFiles.length > 0) {
    log('Running Layer Integrity check on Domain...');
    const layerStart = performance.now();
    let layerErrors = 0;
    domainFiles.forEach(file => {
         if (!fs.existsSync(file)) return;
         const content = fs.readFileSync(file, 'utf8');
         const badImports = ['react', 'zustand', 'framer-motion', '../store', '../components'];
         badImports.forEach(imp => {
             if (content.includes(`from '${imp}'`) || content.includes(`from "${imp}"`)) {
                 console.error(`  ❌ ${path.relative(ROOT, file)}: Illegal import of '${imp}' in Domain layer.`);
                 layerErrors++;
             }
         });
    });
    if (layerErrors > 0) {
        hasErrors = true;
    } else {
        pass('Layer Integrity: OK', performance.now() - layerStart);
    }
}

const totalTime = performance.now() - startTime;
if (hasErrors) {
    fail(`VERIFICATION FAILED after ${totalTime.toFixed(2)}ms. You must fix the errors above before terminating your task.`);
} else {
    log(`\x1b[42m\x1b[30m ALL CHECKS PASSED (${totalTime.toFixed(2)}ms). YOU MAY PROCEED WITH TASK COMPLETION. \x1b[0m`);
}
