import os
import json
import time
import random
from pathlib import Path
from google import genai
from google.genai import types
import io
from PIL import Image
from concurrent.futures import ThreadPoolExecutor

import sys
sys.path.append(os.path.expanduser('~/.gemini/jetski/global_skills/google-slides-beautifier/scripts'))
try:
    from auth_manager import AuthManager
except ImportError:
    print("Could not import AuthManager. Make sure the path is correct.")
    sys.exit(1)

# 1. 鉴权与环境配置 (遵循 gcp_auth_master)
key_file = Path.home() / ".gemini/credentials/cloud-resource-key.json"
if key_file.exists():
    os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = str(key_file)
os.environ["GOOGLE_CLOUD_PROJECT"] = "my-website-417013"

for var in ['http_proxy', 'https_proxy', 'all_proxy', 'no_proxy', 'HTTP_PROXY', 'HTTPS_PROXY', 'ALL_PROXY', 'NO_PROXY']:
    if var in os.environ:
        del os.environ[var]

print("Initializing Gemini Client via Nano Banana AuthManager...")
auth = AuthManager()
client = auth.get_vertex_client(location="global")

# 2. 读取刚才生成的 85 张全量提示词蓝图
JSON_PATH = Path(__file__).resolve().parent.parent / "docs" / "UIUX" / "all_85_card_prompts.json"
PROMPTS = json.loads(JSON_PATH.read_text(encoding="utf-8"))

BASE_OUTPUT_DIR = Path(__file__).resolve().parent.parent / "src" / "assets" / "cards"

# 创建分类子目录
for sub in ["Tier1", "Tier2", "Tier3", "Patrons"]:
    (BASE_OUTPUT_DIR / sub).mkdir(parents=True, exist_ok=True)

# 3. 高韧性并发重试逻辑 (防中断断点续传)
checkpoint_file = Path(__file__).resolve().parent / "generation_checkpoint.json"

def load_completed():
    if checkpoint_file.exists():
        try:
            return set(json.loads(checkpoint_file.read_text(encoding="utf-8")))
        except:
            return set()
    return set()

completed_ids = load_completed()

def save_completed(ids):
    checkpoint_file.write_text(json.dumps(list(ids)), encoding="utf-8")

def generate_single_card(item):
    item_id = item["id"]
    if item_id in completed_ids:
        return None

    tier_folder = f"Tier{item['tier']}" if "tier" in item and item["tier"] in [1, 2, 3] else "Patrons"
    out_path = BASE_OUTPUT_DIR / tier_folder / f"{item['name'].lower().replace(' ', '_')}.png"
    
    if out_path.exists():
        completed_ids.add(item_id)
        save_completed(completed_ids)
        return out_path

    print(f"正在多模态渲染 -> {item['name']} ({tier_folder})...", flush=True)
    
    for attempt in range(6):
        try:
            contents = [types.Content(role="user", parts=[types.Part.from_text(text=item["prompt"])])]
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
                    img.save(out_path)
                    completed_ids.add(item_id)
                    save_completed(completed_ids)
                    print(f"[成功] 已落盘至: {out_path}", flush=True)
                    return out_path
        except Exception as e:
            error_msg = str(e)
            if "429" in error_msg or "ResourceExhausted" in error_msg or "Quota" in error_msg:
                delay = 2 * (2 ** attempt) + random.uniform(0.1, 1.0)
                print(f"[限流休眠] 休眠 {delay:.2f} 秒后重试...", flush=True)
                time.sleep(delay)
            else:
                print(f"[错误] {error_msg}", flush=True)
                raise e
    return None

if __name__ == "__main__":
    print(f"开始全量 85 张卡牌并发生成，分类存储，支持断点续传防中断...", flush=True)
    with ThreadPoolExecutor(max_workers=3) as executor:
        list(executor.map(generate_single_card, PROMPTS))
