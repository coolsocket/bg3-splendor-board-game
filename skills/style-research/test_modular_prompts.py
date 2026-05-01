import os
import sys
import json
import time
from pathlib import Path
import io
from PIL import Image

sys.path.append(os.path.expanduser('~/.gemini/jetski/global_skills/google-slides-beautifier/scripts'))
try:
    from auth_manager import AuthManager
except ImportError:
    print("Could not import AuthManager. Make sure the path is correct.")
    sys.exit(1)

from google import genai
from google.genai import types

def main():
    for var in ['http_proxy', 'https_proxy', 'all_proxy', 'no_proxy', 'HTTP_PROXY', 'HTTPS_PROXY', 'ALL_PROXY', 'NO_PROXY']:
        if var in os.environ:
            del os.environ[var]

    auth = AuthManager()
    client = auth.get_vertex_client(location="global")
    # For text gen, we can use us-central1 if global fails, but let's use the same client for now.
    # Note: gemini-2.5-pro is generally available in us-central1, so we might need a separate client for text.
    text_client = auth.get_vertex_client(location="us-central1")

    # === DICTIONARIES ===
    GLOBAL_SUFFIX = "Rendered in an intricate Baldur's Gate 3 dark fantasy style. Surrounded by an ornate, heavy 3D metallic border embedded with glowing gems. Rough parchment texture in the background. Highly detailed, masterpiece, fantasy concept art."

    TIER_PREFIXES = {
        "1": "A striking portrait of a common or foundational entity from the Sword Coast. Gritty, survival-focused aesthetic. ",
        "2": "A striking portrait of a powerful, battle-hardened entity. Dynamic magical tension and deep shadows. ",
        "3": "A striking portrait of a legendary, epic entity. Towering presence, blinding magical auras, and impeccable detail. ",
        "Patron": "A striking, god-like portrait of a mythic patron. Overwhelming cosmic power and divine authority. "
    }

    ATTR_PREFIXES = {
        "Radiant": "Embedded with glowing radiant topaz and gold accents. ",
        "Arcane": "Embedded with glowing netherese sapphire and silver accents. ",
        "Nature": "Embedded with glowing emeralds and ancient bronze accents. ",
        "Infernal": "Embedded with glowing hellfire rubies and blackened iron accents. ",
        "Dark": "Embedded with glowing necrotic amethyst and obsidian accents. "
    }

    # === LOAD 5 TEST CARDS ===
    JSON_PATH = Path("docs/UIUX/all_85_card_prompts.json")
    with open(JSON_PATH, "r", encoding="utf-8") as f:
        all_prompts = json.load(f)

    test_names = ["Sazza", "Dame Aylin", "Lord Enver Gortash", "Bhaal", "Sussur Tree"]
    test_cards = [p for p in all_prompts if p["name"] in test_names]

    TEST_DIR = Path("src/assets/cards/test_samples")
    TEST_DIR.mkdir(parents=True, exist_ok=True)

    def extract_middle(card):
        print(f"Generating Middle Segment for: {card['name']}")
        SYS_PROMPT = "You are an expert prompt writer. I will give you a character/subject from Baldur's Gate 3 and their base description. You must output EXACTLY AND ONLY 2-3 highly evocative English sentences describing their physical appearance, action, facial expression, and the immediate narrative context/emotion they are experiencing. DO NOT include background lighting, style, or 'no text' rules, as those are handled elsewhere. Focus ONLY on the subject itself."
        
        user_input = f"Subject: {card['name']}\nBase Description: {card['prompt']}"
        
        try:
            response = text_client.models.generate_content(
                model='gemini-2.5-pro',
                contents=[
                    types.Content(role="user", parts=[
                        types.Part.from_text(text=SYS_PROMPT),
                        types.Part.from_text(text=user_input)
                    ])
                ],
                config=types.GenerateContentConfig(temperature=0.7)
            )
            return response.text.strip()
        except Exception as e:
            print(f"Failed to generate middle for {card['name']}: {e}")
            return f"A highly detailed portrait of {card['name']}."

    for card in test_cards:
        tier_key = str(card.get("tier", "Patron"))
        tier_prefix = TIER_PREFIXES.get(tier_key, TIER_PREFIXES["Patron"])
        
        # Handle compound attributes like "Dark/Infernal"
        attr_raw = card.get("attribute", "None").split("/")[0].strip()
        attr_prefix = ATTR_PREFIXES.get(attr_raw, "")

        middle_segment = extract_middle(card)

        # Assemble Full Prompt
        final_prompt = tier_prefix + attr_prefix + middle_segment + " " + GLOBAL_SUFFIX
        print(f"\n--- Final Prompt for {card['name']} ---")
        print(final_prompt)
        print("---------------------------------------")

        # Generate Image
        out_path = TEST_DIR / f"{card['name'].lower().replace(' ', '_')}.png"
        print(f"Generating image: {out_path} ...")
        
        try:
            response = client.models.generate_content(
                model="gemini-3-pro-image-preview",
                contents=[types.Content(role="user", parts=[types.Part.from_text(text=final_prompt)])],
                config=types.GenerateContentConfig(
                    temperature=1,
                    response_modalities=["TEXT", "IMAGE"],
                    image_config=types.ImageConfig(aspect_ratio="1:1", image_size="1K", output_mime_type="image/png")
                )
            )
            for part in response.candidates[0].content.parts:
                if part.inline_data:
                    img = Image.open(io.BytesIO(part.inline_data.data))
                    img.save(out_path)
                    print(f"Successfully saved {out_path}")
        except Exception as e:
            print(f"Error generating image for {card['name']}: {e}")

if __name__ == "__main__":
    main()
