# AI Module

This directory contains the artificial intelligence logic for the BG3 Splendor game.

## Overview

The AI module is responsible for making automated decisions for computer-controlled players. It uses a greedy strategy that can be configured with different personalities and tactical preferences.

## Main Files

- `greedyAI.ts`: The core implementation of the greedy AI. It includes:
    - **Turn Execution**: Logic to choose between buying cards, reserving cards, or taking tokens.
    - **Scoring System**: Evaluates cards based on point values and alignment with Patron requirements.
    - **Tadpole Strategy**: Strategic use of "True Soul Tadpole" (wildcard) resources.
    - **Character Personalities**: Pre-defined configurations for BG3 companions (Shadowheart, Astarion, Gale, Lae'zel, Wyll, Karlach), each with unique behaviors.

## Architectural Role

The AI module interacts with the `domain` layer to:
1.  Read the current `GameState`.
2.  Use `logic` to evaluate possibilities (e.g., can afford card).
3.  Dispatch `actions` to generate new game states.

It acts as a consumer of the game's core logic, simulating a human player's decision-making process.
