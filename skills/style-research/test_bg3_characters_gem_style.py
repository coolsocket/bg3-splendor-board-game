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

    TEST_DIR = Path("src/assets/cards/style_tests_bg3")
    TEST_DIR.mkdir(parents=True, exist_ok=True)

    # Base suffix enforcing the pure edge-to-edge, extremely attractive, no text/border rule
    SUFFIX = "Splendor board game aesthetic mixed with dark fantasy. Pure 2D digital illustration filling the ENTIRE canvas edge-to-edge. Masterpiece, highly detailed face, extremely attractive, cinematic rim lighting. CRITICAL REQUIREMENT: Absolutely NO borders, NO frames, NO text, NO letters, NO signatures, NO watermarks anywhere on the image."

    STYLES = {
        "Astarion_RubyMerchant": f"A breathtakingly handsome portrait of Astarion from Baldur's Gate 3. He is a pale elf vampire rogue with silver-white curly hair and striking red eyes. He is wearing intricate dark leather nobleman armor. He is elegantly holding a massive, glowing, faceted ruby gem in his fingers, admiring it with a charming, cunning smirk. {SUFFIX}",
        
        "Gale_SapphireScholar": f"A breathtakingly handsome portrait of Gale of Waterdeep from Baldur's Gate 3. He is a human wizard with medium-length brown hair, a sharp jawline, and a neat beard. He is wearing dark purple arcane robes with silver embroidery. He is magically levitating giant, glowing uncut sapphires above an ancient tome. Soft magical blue lighting highlighting his attractive features. {SUFFIX}",
        
        "Shadowheart_OnyxCleric": f"A breathtakingly gorgeous portrait of Shadowheart from Baldur's Gate 3. She is a beautiful half-elf cleric with black hair in a braided updo and a silver circlet. She is wearing intricate dark chainmail armor. She is holding a large, flawlessly polished glowing onyx gemstone close to her chest with a secretive, devout expression. {SUFFIX}",
        
        "Karlach_InfernalDiamond": f"A breathtakingly attractive and fierce portrait of Karlach from Baldur's Gate 3. She is a female tiefling barbarian with bright red skin, glowing hot orange scars, and one broken horn. She is wearing rugged dark leather. She is playfully tossing a massive, blindingly bright uncut diamond in her hand, the heat from her skin illuminating the gem. {SUFFIX}"
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
