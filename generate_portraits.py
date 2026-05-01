import os
import sys

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
    
    # We use the standard imagen model in us-central1 to ensure generation works
    client = auth.get_vertex_client(location="us-central1")

    # 三段式提示词架构 (Prefix, Middle, Suffix) - 移除边框描述，只专注角色本体
    PREFIX = (
        "A stunning 1:1 fantasy oil painting character portrait, extreme close-up on the face and upper chest. "
        "The character is positioned centrally with perfect symmetry. "
    )

    SUFFIX = (
        " The background is a dimly lit, ancient stone castle interior with lit candles, "
        "deep shadows, and floating glowing red embers in the air. Classical Renaissance oil painting style, "
        "dark fantasy Dungeons and Dragons aesthetic, dramatic chiaroscuro lighting, intricate 8k details, highly realistic, masterpiece."
    )

    prompts = {
        "src/assets/portraits/gale_portrait.png": (
            PREFIX + 
            "Gale from Baldur's Gate 3, a handsome human wizard with medium-length wavy brown hair and a short beard, "
            "smirking slightly. He is wearing intricate dark leather armor with purple arcane accents and a silver brooch." + 
            SUFFIX
        ),
        "src/assets/portraits/karlach_portrait.png": (
            PREFIX + 
            "Karlach from Baldur's Gate 3, a fierce but joyful female tiefling barbarian with bright red skin, "
            "glowing hot orange scars across her chest and neck, and one broken horn. She is wearing rugged dark leather armor, "
            "radiating intense heat." + 
            SUFFIX
        ),
        "src/assets/portraits/shadowheart_portrait.png": (
            PREFIX + 
            "Shadowheart from Baldur's Gate 3, a beautiful half-elf cleric of Shar with black hair in a braided updo "
            "and a silver circlet on her forehead. She is wearing intricate dark chainmail armor with silver holy symbols, "
            "looking forward with a guarded but piercing gaze." + 
            SUFFIX
        )
    }

    for filename, prompt in prompts.items():
        print(f"\nGenerating image for {filename}...")
        try:
            response = client.models.generate_images(
                model='imagen-3.0-generate-002',
                prompt=prompt,
                config=types.GenerateImagesConfig(
                    number_of_images=1,
                    aspect_ratio="1:1",
                    output_mime_type="image/png"
                )
            )
            if response.generated_images:
                image_bytes = response.generated_images[0].image.image_bytes
                with open(filename, 'wb') as f:
                    f.write(image_bytes)
                print(f"Successfully saved {filename}")
            else:
                print(f"Failed: No image generated for {filename}")
        except Exception as e:
            print(f"Error generating {filename}: {e}")

if __name__ == "__main__":
    main()