# Configuration Directory Overview

This directory contains the global configuration files for the BG3 Splendor Game.

## Purpose

The `config/` directory acts as the Single Source of Truth (SSOT) for all game balance constants, physical layout dimensions, and global logic keys. By centralizing these values, we ensure that changes to balance or UI scale propagate consistently throughout the application without needing to hunt down hardcoded values in individual components.

## Main Files

- `gameConfig.ts`: The central configuration file containing values for game rules (e.g., winning prestige), animation timings, and strict UI dimensions (e.g., card sizes, board widths).

## Architectural Role

This directory supports the "Physicality First" design system and the industrialization principle of "No Hardcoded Assets/Sizes". Components and Domain Logic should import constants from `gameConfig.ts` rather than hardcoding numbers. This enables easy tweaking of the game's balance and visual scaling.

## Quick Start for Newcomers

If you need to change how fast an animation plays, the size of a card, or the prestige required to win, this is the place to do it. Do not change these values directly in the React components.