# Data Module

This directory contains the static game data definitions for the BG3 Splendor game.

## Overview

The data module holds the "blueprint" for the game's entities. It defines all the available cards and patrons that populate the game world.

## Main Files

- `initialData.ts`: The primary source of game data. It defines:
    - **Tier 1 Cards**: Entry-level spells and items (e.g., Sacred Flame, Magic Missile).
    - **Tier 2 Cards**: Mid-tier abilities and legendary items (e.g., Fireball, Spirit Guardians).
    - **Tier 3 Cards**: Powerful high-level spells and artifacts (e.g., Meteor Swarm, Blood of Lathander).
    - **Patrons**: Noble/Divine entities that players can attract (e.g., Withers, Raphael, Mystra).

## Architectural Role

The Data layer provides the initial state for the game engine.
- It uses factory functions from `src/domain/logic.ts` (like `createCard` and `createPatron`) to ensure data consistency.
- It is imported by the game store (`src/store`) during initialization to set up the card decks and patron pool.
- Keeping data separate from logic allows for easier balancing and expansion of the game's content.
