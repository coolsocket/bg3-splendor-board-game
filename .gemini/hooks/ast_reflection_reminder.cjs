#!/usr/bin/env node
const fs = require('fs');

try {
    const input = JSON.parse(fs.readFileSync(0, 'utf-8'));
    const toolName = input.tool_name;
    const toolInput = input.tool_input;

    let needsReminder = false;

    if (toolName === 'run_shell_command' && toolInput.command) {
        if (toolInput.command.includes('bg3-ops') || 
            toolInput.command.includes('subagent-verify') || 
            toolInput.command.includes('subagent-complete')) {
            needsReminder = true;
        }
    } else if (toolName === 'invoke_agent') {
        needsReminder = true;
    }

    if (needsReminder) {
        console.log(JSON.stringify({
            decision: "allow",
            systemMessage: "⚠️ COGNITIVE GUARD ACTIVE: You just used a high-leverage AST or Subagent tool. You MUST append an <AST_Reflection> block at the end of your final response to evaluate Effectiveness, Over-engineering Risk, and Future Improvement. Do NOT forget!"
        }));
    } else {
        console.log(JSON.stringify({ decision: "allow" }));
    }
} catch (e) {
    console.error(e.message);
    console.log(JSON.stringify({ decision: "allow" }));
}