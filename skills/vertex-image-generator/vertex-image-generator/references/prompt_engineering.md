# Modular Prompt Engineering

When dealing with powerful image generation models like `gemini-3-pro-image-preview`, large monolithic prompts (e.g. 500+ words) can lead to the "Pink Elephant Effect" (Negative Prompt Overload).

## The "Pink Elephant Effect"
If you heavily emphasize negative constraints in the main prompt (e.g., "ABSOLUTELY NO 3D FRAMES, NO TEXT, NO BORDERS"), the model's attention is drawn to those concepts, and it is more likely to generate them. 

## The Modular Solution

Break your prompt into 3 distinct parts to cleanly separate art direction from subject matter:

### 1. Prefixes (Lighting, Setting, Texture)
Set the foundational aesthetic. This should be driven by categories (e.g., Tier, Element).
*Example:* `"A striking portrait of a powerful entity. Embedded with glowing hellfire rubies and blackened iron accents."`

### 2. Middle (The Subject & Action)
Describe the physical subject, their action, facial expression, and the immediate narrative context. **Use an LLM (e.g., gemini-2.5-pro) to dynamically write this part based on minimal input.**
*Example:* `"Lord Gortash's handsome face is a mask of strained arrogance, a sheen of sweat on his brow as his piercing eyes assess you as either threat or tool. One hand is clenched into a white-knuckled fist..."`

### 3. Suffix (Global Rules & Aesthetic)
Define the final rendering quality and constraints. Instead of saying "NO 3D FRAMES", use positive phrasing that overrides frames, such as "cinematic depth of field", "out-of-focus background", or "edge-to-edge canvas".
*Example:* `"Rendered in an intricate dark fantasy style. The background MUST be a deep, realistic, out-of-focus physical environment with strong cinematic depth of field to create a sense of distance and layering. Highly detailed, masterpiece, fantasy concept art."`

## Summary
Never write the entire prompt manually. Write dictionaries of Prefixes and Suffixes, dynamically generate the Middle, and concatenate them before sending to the image model.