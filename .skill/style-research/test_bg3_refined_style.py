import os
import sys
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

    TEST_DIR = Path("src/assets/cards/style_tests_refined")
    TEST_DIR.mkdir(parents=True, exist_ok=True)

    STYLE_SUFFIX = "Splendor board game aesthetic mixed with Baldur's Gate 3 dark fantasy. High-quality 2D digital illustration, smooth shading, rich jewel-toned colors, masterpiece, highly detailed face. Pure edge-to-edge canvas. The background MUST be a deep, realistic, out-of-focus physical environment with strong cinematic depth of field to create a sense of distance and layering. CRITICAL: NO flat decorative borders behind the character, NO art nouveau frames, NO text, NO runes, NO watermarks."

    STYLES = {
        "Astarion_Refined": f"A breathtakingly handsome and charismatic portrait of Astarion from Baldur's Gate 3. He is a pale elf vampire rogue with silver-white curly hair and striking red eyes, wearing intricate dark leather nobleman armor. He is standing in an opulent, dimly lit aristocratic manor. Soft, volumetric lighting highlighting his charming, cunning smirk. {STYLE_SUFFIX}",
        
        "Gale_Refined": f"A breathtakingly handsome and charismatic portrait of Gale of Waterdeep from Baldur's Gate 3. He is a human wizard with medium-length brown hair, a sharp jawline, and a neat beard, wearing dark purple arcane robes with silver embroidery. He is standing in a grand, dusty magical library with a deep corridor. Soft magical blue rim lighting highlighting his attractive features. {STYLE_SUFFIX}",
        
        "Shadowheart_Refined": f"A breathtakingly gorgeous portrait of Shadowheart from Baldur's Gate 3. She is a beautiful half-elf cleric with black hair in a braided updo and a silver circlet, wearing intricate dark chainmail armor. She is standing in an ancient, moonlit ruined temple that stretches far into the background. Cool silver moonlight and deep shadows providing a strong sense of depth. {STYLE_SUFFIX}",
        
        "Karlach_Refined": f"A breathtakingly attractive and fierce portrait of Karlach from Baldur's Gate 3. She is a female tiefling barbarian with bright red skin, glowing hot orange scars, and one broken horn, wearing rugged dark leather. She is standing in a fiery, cavernous forge with glowing embers floating in the air and a deep blurred background. Intense, warm cinematic rim lighting. {STYLE_SUFFIX}"
    }

    for name, prompt in STYLES.items():
        print(f"Generating {name}...", flush=True)
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
                    print(f"Successfully saved {out_path}", flush=True)
        except Exception as e:
            print(f"Error generating image for {name}: {e}")

if __name__ == "__main__":
    main()
