"""產生一張模擬藥盒照片，用於測試 /api/identify 的辨識邏輯。"""
from PIL import Image, ImageDraw, ImageFont
import sys

W, H = 720, 480
img = Image.new('RGB', (W, H), '#f8fafc')
d = ImageDraw.Draw(img)

# 藥盒外框
d.rectangle([40, 40, W - 40, H - 40], fill='#ffffff', outline='#0d9488', width=6)
d.rectangle([40, 40, W - 40, 130], fill='#0d9488')

def font(size):
    for path in ('C:/Windows/Fonts/msjh.ttc', 'C:/Windows/Fonts/mingliu.ttc', 'C:/Windows/Fonts/arial.ttf'):
        try:
            return ImageFont.truetype(path, size)
        except OSError:
            continue
    return ImageFont.load_default()

d.text((70, 62), 'PANADOL  普拿疼', font=font(44), fill='#ffffff')
d.text((70, 175), 'Acetaminophen  乙醯胺酚', font=font(36), fill='#0f172a')
d.text((70, 240), '500 mg  膜衣錠', font=font(32), fill='#334155')
d.text((70, 310), '解熱 ‧ 鎮痛', font=font(30), fill='#0d9488')
d.text((70, 375), '成人每次 1-2 錠  每 4-6 小時', font=font(26), fill='#64748b')

out = sys.argv[1] if len(sys.argv) > 1 else 'scripts/cache/test-panadol.jpg'
img.save(out, 'JPEG', quality=85)
print(f'wrote {out}')
