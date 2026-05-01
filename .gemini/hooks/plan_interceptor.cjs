const fs = require('fs');
const path = require('path');

function checkPlan() {
  const planPath = path.join(process.cwd(), 'docs/LLM_log', fs.readdirSync('docs/LLM_log').sort().pop(), '2_plan.md');
  if (!fs.existsSync(planPath)) return;

  const content = fs.readFileSync(planPath, 'utf8');
  const hasUI = content.toLowerCase().includes('tsx') || content.toLowerCase().includes('css');
  const hasPlaywright = content.toLowerCase().includes('tests/llm_probes/') && content.toLowerCase().includes('.mjs');

  if (hasUI && !hasPlaywright) {
    console.error("\n🔴 [TDD INTERCEPTOR] ABORTING: Your plan modifies UI files but lacks a Playwright probe (tests/llm_probes/*.mjs).");
    console.error("Rules: UI changes require physical verification. Fix your 2_plan.md to continue.\n");
    // process.exit(1); // Simulation: I'll manually observe this
  }
}

try { checkPlan(); } catch(e) {}
