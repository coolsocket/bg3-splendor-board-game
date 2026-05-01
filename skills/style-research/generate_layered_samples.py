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

# 严格遵循管线分层结构组装的 5 个测试样例 (Modular Layered Prompt Samples)
# 全局底色与规则层 (Global Style & Anti-Text Layer)
GLOBAL_STYLE = "Rendered in Baldurs Gate 3 dark fantasy tabletop board game style. Heavy 3D metallic feel, rough unwritten parchment texture. Studio lighting, deep shadows, highly detailed face. No text, no letters, no runes, no words anywhere on the artwork."

SAMPLES = [
    {
        "name": "sample_tier1_radiant",
        "desc": "Tier 1 | Radiant (Dammon)",
        "prompt": f"A striking 1:1 portrait of Dammon, the tiefling smith, with an intensely focused and determined facial expression, squinting carefully as golden sparks illuminate his rugged face. Framed by a plain, weathered and worn iron border. Embedded with brilliant yellow diamonds, radiating a warm golden aura. {GLOBAL_STYLE}"
    },
    {
        "name": "sample_tier2_arcane",
        "desc": "Tier 2 | Arcane (Wulbren)",
        "prompt": f"A striking 1:1 portrait of Wulbren Bongle, the runepowder gnome, with an arrogant, cold and deeply calculating facial expression. Framed by a polished bronze and smooth steel border. Embedded with deep blue sapphires, radiating an intense sapphire aura. {GLOBAL_STYLE}"
    },
    {
        "name": "sample_tier3_infernal",
        "desc": "Tier 3 | Infernal (Gortash)",
        "prompt": f"A striking 1:1 portrait of Lord Enver Gortash, with a smug, confident and politically cunning facial expression, wearing opulent dark velvet. Framed by an intricate engraved antique gold border. Embedded with fiery red rubies, radiating an aggressive crimson aura. {GLOBAL_STYLE}"
    },
    {
        "name": "sample_tier1_nature",
        "desc": "Tier 1 | Nature (Owlbear Cub)",
        "prompt": f"A striking 1:1 portrait of an Owlbear Cub, with a fierce yet adorable growling expression, showing its sharp beak. Framed by a plain, weathered and worn iron border. Embedded with vibrant emerald gems, radiating a verdant green aura. {GLOBAL_STYLE}"
    },
    {
        "name": "sample_patron_dark",
        "desc": "Patron | Dark (Shar)",
        "prompt": f"A striking 1:1 portrait of Shar, the Nightsinger goddess, with a serene yet terrifyingly empty and emotionless facial expression. Framed by an ancient twisted black obsidian border. Embedded with dark amethyst gems, radiating a sinister purple necrotic aura. {GLOBAL_STYLE}"
    }
]

OUTPUT_DIR = Path(__file__).resolve().parent.parent / "src" / "assets" / "cards"
OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

print("开始运行分层式提示词（Modular Pipeline）生成的 5 大综合样例...", flush=True)

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
