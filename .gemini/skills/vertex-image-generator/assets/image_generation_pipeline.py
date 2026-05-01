import os
import sys
import json
import time
from pathlib import Path
import io
from PIL import Image
from concurrent.futures import ThreadPoolExecutor
import random

# 1. Import Dual-Track AuthManager
sys.path.append(os.path.expanduser('~/.gemini/jetski/global_skills/google-slides-beautifier/scripts'))
try:
    from auth_manager import AuthManager
except ImportError:
    print("Could not import AuthManager. Make sure the path is correct.")
    sys.exit(1)

from google import genai
from google.genai import types

def main():
    # 2. Prevent Proxy Errors
    for var in ['http_proxy', 'https_proxy', 'all_proxy', 'no_proxy', 'HTTP_PROXY', 'HTTPS_PROXY', 'ALL_PROXY', 'NO_PROXY']:
        if var in os.environ:
            del os.environ[var]

    print("Initializing Gemini Client via Nano Banana AuthManager...")
    auth = AuthManager()
    
    # Use global for Gemini-3-pro-image-preview
    client = auth.get_vertex_client(location="global")
    # Use us-central1 for text model if needed
    text_client = auth.get_vertex_client(location="us-central1")

    # 3. Define Modular Prompts (Prefix, Middle, Suffix)
    GLOBAL_SUFFIX = "Masterpiece, highly detailed, fantasy concept art."
    PREFIX = "A striking portrait. "

    ITEMS_TO_GENERATE = [
        {"name": "Item1", "prompt": "A beautiful item."},
        {"name": "Item2", "prompt": "A fierce item."}
    ]

    OUTPUT_DIR = Path("output_images")
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    CHECKPOINT_FILE = OUTPUT_DIR / "checkpoint.json"

    def load_completed():
        if CHECKPOINT_FILE.exists():
            try:
                return set(json.loads(CHECKPOINT_FILE.read_text(encoding="utf-8")))
            except:
                return set()
        return set()

    completed_ids = load_completed()

    def save_completed(ids):
        CHECKPOINT_FILE.write_text(json.dumps(list(ids)), encoding="utf-8")

    def generate_single_item(item):
        if item["name"] in completed_ids:
            return None

        out_path = OUTPUT_DIR / f"{item['name']}.png"
        if out_path.exists():
            completed_ids.add(item["name"])
            save_completed(completed_ids)
            return out_path

        # Assemble prompt
        final_prompt = PREFIX + item["prompt"] + " " + GLOBAL_SUFFIX
        print(f"Generating {item['name']}...", flush=True)
        
        # 4. Resilient Execution Loop
        for attempt in range(6):
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
                        completed_ids.add(item["name"])
                        save_completed(completed_ids)
                        print(f"Successfully saved {out_path}", flush=True)
                        return out_path
            except Exception as e:
                error_msg = str(e)
                if "429" in error_msg or "ResourceExhausted" in error_msg or "Quota" in error_msg:
                    delay = 2 * (2 ** attempt) + random.uniform(0.1, 1.0)
                    print(f"Rate limited. Retrying in {delay:.2f}s...", flush=True)
                    time.sleep(delay)
                else:
                    print(f"Error generating image for {item['name']}: {error_msg}", flush=True)
                    raise e
        return None

    with ThreadPoolExecutor(max_workers=3) as executor:
        list(executor.map(generate_single_item, ITEMS_TO_GENERATE))

if __name__ == "__main__":
    main()
