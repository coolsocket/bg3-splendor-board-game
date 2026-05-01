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

# 严格整合解剖学特征与种族设定的终极纯净插画提示词 (Ultimate Featured Prompts)
SAMPLES = [
    {
        "name": "featured_dammon",
        "desc": "Dammon (带提夫林种族特征)",
        "prompt": "An edge-to-edge full canvas portrait of Dammon, the skilled tiefling smith in Baldurs Gate 3. He has distinct tiefling anatomical features: curved dark demon horns, red skin tones, solid glowing eyes, and slightly pointed ears. His expression is intensely focused and determined as he hammers a glowing blade. The scene is illuminated by brilliant flying golden sparks and a warm divine golden aura. Cinematic lighting, deep shadows, ultra-high fidelity face. No borders, no frames, no text, no letters, no runes anywhere on the artwork."
    },
    {
        "name": "featured_dame_aylin",
        "desc": "Dame Aylin (带阿斯莫神性特征)",
        "prompt": "An edge-to-edge full canvas portrait of Dame Aylin, the immortal Aasimar paladin and daughter of Selune in Baldurs Gate 3. She has distinct Aasimar divine features: radiant feathered wings, glowing silver paladin armor, and eyes radiating brilliant silver moonlight. Her expression is fierce, furious, and righteous. She is surrounded by a powerful and holy silver aura under a dark night sky. Cinematic lighting, deep shadows, ultra-high fidelity face. No borders, no frames, no text, no letters, no runes anywhere on the artwork."
    },
    {
        "name": "featured_orpheus",
        "desc": "Prince Orpheus (带吉斯洋基人解剖特征)",
        "prompt": "An edge-to-edge full canvas portrait of Prince Orpheus, the true Githyanki prince in Baldurs Gate 3. He has distinct Githyanki anatomical features: tough yellowish-green skin, a sharp angular gaunt facial structure, a very small flat nose, elongated pointed ears, and ancient black tribal facial markings. His expression is serene, ancient, and deeply sorrowful. He floats in the deep void of the astral plane surrounded by floating silver debris and glowing blue netherese energy. Cinematic lighting, deep shadows, ultra-high fidelity face. No borders, no frames, no text, no letters, no runes anywhere on the artwork."
    },
    {
        "name": "featured_bhaal",
        "desc": "Bhaal (带神明骸骨特征)",
        "prompt": "An edge-to-edge full canvas portrait of Bhaal, the Lord of Murder in Baldurs Gate 3. He has distinct skeletal deity features: a terrifyingly wide, menacing and sinister skeletal skull with hollow glowing crimson eye sockets. Swirling crimson mist, sharp bloody daggers, and a dark necrotic bloody aura fill the entire scene. Cinematic lighting, deep shadows, ultra-high fidelity face. No borders, no frames, no text, no letters, no runes anywhere on the artwork."
    }
]

OUTPUT_DIR = Path(__file__).resolve().parent.parent / "src" / "assets" / "cards"
OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

print("开始运行带明确生物种族特征的终极示范生成...", flush=True)

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
