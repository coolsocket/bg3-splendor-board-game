import os
from pathlib import Path
from google import genai
from google.genai import types
import io
from PIL import Image

# 遵循 gcp_auth_master 规范获取凭据和 Project
key_file = Path.home() / ".gemini/credentials/cloud-resource-key.json"
if key_file.exists():
    os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = str(key_file)
os.environ["GOOGLE_CLOUD_PROJECT"] = "my-website-417013"

# 初始化 Vertex AI 客户端 (Nano Banana 必须使用 location: global)
client = genai.Client(vertexai=True, location="global")

prompt = "A striking 1:1 portrait of a worn iron broadsword resting on a rough camp table with scattered copper coins. Baldurs Gate 3 dark fantasy style. Framed by a broken, rusted iron border. Heavy 3D metallic feel, rough parchment texture. Studio lighting, deep shadows."

print("正在正确调用 Nano Banana Pro (gemini-3-pro-image-preview)...", flush=True)

# 必须通过 generate_content 并传入 image_config 来出图，而不是 generate_images
contents = [types.Content(role="user", parts=[types.Part.from_text(text=prompt)])]

config = types.GenerateContentConfig(
    temperature=1,
    top_p=0.95,
    max_output_tokens=32768,
    response_modalities=["TEXT", "IMAGE"],
    safety_settings=[
        types.SafetySetting(category="HARM_CATEGORY_HATE_SPEECH", threshold="OFF"),
        types.SafetySetting(category="HARM_CATEGORY_DANGEROUS_CONTENT", threshold="OFF"),
        types.SafetySetting(category="HARM_CATEGORY_SEXUALLY_EXPLICIT", threshold="OFF"),
        types.SafetySetting(category="HARM_CATEGORY_HARASSMENT", threshold="OFF")
    ],
    image_config=types.ImageConfig(
        aspect_ratio="1:1",
        image_size="1K",
        output_mime_type="image/png"
    )
)

response = client.models.generate_content(
    model="gemini-3-pro-image-preview",
    contents=contents,
    config=config
)

# 解析返回的 image 数据
output_dir = Path(__file__).resolve().parent.parent / "src" / "assets" / "portraits"
output_dir.mkdir(parents=True, exist_ok=True)
output_path = output_dir / "nano_banana_tier1_sword.png"

image_found = False
for part in response.candidates[0].content.parts:
    if part.inline_data:
        image_bytes = part.inline_data.data
        image = Image.open(io.BytesIO(image_bytes))
        image.save(output_path)
        image_found = True
        print(f"成功生成 Nano Banana 图像并保存至: {output_path}", flush=True)
        break

if not image_found:
    print("未在 response 中找到图像数据", flush=True)
