# Global Directives for Gemini CLI (BG3 Splendor)

## AST Reflection Hook (Cognitive Guard)
*   **Trigger:** At the end of EVERY response where you discuss, execute, or analyze the "Codebase as a CLI" (bg3-ops) or AST (Abstract Syntax Tree) solutions.
*   **Action:** You MUST append a dedicated `<AST_Reflection>` block before concluding your output.
*   **Content:** In this block, you must critically analyze:
    1.  **Effectiveness:** Did the AST solution actually save time or reduce errors compared to a simpler approach (like regex or manual search)?
    2.  **Over-engineering Risk:** Is the current CLI script becoming too complex to maintain? Are we building a tool that requires more effort than the product itself?
    3.  **Future Improvement:** One specific, actionable way to make the AST engine simpler, faster, or more robust in the next iteration.
