#!/usr/bin/env node
const fs = require('fs');

try {
    const input = JSON.parse(fs.readFileSync(0, 'utf-8'));
    if (input.tool_name.includes('run_shell_command') && input.tool_input.command) {
        const cmd = input.tool_input.command;
        // If the command is a dangerous read command that might output massive amounts of text
        const isDangerousRead = cmd.startsWith('cat ') || cmd.includes('| cat') || cmd.startsWith('grep ') || cmd.includes('| grep');
        if (isDangerousRead && !cmd.includes('> docs/build_logs')) {
            console.log(JSON.stringify({
                decision: 'deny',
                reason: 'Command blocked to prevent context bloat.',
                systemMessage: `⚠️ TERMINAL HARNESS: You attempted to run a raw text-output command ('${cmd}'). To protect the context window from massive file dumps, this action was DENIED. You MUST either use 'read_file'/'grep_search' tools, OR redirect your command output to a file (e.g., ${cmd} > docs/build_logs/temp.log 2>&1; tail -n 50 docs/build_logs/temp.log).`
            }));
            process.exit(0);
        }
    }
    console.log(JSON.stringify({ decision: 'allow' }));
} catch (e) {
    console.log(JSON.stringify({ decision: 'allow' }));
}

