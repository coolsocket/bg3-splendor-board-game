import os
import time
import sys
from pathlib import Path
from google import genai
from PIL import Image
import io

# 引用并行重试器逻辑 (如果需要独立运行，直接内嵌该高韧性重试模块)
import random
from concurrent.futures import ThreadPoolExecutor

class ResilientAIRunner:
    def __init__(self, max_workers=3, max_attempts=6, base_delay=2):
        self.max_workers = max_workers
        self.max_attempts = max_attempts
        self.base_delay = base_delay

    def execute(self, items, worker_func):
        print(f"[ResilientRunner] 开始批量生成图像任务，总数: {len(items)}，并发数: {self.max_workers}", flush=True)
        
        def wrapped_worker(item):
            for attempt in range(self.max_attempts):
                try:
                    return worker_func(item)
                except Exception as e:
                    error_msg = str(e)
                    if "429" in error_msg or "ResourceExhausted" in error_msg or "Quota exceeded" in error_msg:
                        delay = self.base_delay * (2 ** attempt) + random.uniform(0.1, 1.0)
                        print(f"[RATE_LIMIT] 触发配额限流，休眠 {delay:.2f} 秒后进行第 {attempt + 1} 次重试...", flush=True)
                        time.sleep(delay)
                    else:
                        print(f"[ERROR] 触发非限流错误: {error_msg}", flush=True)
                        raise e
            raise Exception(f"任务失败：重试 {self.max_attempts} 次后依旧配额不足。")

        with ThreadPoolExecutor(max_workers=self.max_workers) as executor:
            results = list(executor.map(wrapped_worker, items))
        return results

# 1. 代理与鉴权配置 (遵循 gemini_ai_studio Skill 规范)
os.environ['http_proxy'] = 'http://[::1]:3128'
os.environ['https_proxy'] = 'http://[::1]:3128'
os.environ['no_proxy'] = ''

# 2. 加载本地 API Key
key_path = Path.home() / '.gemini/credentials/ai-studio-key.txt'
if not key_path.exists():
    print(f"错误: 找不到 API Key 文件 -> {key_path}")
    sys.exit(1)

api_key = key_path.read_text().strip()
client = genai.Client(api_key=api_key)

# 3. 批量定义的卡牌绘制任务
PROMPTS = [
    {
        "name": "Astarion", 
        "prompt": "A striking portrait of Astarion, pale elf vampire rogue with silver-white hair. Rendered in Baldurs Gate 3 dark fantasy style. Engraved antique gold border embedded with ruby gems. Heavy 3D metallic feel, rough parchment texture."
    },
    {
        "name": "Gale", 
        "prompt": "A striking portrait of Gale of Waterdeep, human wizard with glowing purple Netherese energy. Rendered in Baldurs Gate 3 dark fantasy style. Polished brass border embedded with sapphire gems. Heavy 3D metallic feel, rough parchment texture."
    }
    # 可在此处追加更多需要生成的角色/赞助者 (Patron)
]

OUTPUT_DIR = Path(__file__).resolve().parent.parent / "src" / "assets" / "portraits"
OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

def generate_card_art(task):
    print(f"正在生成角色插图: {task['name']}...", flush=True)
    
    # 调用 Nano Banana Pro (Gemini 3.1 Flash Image Preview) 生成图像
    response = client.models.generate_images(
        model="gemini-3-pro-image-preview",
        prompt=task["prompt"],
        config={
            "number_of_images": 1,
            "output_mime_type": "image/png",
        }
    )
    
    image_bytes = response.generated_images[0].image.image_bytes
    image = Image.open(io.BytesIO(image_bytes))
    
    output_file = OUTPUT_DIR / f"{task['name'].lower()}_portrait.png"
    image.save(output_file)
    print(f"成功生成并写入: {output_file}", flush=True)
    return output_file

if __name__ == "__main__":
    runner = ResilientAIRunner(max_workers=3)
    runner.execute(PROMPTS, generate_card_art)
