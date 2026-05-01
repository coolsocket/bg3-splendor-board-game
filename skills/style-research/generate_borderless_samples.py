import os
from pathlib import Path
from google import genai
from google.genai import types
import io
from PIL import Image

key_file = Path.home() / ".gemini/credentials/cloud-resource-key.json"
if key_file.exists():
    os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = str(key_file)
os.environ["GOOGLE_CLOUD_PROJECT"] = "my-website-417013"

client = genai.Client(vertexai=True, location="global")

# 纯净全画幅无画框插画 (Pure Edge-to-Edge Borderless Samples)
SAMPLES = [
    {
        "name": "borderless_dammon",
        "desc": "Dammon (纯净插图版)",
        "prompt": "An edge-to-edge full canvas portrait of Dammon, the tiefling smith, with an intensely focused and determined facial expression as he works over an anvil. Baldurs Gate 3 dark fantasy style. The scene is illuminated by brilliant flying golden sparks and a warm divine golden aura. Cinematic lighting, deep shadows, ultra-high fidelity face. No borders, no frames, no text, no letters, no runes anywhere on the artwork."
    },
    {
        "name": "borderless_dame_aylin",
        "desc": "Dame Aylin (纯净插图版)",
        "prompt": "An edge-to-edge full canvas portrait of Dame Aylin, the immortal paladin, with a fierce, furious and righteous battle expression. Baldurs Gate 3 dark fantasy style. Her ancient silver armor reflects brilliant moonlight, surrounded by a powerful and holy silver aura. Cinematic lighting, deep shadows, ultra-high fidelity face. No borders, no frames, no text, no letters, no runes anywhere on the artwork."
    },
    {
        "name": "borderless_orpheus",
        "desc": "Prince Orpheus (纯净插图版)",
        "prompt": "An edge-to-edge full canvas portrait of Prince Orpheus, the Githyanki prince, with a serene, ancient and deeply sorrowful facial expression. Baldurs Gate 3 dark fantasy style. He floats in the void of the astral plane, illuminated by glowing blue netherese energy and an intense sapphire aura. Cinematic lighting, deep shadows, ultra-high fidelity face. No borders, no frames, no text, no letters, no runes anywhere on the artwork."
    },
    {
        "name": "borderless_bhaal",
        "desc": "Bhaal (纯净插图版)",
        "prompt": "An edge-to-edge full canvas portrait of Bhaal, the Lord of Murder, staring directly forward with a terrifyingly wide, menacing and sinister skeletal smirk. Baldurs Gate 3 dark fantasy style. Swirling crimson mist and a dark bloody aura fill the entire scene. Cinematic lighting, deep shadows, ultra-high fidelity face. No borders, no frames, no text, no letters, no runes anywhere on the artwork."
    }
]

OUTPUT_DIR = Path(__file__).resolve().parent.parent / "src" / "assets" / "cards"
OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

print("开始运行纯净无边框全画幅插画生成任务...", flush=True)

for sample in SAMPLES:
    print(f"\n正在处理 -> {sample['desc']}...", flush=True)
    contents = [types.Content(role="user", parts=[types.Part.from_text(text=sample["prompt"])])]
    
    config = types.GenerateContentConfig(
        temperature=1,
        top_p=0.95,
        max_output_tokens=32768,
        response_modalities=["TEXT", "IMAGE"],
        image_config=types.ImageConfig(aspect_ratio="1:1", image_size="1K", output_mime_type="image/png")
    )

    response = client.models.generate_content(
        model="gemini-3-pro-image-preview",
        contents=contents,
        config=config
    )

    for part in response.candidates[0].content.parts:
        if part.inline_data:
            img = Image.open(io.BytesIO(part.inline_data.data))
            out_path = OUTPUT_DIR / f"{sample['name']}.png"
            img.save(out_path)
            print(f"成功落盘保存至: {out_path}", flush=True)
            break
