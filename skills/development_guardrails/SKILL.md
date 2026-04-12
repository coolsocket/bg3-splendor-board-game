---
name: development_guardrails
version: 1.0.0
description: |
  Guardrails for avoiding common agent mistakes and adhering to user preferences
  in the BG3 Splendor project.
---

## 1. Purpose
This skill codifies the hard-earned lessons, user emphases, and common agent mistakes observed during the development of the BG3 Splendor project. It serves as a checklist and reference to ensure high-quality, industrialized output.

## 2. User Emphases (The "Do's")
- **Server Authority**: UI MUST NOT mutate state directly. It sends actions to the network manager and waits for state sync.
- **Defensive CSS**: Always use `min-width: 0` on flex items with dynamic text. Use `overflow: hidden` and `text-overflow: ellipsis`.
- **Context-Awareness**: Components must adapt to their parent container. Use Props-driven scaling (`size="sm"`) or fluid typography (`clamp()`).
- **Theme Integrity**: Maintain the Baldur's Gate 3 high-fantasy theme (parchment, dark gold, muted colors). Avoid high-saturation colors.
- **Shape Encoding**: Circles for consumables (Tokens), Diamonds/Hexagons for permanent assets (Bonuses).

## 3. Common Agent Mistakes (The "Don'ts")
- **Content-Obliviousness**: Do not assume a component will always have the same amount of space.
- **Baseline Misalignment**: Do not mix different heights (e.g., square wildcard and circular tokens) without explicit alignment normalization.
- **Empty State Black Holes**: Do not leave pure black boxes for empty lists. Use wireframes or textured placeholders.
- **Micro-Labels**: Do not put tiny, unreadable text inside small icons.
- **Ignoring Proportions**: Do not scale down elements until they become unreadable.
- **Layering Ignorance**: Do not forget to add `relative z-10` to elements inside containers with complex backgrounds or filters (like `backdrop-blur`) if they need to avoid being covered by overlays.

## 4. Architecture & Documentation Standards
- **Layered Architecture**: Stick to Pure Domain -> Store -> UI -> Network.
- **Directory READMEs**: Every major directory must have a `README.md` explaining its purpose and architecture role.
- **Industrialization Principles**: Refer to `docs/industrialization_principles.md` for scaling and decoupling guidelines.
