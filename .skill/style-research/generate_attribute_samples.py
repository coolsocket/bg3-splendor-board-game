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

# 五大属性风格示范 (Five Attributes Style Samples)
TASKS = [
    {
        "name": "style_radiant_gold",
        "desc": "Radiant (光辉/金/白)",
        "prompt": "A striking 1:1 portrait of a holy golden sunburst chalice resting on an altar bathed in divine light. Baldurs Gate 3 dark fantasy style. Framed by an ornate border with yellow diamond and sunstone gems, radiating a warm golden aura. Heavy 3D metallic feel, faded parchment texture. Game asset."
    },
    {
        "name": "style_arcane_blue",
        "desc": "Arcane (奥术/蓝)",
        "prompt": "A striking 1:1 portrait of a glowing blue magical netherese orb suspended over an ancient spellbook. Baldurs Gate 3 dark fantasy style. Framed by a polished silver border embedded with deep blue sapphires, radiating an intense sapphire aura. Heavy 3D metallic feel, deep space blue texture. Game asset."
    },
    {
        "name": "style_nature_green",
        "desc": "Nature (自然/绿)",
        "prompt": "A striking 1:1 portrait of an ancient gnarled oak branch wrapped in glowing green sylvan vines and glowing druidic runes. Baldurs Gate 3 dark fantasy style. Framed by a rusted iron border entwined with emerald gems and thorns, radiating a verdant green aura. Heavy 3D metallic feel, rough bark texture. Game asset."
    },
    {
        "name": "style_infernal_red",
        "desc": "Infernal (炼狱/红)",
        "prompt": "A striking 1:1 portrait of a cracked infernal iron broadsword pulsating with magma and glowing red heat. Baldurs Gate 3 dark fantasy style. Framed by a scorched blackened iron border embedded with rubies, radiating an aggressive crimson aura. Heavy 3D metallic feel, ash-covered leather texture. Game asset."
    },
    {
        "name": "style_dark_purple",
        "desc": "Dark (暗影/紫)",
        "prompt": "A striking 1:1 portrait of a preserved mind flayer tadpole inside a mysterious glowing purple glass vial. Baldurs Gate 3 dark fantasy style. Framed by an ancient obsidian border embedded with dark amethyst gems, radiating a sinister purple necrotic aura. Heavy 3D metallic feel, dark void texture. Game asset."
    }
]

OUTPUT_DIR = Path(__file__).resolve().parent.parent / "src" / "assets" / "cards"
OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

print("开始运行：五大属性专属视觉风格定制生成...", flush=True)

for task in TASKS:
    print(f"\n正在处理 -> {task['desc']}...", flush=True)
    contents = [types.Content(role="user", parts=[types.Part.from_text(text=task["prompt"])])]
    
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
            out_path = OUTPUT_DIR / f"{task['name']}.png"
            img.save(out_path)
            print(f"成功落盘保存至: {out_path}", flush=True)
            break
