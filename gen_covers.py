"""Generate BMC product cover images for bking.one"""
from PIL import Image, ImageDraw, ImageFont
import math, os, random

OUT = r"D:\workspace-moodiys\bking-fortune-site\public\covers"
os.makedirs(OUT, exist_ok=True)

W, H = 600, 400

def hex_to_rgb(hx):
    return tuple(int(hx[i:i+2], 16) for i in (1, 3, 5))

def create_cover(filename, bg_hex, accent_hex, title_zh, title_en, tagline, corner_words):
    bg = hex_to_rgb(bg_hex)
    accent = hex_to_rgb(accent_hex)
    img = Image.new("RGB", (W, H), bg)
    draw = ImageDraw.Draw(img)

    # Radial glow
    cx, cy = W//2, H//2 - 20
    for r in range(180, 20, -3):
        alpha = int(30 * (r / 180))
        c = tuple(min(255, accent[i] * alpha // 50) for i in range(3))
        draw.ellipse([cx-r, cy-r, cx+r, cy+r], outline=c, width=1)

    # Central Yin-Yang circle
    R = 70
    draw.ellipse([cx-R, cy-R, cx+R, cy+R], outline=accent, width=2)
    draw.arc([cx-R, cy-R, cx+R, cy+R], -90, 90, fill=accent, width=14)
    # dots
    draw.ellipse([cx-R//2-5, cy-5, cx-R//2+5, cy+5], fill=accent)
    draw.ellipse([cx+R//2-5, cy-5, cx+R//2+5, cy+5], fill=bg)

    random.seed(hash(filename))
    # Orbiting stars with lines
    for i in range(12):
        angle = i * 30 + random.randint(-6, 6)
        rad = R + 35 + random.randint(0, 50)
        sx = int(cx + math.cos(math.radians(angle)) * rad)
        sy = int(cy + math.sin(math.radians(angle)) * rad)
        sz = random.randint(2, 5)
        draw.ellipse([sx-sz, sy-sz, sx+sz, sy+sz], fill=accent)
        ix = int(cx + math.cos(math.radians(angle)) * (R + 8))
        iy = int(cy + math.sin(math.radians(angle)) * (R + 8))
        draw.line([ix, iy, sx, sy], fill=accent, width=1)

    # Fonts
    try:
        ft = ImageFont.truetype("C:/Windows/Fonts/simhei.ttf", 34)
        fs = ImageFont.truetype("C:/Windows/Fonts/simhei.ttf", 17)
        fe = ImageFont.truetype("C:/Windows/Fonts/msyh.ttf", 13)
    except:
        ft = fs = fe = ImageFont.load_default()

    # Title
    b = draw.textbbox((0, 0), title_zh, font=ft)
    tw = b[2] - b[0]
    draw.text((W//2 - tw//2, H - 95), title_zh, fill=accent, font=ft)
    # Tagline
    b2 = draw.textbbox((0, 0), tagline, font=fs)
    tw2 = b2[2] - b2[0]
    draw.text((W//2 - tw2//2, H - 55), tagline, fill="#777777", font=fs)
    # English
    draw.text((W//2 - len(title_en)*3, H - 32), title_en, fill="#555555", font=fe)

    # Corner words around circle
    for i, w in enumerate(corner_words):
        a = i * 90 + 45
        rad = R + 18
        lx = int(cx + math.cos(math.radians(a)) * rad) - 16
        ly = int(cy + math.sin(math.radians(a)) * rad) - 7
        draw.text((lx, ly), w, fill=accent, font=fe)

    # Brand
    draw.text((20, 20), "MINGSHI BKING · AI FORTUNE LAB", fill="#333333", font=fe)

    outpath = os.path.join(OUT, filename)
    img.save(outpath, "PNG")
    print(f"OK: {filename} ({img.size[0]}x{img.size[1]})")

create_cover(
    "reading_cover.png", "#0a0a0f", "#f59e0b",
    "命盘解读", "Full Fortune Reading",
    "东西方双系统 · AI 交叉验证",
    ["八字", "紫微", "占星", "奇门"]
)

create_cover(
    "naming_cover.png", "#0a0a13", "#c084fc",
    "起名改名", "BaZi Naming Service",
    "五行补益 · 五格数理 · 三才配置",
    ["五行", "数理", "音韵", "吉凶"]
)

print("=== Done ===")
