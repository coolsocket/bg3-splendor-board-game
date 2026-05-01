import os
import sys
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

    print("Initializing Gemini Client via Nano Banana AuthManager...")
    auth = AuthManager()
    client = auth.get_vertex_client(location="global")

    TEST_DIR = Path("src/assets/cards/style_tests")
    TEST_DIR.mkdir(parents=True, exist_ok=True)

    STYLES = {
        "Style1_GemCrafter": "A striking, breathtakingly handsome elven rogue from Baldur's Gate 3, delicately holding a glowing, faceted ruby. Splendor board game aesthetic mixed with dark fantasy. Rich, vibrant jewel tones. Pure edge-to-edge digital illustration. He is wearing intricate dark leather armor. The background is a wealthy merchant's desk filled with raw glowing gemstones. Masterpiece, highly detailed face, extremely attractive, cinematic lighting. CRITICAL: NO borders, NO frames, NO text, NO letters, no signatures.",
        
        "Style2_MagicalAura": "A breathtakingly handsome human wizard with a sharp jawline, Baldur's Gate 3 style. He is levitating giant, glowing uncut sapphires and emeralds with his magic, blending Splendor's gem-collecting theme with dark fantasy. Soft, cinematic rim lighting highlighting his attractive features. Pure edge-to-edge digital illustration without any borders or frames. CRITICAL: NO borders, NO text, NO watermarks, no signatures.",
        
        "Style3_NoblePatron": "A gorgeous, regal female tiefling with elegant horns, posing like a noble patron from the Splendor board game but in the highly detailed Baldur's Gate 3 universe. She is adorned with subtle, raw diamond and gold accessories. Luxurious, rich background with deep velvet and glowing gems. Extremely attractive and striking facial features. Pure 2D digital painting, edge-to-edge. CRITICAL: NO borders, NO frames, NO letters, NO text.",
        
        "Style4_ActionGem": "A highly attractive, ruggedly handsome male warrior in intricate armor, holding a greatsword that trails glowing green emerald magical dust. Baldur's Gate 3 dynamic portrait infused with the gem aesthetics of Splendor. Intense, cinematic, high contrast, beautiful character design. Pure canvas, edge to edge. CRITICAL: NO borders, NO frames, NO text, NO runes, no text at the bottom."
    }

    for name, prompt in STYLES.items():
        print(f"Generating {name}...")
        out_path = TEST_DIR / f"{name}.png"
        try:
            response = client.models.generate_content(
                model="gemini-3-pro-image-preview",
                contents=[types.Content(role="user", parts=[types.Part.from_text(text=prompt)])],
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
            print(f"Error generating image for {name}: {e}")

if __name__ == "__main__":
    main()
