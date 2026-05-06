#!/usr/bin/env node
const fs = require('fs');

try {
    const input = JSON.parse(fs.readFileSync(0, 'utf-8'));
    if (input.tool_name.includes('run_shell_command') && input.tool_input.command) {
        const cmd = input.tool_input.command;
        // If the command is a known verbose command and NOT wrapped
        if ((cmd.includes('npm run') || cmd.includes('tsc') || cmd.includes('vite')) && !cmd.includes('> docs/build_logs')) {
            console.log(JSON.stringify({
                decision: 'deny',
                reason: 'Command blocked to prevent context bloat.',
                systemMessage: `⚠️ TERMINAL HARNESS: You attempted to run a build/test command that may produce massive output ('${cmd}'). To protect the context window, this action was DENIED. You MUST rewrite your command to redirect output. Example: mkdir -p docs/build_logs && ${cmd} > docs/build_logs/latest.log 2>&1; tail -n 50 docs/build_logs/latest.log`
            }));
            process.exit(0);
        }
    }
    console.log(JSON.stringify({ decision: 'allow' }));
} catch (e) {
    console.log(JSON.stringify({ decision: 'allow' }));
}

