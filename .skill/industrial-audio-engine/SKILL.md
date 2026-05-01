# Skill: Industrial Audio Engine & Observability

This skill encapsulates the architectural pattern and testing strategy for a zero-latency, highly concurrent, and cross-browser compatible audio engine in a React/Zustand web environment.

## The Architecture (The "Howler" Standard)

Relying on raw `HTMLAudioElement` or custom `AudioContext` implementations leads to race conditions, `InvalidStateError` on cloned nodes, and runaway timeouts during rapid concurrent interactions. 

This project standardizes on **Howler.js** as the core audio orchestrator.

### Core Principles
1. **Audio Sprites for Precision**: Instead of relying on JavaScript `setTimeout` to cut off sounds, use Howler's `sprite` definitions (e.g., `sprite: { clink: [50, 250] }`). This passes the hard timing constraints directly to the C++ browser audio engine, physically preventing infinite looping or overlapping tails.
2. **Native Formats ONLY**: macOS/Safari's WebKit Web Audio API *strictly blocks* `.webm` and `DASH m4a` audio formats. All audio files MUST be pure, properly muxed `.mp3` files transcoded via `ffmpeg`.
3. **Preloading**: All SFX are instantiated with `preload: true` at the Zustand store initialization phase to ensure zero-latency playback upon user interaction.

## Capabilities & Observability

Based on the Global Strategy (`gemini.md`) **Rule #3: Verifiable Outcomes**, visual or audible validation is insufficient. The audio engine includes an automated, headless Playwright probe.

### The Telemetry Probe (`test_audio_debug.mjs`)
A Node.js script that spins up a headless Chromium instance, intercepts the `console` stream, simulates user interactions (login, clicking gems), and verifies that Howler.js successfully emits `[HowlerDebug] Loaded:` events without throwing DOM exceptions.

## Usage Guide

1. **Adding New Audio**:
   - Download the raw audio (using `yt-dlp` or similar).
   - **Crucial**: Transcode to MP3 using ffmpeg: `ffmpeg -y -v warning -i raw.file -c:a libmp3lame target.mp3`.
   - Place in `public/assets/audio/`.
   - Register the file in `audioMap` inside `src/store/audioStore.ts`.
   - Define its exact cut-off timings using a sprite in the `audioSprites` initialization block.

2. **Running the Observability Scan**:
   - Start the Vite preview server: `npm run preview -- --port 4173`.
   - In a new terminal, execute the probe: `node .skill/industrial-audio-engine/test_audio_debug.mjs`.
   - A `🟢 SYSTEM HEALTH` exit code of `0` guarantees the audio engine is fully operational at the browser layer.