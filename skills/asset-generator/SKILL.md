# Skill: BG3 Splendor Asset Generator

This skill encapsulates the logic for generating high-fidelity digital illustrations for cards and patrons using Vertex AI.

## Capabilities
- **Batch Generation**: Generate all 85 categorized cards based on predefined prompts.
- **Delta Patching**: Automatically detect missing assets in `src/assets/cards/` based on `initialData.ts` and generate only the gaps.
- **Lore Alignment**: Prompts are tuned for "breathtakingly handsome/gorgeous" humanoids and "lore-accurate" monsters.

## Available Tools
- `batch_generate_all_cards.py`: The main entry point for a full set generation.
- `patch_and_generate_missing.py`: The daily maintenance tool for asset consistency.

## Usage Guide
1. Ensure Google Cloud credentials are set in the environment.
2. Run `python3 .skill/asset-generator/patch_and_generate_missing.py`.
3. The script now updates `src/data/cardData.ts` with the correct `assetId`.
4. The frontend automatically consumes these via `AssetRepository.getArt(assetId)`.
