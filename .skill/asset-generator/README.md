# BG3 Splendor Core Tools

These tools manage the high-fidelity assets and data generation for the game.

## Scripts:
1. `batch_generate_all_cards.py`: Generates the 85 standard game cards using Vertex AI.
2. `patch_and_generate_missing.py`: Checks `initialData.ts` against available assets and generates gaps.

## Usage:
Requires Python 3.9+ and Google Cloud Vertex AI credentials.
