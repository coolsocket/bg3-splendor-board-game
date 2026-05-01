# Audio & Sound Design Strategy (音效设计规范)

This document outlines the audio strategy for BG3 Splendor, designed to enhance the "Dark Fantasy Tabletop" immersion without being overwhelming.

## 1. Core Philosophy (核心理念)
- **Diegetic Sounds**: Sounds should mimic physical tabletop interactions (parchment rustling, heavy gems clinking on wood).
- **Arcane Undertones**: Standard Splendor actions are enhanced with subtle BG3 magic motifs (whispers, arcane bursts).
- **Non-intrusive**: Audio should not fatigue the player over a 30-minute session. No loud, sharp, or repetitive abrasive sounds.

## 2. Sound Effects Mapping (音效映射表)

| Action (动作) | Description (描述) | Suggested Audio Cue (音效提示) |
| :--- | :--- | :--- |
| **Take Tokens (拿取代币)** | Selecting resources from the public pool. | Heavy gem/metal clinking (`gem_clink.mp3`). Needs to feel weighty. |
| **Discard Tokens (弃置代币)** | Returning excess tokens to the bank. | Muffled dropping or sliding sound (`token_drop.mp3`). |
| **Reserve Card (预留卡牌)** | Moving a card to the private staging area. | Parchment sliding across wood, followed by a faint mind-flayer squelch or whisper (as Tadpoles are involved) (`card_reserve.mp3`). |
| **Buy Card (招募角色)** | Spending tokens to permanently acquire a card. | A satisfying "thud" of payment, followed by a quick, sharp swoosh (sword drawing or arcane spark) (`card_buy.mp3`). |
| **Patron Visit (神祇降临)** | A Patron automatically joins the player's board. | A deep, ominous brass bell or a 2-second low choir chant (`patron_visit.mp3`). Must feel impactful. |
| **Turn Transition (回合开始)** | The `TurnAnnouncer` pops up. | A subtle, quick UI "whoosh" or page turn (`turn_start.mp3`). |
| **Victory (加冕神格)** | The game ends, showing the Ascension VFX. | An epic orchestral crescendo lasting 3-4 seconds, mixed with a divine/demonic bass drop (`victory_ascension.mp3`). |
| **Error (操作非法)** | Attempting an invalid action (e.g., cannot afford). | A dull, muted wooden thud. No harsh digital buzzers (`error_thud.mp3`). |

## 3. Technical Implementation (`useAudioStore`)
- **Centralized Dispatch**: Components should not instantiate `Audio` objects directly. They must call `useAudioStore.getState().playAudio('action_name')`.
- **Preloading**: Crucial sounds (like UI clicks or tokens) should be preloaded into the browser cache.
- **Volume Control**: The audio store must support a global volume multiplier (default 0.5) to prevent blowing out user speakers.
- **Concurrency**: The store must allow overlapping sounds (e.g., buying a card and a patron visiting almost simultaneously) by cloning audio nodes before playback.
