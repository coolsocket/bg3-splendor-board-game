#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

try {
    const input = JSON.parse(fs.readFileSync(0, 'utf-8'));
    const isBefore = !input.tool_output;
    
    // We can estimate tokens roughly: chars / 4
    let currentTokens = 0;
    if (input.history) {
        currentTokens = JSON.stringify(input.history).length / 4;
    }
    
    let message = '';
    if (isBefore) {
        message = '📊 [TOKEN AUDIT] Before "' + input.tool_name + '": ~' + Math.round(currentTokens) + ' tokens in history.';
    } else {
        const outputSize = JSON.stringify(input.tool_output).length / 4;
        message = '📊 [TOKEN AUDIT] After "' + input.tool_name + '": Output added ~' + Math.round(outputSize) + ' tokens. Total history: ~' + Math.round(currentTokens + outputSize) + ' tokens.';
    }
    
    console.log(JSON.stringify({ decision: 'allow', systemMessage: message }));
} catch (e) {
    console.log(JSON.stringify({ decision: 'allow' }));
}
