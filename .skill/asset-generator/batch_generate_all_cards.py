import os
import time
from pathlib import Path
from google import genai
from google.genai import types
import io
from PIL import Image
from concurrent.futures import ThreadPoolExecutor
import random

# 1. 鉴权与代理配置 (遵循 gcp_auth_master / gemini_ai_studio 规范)
key_file = Path.home() / ".gemini/credentials/cloud-resource-key.json"
if key_file.exists():
    os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = str(key_file)
os.environ["GOOGLE_CLOUD_PROJECT"] = "my-website-417013"

# Nano Banana Pro 必须指定 location="global"
client = genai.Client(vertexai=True, location="global")

# 2. 高韧性重试执行器 (ResilientAIRunner)
class ResilientAIRunner:
    def __init__(self, max_workers=3, max_attempts=6, base_delay=2):
        self.max_workers = max_workers
        self.max_attempts = max_attempts
        self.base_delay = base_delay

    def execute(self, items, worker_func):
        print(f"[ResilientRunner] 开始批量生成卡面任务，总计 {len(items)} 张，最大并发数 {self.max_workers}", flush=True)
        
        def wrapped_worker(item):
            for attempt in range(self.max_attempts):
                try:
                    return worker_func(item)
                except Exception as e:
                    error_msg = str(e)
                    if "429" in error_msg or "ResourceExhausted" in error_msg or "Quota exceeded" in error_msg:
                        delay = self.base_delay * (2 ** attempt) + random.uniform(0.1, 1.0)
                        print(f"[RATE_LIMIT] 触发限流，休眠 {delay:.2f} 秒后进行第 {attempt + 1} 次重试...", flush=True)
                        time.sleep(delay)
                    else:
                        print(f"[ERROR] 非限流异常: {error_msg}", flush=True)
                        raise e
            print(f"[FAIL] 重试 {self.max_attempts} 次后任务依旧失败: {item['filename']}", flush=True)
            return None

        with ThreadPoolExecutor(max_workers=self.max_workers) as executor:
            results = list(executor.map(wrapped_worker, items))
        return results

# 3. 生成全部 65 张卡面配置表
# 一阶 (Tier 1): 30 张； 二阶 (Tier 2): 20 张； 三阶 (Tier 3): 15 张
CARDS = []

for i in range(1, 31):
    CARDS.append({
        "tier": 1,
        "filename": f"tier1_card_{i}.png",
        "prompt": f"A striking 1:1 portrait of a basic worn iron broadsword or camp item. Baldurs Gate 3 dark fantasy style. Framed by a broken, rusted iron border. Heavy 3D metallic feel, rough parchment texture. Studio lighting, deep shadows. Variant #{i}."
    })

for i in range(1, 21):
    CARDS.append({
        "tier": 2,
        "filename": f"tier2_card_{i}.png",
        "prompt": f"A striking 1:1 portrait of an enchanted bronze staff or powerful spellbook. Baldurs Gate 3 dark fantasy style. Framed by a polished bronze border with runic engravings. Heavy 3D metallic feel, rough parchment texture. Studio lighting, deep shadows. Variant #{i}."
    })

for i in range(1, 16):
    CARDS.append({
        "tier": 3,
        "filename": f"tier3_card_{i}.png",
        "prompt": f"A striking 1:1 portrait of an ancient legendary magical relic or powerful deity portrait. Baldurs Gate 3 dark fantasy style. Framed by an intricate engraved antique gold border embedded with ruby gems. Heavy 3D metallic feel, rough parchment texture. Variant #{i}."
    })

OUTPUT_DIR = Path(__file__).resolve().parent.parent / "src" / "assets" / "cards"
OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

def generate_card(task):
    out_path = OUTPUT_DIR / task["filename"]
    if out_path.exists():
        print(f"[跳过] {out_path.name} 已存在。", flush=True)
        return out_path

    print(f"开始调用生成: {task['filename']}...", flush=True)
    
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
            image = Image.open(io.BytesIO(part.inline_data.data))
            image.save(out_path)
            print(f"[成功] 写入: {out_path}", flush=True)
            return out_path
    return None

if __name__ == "__main__":
    runner = ResilientAIRunner(max_workers=3)
    runner.execute(CARDS, generate_card)
