import { execSync } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');

const log = (msg) => console.log(`\x1b[1m\x1b[35m[TASK-GATEWAY]\x1b[0m ${msg}`);
const fail = (msg) => {
    console.error(`\x1b[1m\x1b[31m[GATEWAY-REJECTED]\x1b[0m ${msg}`);
    process.exit(1);
};
const success = (msg) => console.log(`\x1b[1m\x1b[32m[GATEWAY-ACCEPTED]\x1b[0m ${msg}`);

const commitMsg = process.argv.slice(2).join(' ');

if (!commitMsg) {
    fail('You must provide a commit message. Usage: node scripts/subagent-complete.mjs "feat: my changes"');
}

log('Step 1: Running stringent pre-commit verification...');
try {
    // Run the verify script. It will print its own logs.
    execSync('node scripts/subagent-verify.mjs', { stdio: 'inherit', cwd: ROOT });
} catch (e) {
    fail('Verification failed. You must fix the errors shown above before completing the task.');
}

log('Step 2: Verification passed. Committing changes to Git history...');
try {
    execSync('git add .', { cwd: ROOT });
    const gitOutput = execSync(`git commit -m "${commitMsg}"`, { encoding: 'utf8', cwd: ROOT });
    console.log(gitOutput);
    success('Task completed and safely recorded in Git history. You may now terminate.');
} catch (e) {
    // Git commit might fail if there's nothing to commit
    if (e.stdout && e.stdout.includes('nothing to commit')) {
        success('Verification passed, but there were no changes to commit. You may terminate.');
    } else {
        fail(`Git commit failed: ${e.message}`);
    }
}
