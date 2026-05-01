#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

try {
  const input = JSON.parse(fs.readFileSync(0, 'utf-8'));
  const filePath = input.tool_input.file_path;
  
  // Generic Exclusion List (Blacklist approach instead of whitelist)
  // We allow the AI to modify documentation, tests, and configs without running a prior test.
  // ANY other file modification is treated as "source code" and will be intercepted.
  const isExcluded = 
    filePath.includes('docs/LLM_log/') || 
    filePath.includes('.skill/') ||
    filePath.includes('.gemini/') ||
    filePath.includes('scripts/') ||
    filePath.match(/\.(md|json|toml|yaml)$/i) || 
    filePath.match(/(\.test\.|\.spec\.|test_[^/]+\.mjs$|^tests?\/)/i);

  if (!filePath || isExcluded) {
      console.log(JSON.stringify({ "decision": "allow" }));
      process.exit(0);
  }

  const logDir = path.resolve(process.cwd(), 'docs/LLM_log');
  
  // 1. Check if the LLM_log directory exists
  if (!fs.existsSync(logDir)) {
      console.log(JSON.stringify({
          "decision": "deny",
          "reason": "TDD ENFORCEMENT HOOK: docs/LLM_log/ directory does not exist. You must follow the 'llm-contract-workflow' and create a task log folder first.",
          "systemMessage": "🔒 Code change blocked: docs/LLM_log/ is missing."
      }));
      process.exit(0);
  }

  // 2. Check if there are any task folders
  const folders = fs.readdirSync(logDir).filter(f => fs.statSync(path.join(logDir, f)).isDirectory());
  if (folders.length === 0) {
      console.log(JSON.stringify({
          "decision": "deny",
          "reason": "TDD ENFORCEMENT HOOK: No task folders found in docs/LLM_log/. You must create a folder like docs/LLM_log/YYYYMMDD_task_name/.",
          "systemMessage": "🔒 Code change blocked: No task folder found in docs/LLM_log/."
      }));
      process.exit(0);
  }

  // Sort folders to get the most recent one based on modification time
  folders.sort((a, b) => fs.statSync(path.join(logDir, b)).mtimeMs - fs.statSync(path.join(logDir, a)).mtimeMs);
  const latestFolder = path.join(logDir, folders[0]);

  // 3. Check for the mandatory artifacts
  const requiredFiles = ['1_contract.md', '2_plan.md', '3_probes'];
  const missing = [];

  requiredFiles.forEach(file => {
      if (!fs.existsSync(path.join(latestFolder, file))) {
          missing.push(file);
      }
  });

  if (missing.length > 0) {
      console.log(JSON.stringify({
          "decision": "deny",
          "reason": `TDD ENFORCEMENT HOOK: The latest task folder (${folders[0]}) is missing required artifacts: [${missing.join(', ')}]. You MUST activate and read the 'llm-contract-workflow' skill and generate these files before modifying source code.`,
          "systemMessage": `🔒 Code change blocked: Missing [${missing.join(', ')}] in latest LLM_log. Please refer to the 'llm-contract-workflow' skill.`
      }));
      process.exit(0);
  }

  // 4. Ensure the probe was actually executed
  // Note on TDD: This enforces the "RED" phase of TDD. The AI must write and run the test 
  // (which will likely fail) BEFORE it is allowed to modify the src/ directory.
  const transcript = JSON.parse(fs.readFileSync(input.transcript_path, 'utf-8'));
  const hasRunTests = transcript.turns.some(turn => 
    turn.calls?.some(call => 
      call.tool_name === 'run_shell_command' && 
      (call.tool_input.command.includes('vitest') || 
       call.tool_input.command.includes('playwright') ||
       call.tool_input.command.includes('test_') ||
       call.tool_input.command.includes('node docs/LLM_log') ||
       call.tool_input.command.includes('npm run test'))
    )
  );

  if (!hasRunTests) {
    console.log(JSON.stringify({
      "decision": "deny",
      "reason": "TDD ENFORCEMENT HOOK: Contract files exist, but you haven't executed a test probe via run_shell_command in this session. In strict TDD, you MUST run the failing test (the RED phase) FIRST to establish the baseline before modifying src/. Please review the 'llm-contract-workflow' skill.",
      "systemMessage": "🔒 Code change blocked: Test probe not executed. Review the 'llm-contract-workflow' skill."
    }));
    process.exit(0);
  }

  // Passed all checks!
  console.log(JSON.stringify({ "decision": "allow" }));
} catch (e) {
  // Failsafe to allow if script crashes so we don't permablock the AI accidentally
  console.log(JSON.stringify({ "decision": "allow" }));
}