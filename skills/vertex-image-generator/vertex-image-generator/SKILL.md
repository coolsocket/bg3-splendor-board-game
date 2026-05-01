---
name: vertex-image-generator
description: Use this skill when you need to batch generate high-quality images using Google Vertex AI (gemini-3-pro-image-preview) with resilient retry logic, dual-track authentication, and modular prompt engineering.
---

# Vertex Image Generator Pipeline

This skill provides a robust, industrialized pipeline for batch-generating images using Vertex AI. It is designed to handle rate limits, avoid proxy issues, and use a modular prompt engineering approach to ensure high-quality, consistent output (e.g., for board game assets, dark fantasy portraits).

## Workflow

When tasked with generating a batch of images, follow this workflow:

1. **Clean Environment**: Always unset HTTP proxies before initializing Vertex AI clients to prevent `httpx.InvalidURL` errors.
2. **Dual-Track Authentication**: Import and use `AuthManager` from `~/.gemini/jetski/global_skills/google-slides-beautifier/scripts/auth_manager.py` to get the correct Vertex AI client.
3. **Modular Prompting**: Do not use massive monolithic prompts. Split prompts into fixed Prefix (Style/Tier), dynamically generated Middle (Subject), and fixed Suffix (Global Rules).
4. **Resilient Execution**: Use a ThreadPoolExecutor with exponential backoff for rate limits (429 errors).
5. **Use the Boilerplate**: Use the provided `image_generation_pipeline.py` script as your foundation.

## References

- See `references/prompt_engineering.md` for guidelines on how to structure the modular prompt to avoid "pink elephant" negative prompt issues and achieve high-quality results.

## Assets

- `assets/image_generation_pipeline.py`: A complete, ready-to-run boilerplate script that implements auth, modular prompting, and resilient batch generation. Copy this file into your workspace and modify the `PROMPTS`, `STYLES`, and `OUTPUT_DIR` variables to fit the current task.