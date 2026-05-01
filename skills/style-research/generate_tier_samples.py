import os
from pathlib import Path
from google import genai
from google.genai import types
import io
from PIL import Image

# 1. 配置代理与身份验证 (gcp_auth_master / gemini_ai_studio)
key_file = Path.home() / ".gemini/credentials/cloud-resource-key.json"
if key_file.exists():
    os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = str(key_file)
os.environ["GOOGLE_CLOUD_PROJECT"] = "my-website-417013"

client = genai.Client(vertexai=True, location="global")

# 2. 动态扩充的精细化提示词库 (Pipeline Prompt Expansion & Roster Mapping)
TASKS = [
    {
        "name": "tier1_dammon",
        "desc": "Tier 1 (Dammon, Radiant/Gold Gem)",
        "prompt": "A striking 1:1 portrait of Dammon, the skilled tiefling hellrider smith working an anvil, with faint golden sparks flying. Baldurs Gate 3 dark fantasy style. Framed by a worn iron border with mossy earth tones, signaling a Tier 1 card. Heavy 3D metallic feel, rough parchment texture. Game asset."
    },
    {
        "name": "tier2_dame_aylin",
        "desc": "Tier 2 (Dame Aylin, Radiant/Gold Gem)",
        "prompt": "A striking 1:1 portrait of Dame Aylin, the immortal Nightsong with radiant wings and glowing silver paladin armor under moonlight. Baldurs Gate 3 dark fantasy style. Framed by a polished bronze and steel border with silver corners, signaling a Tier 2 card. Heavy 3D metallic feel, obsidian leather texture. Game asset."
    },
    {
        "name": "tier3_prince_orpheus",
        "desc": "Tier 3 (Prince Orpheus, Arcane/Blue Gem)",
        "prompt": "A striking 1:1 portrait of Prince Orpheus, the true Githyanki prince in ancient monastic robes, floating in the astral plane with blue runes. Baldurs Gate 3 dark fantasy style. Framed by an intricate engraved antique gold and platinum border embedded with sapphire gems, signaling a Tier 3 card. Heavy 3D metallic feel, velvet cloth texture. Game asset."
    },
    {
        "name": "patron_bhaal",
        "desc": "Patron (Bhaal, Lord of Murder)",
        "prompt": "A striking portrait of Bhaal, the Lord of Murder, a skeletal divine entity surrounded by swirling crimson essence and daggers. Baldurs Gate 3 dark fantasy style. Framed by an ancient twisted black obsidian border dripping with blood, signaling a Patron card. Heavy 3D metallic feel, blood-stained parchment texture. Game asset."
    }
]

OUTPUT_DIR = Path(__file__).resolve().parent.parent / "src" / "assets" / "cards"
OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

print("开始运行精准管线：动态生成 Tier 1~3 示范卡面及 Patron 画像...", flush=True)

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
