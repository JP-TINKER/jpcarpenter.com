#!/usr/bin/env python3
"""Build Soft Block T04-D favicon from Atkinson Hyperlegible Bold outlines.

The in-page mark may use <text>. Favicons cannot: browsers do not load the
site font inside /favicon.svg. This script outlines JP so the tab icon is
the locked mark, not a geometric stand-in.
"""
from __future__ import annotations

from pathlib import Path

from PIL import Image, ImageDraw, ImageFont
from fontTools.misc.transform import Transform
from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.pens.transformPen import TransformPen
from fontTools.ttLib import TTFont

HERE = Path(__file__).resolve().parent
PUBLIC = HERE.parent
FONT = PUBLIC / "fonts" / "AtkinsonHyperlegible-Bold.ttf"

# Locked tokens (LOCK.md)
PLATE = "#161c1b"
SOFT = "#b8c9c4"
LIFT = "#3d4a46"
AMBER = "#c47a3a"

CANVAS = 512
# Thin dark margin so sage reads on a white Chrome tab without becoming
# the old nested-frame look.
INSET = 20


def jp_layout(face_w: float, face_h: float, face_x: float, face_y: float) -> dict:
    """Same proportions as BrandMark.astro (viewBox 96 140 320 240)."""
    font_size = face_h * (118 / 232)
    baseline = face_y + face_h * (148 / 232)
    rule_y = face_y + face_h * (178 / 232)
    rule_h = max(face_h * (6 / 232), 2.0)
    rule_w = face_w * (192 / 312)
    return {
        "font_size": font_size,
        "baseline": baseline,
        "rule_y": rule_y,
        "rule_h": rule_h,
        "rule_w": rule_w,
        "rule_x": face_x + (face_w - rule_w) / 2,
        "cx": face_x + face_w / 2,
    }


def glyph_advance(font: TTFont, char: str) -> float:
    glyph_name = font.getBestCmap()[ord(char)]
    return font["hmtx"][glyph_name][0]


def jp_path_d(font: TTFont, font_size: float, cx: float, baseline: float) -> str:
    upem = font["head"].unitsPerEm
    scale = font_size / upem
    cmap = font.getBestCmap()
    gs = font.getGlyphSet()
    j_adv = glyph_advance(font, "J")
    p_adv = glyph_advance(font, "P")
    tracking = -0.08 * upem
    total = j_adv + tracking + p_adv
    x0 = cx - (total * scale) / 2

    parts: list[str] = []
    x = x0
    for char, adv in (("J", j_adv), ("P", p_adv)):
        pen = SVGPathPen(gs)
        # Font y-up → SVG y-down; origin at glyph origin / baseline.
        tpen = TransformPen(pen, Transform(scale, 0, 0, -scale, x, baseline))
        gs[cmap[ord(char)]].draw(tpen)
        parts.append(pen.getCommands())
        x += (adv + tracking) * scale
        tracking = 0  # letter-spacing only between J and P
    return " ".join(parts)


def svg_favicon(font: TTFont) -> str:
    face_x = face_y = INSET
    face_w = face_h = CANVAS - 2 * INSET
    rx = face_w * (36 / 312)
    stroke = max(face_w * (8 / 312), 4)
    lay = jp_layout(face_w, face_h, face_x, face_y)
    d = jp_path_d(font, lay["font_size"], lay["cx"], lay["baseline"])
    return f"""<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {CANVAS} {CANVAS}" role="img" aria-label="JP Carpenter">
  <title>JP Carpenter</title>
  <rect width="{CANVAS}" height="{CANVAS}" fill="{PLATE}"/>
  <rect x="{face_x}" y="{face_y}" width="{face_w}" height="{face_h}" rx="{rx:.2f}"
        fill="{SOFT}" stroke="{LIFT}" stroke-width="{stroke:.2f}"/>
  <path fill="{PLATE}" fill-rule="nonzero" d="{d}"/>
  <rect x="{lay['rule_x']:.2f}" y="{lay['rule_y']:.2f}" width="{lay['rule_w']:.2f}"
        height="{lay['rule_h']:.2f}" rx="{lay['rule_h']/2:.2f}" fill="{AMBER}"/>
</svg>
"""


def svg_mark(font: TTFont) -> str:
    """Official landscape mark, outlined — same box as mark.svg / BrandMark."""
    # Original: viewBox 96 140 320 240; face 100,144 312×232 rx=36
    d = jp_path_d(font, 118, 256, 292)
    return f"""<svg xmlns="http://www.w3.org/2000/svg" viewBox="96 140 320 240" role="img" aria-labelledby="title">
  <title id="title">JP Carpenter</title>
  <rect x="100" y="144" width="312" height="232" rx="36" fill="{SOFT}" stroke="{LIFT}" stroke-width="8"/>
  <path fill="{PLATE}" fill-rule="nonzero" d="{d}"/>
  <rect x="160" y="322" width="192" height="6" rx="3" fill="{AMBER}"/>
</svg>
"""


def render_png(font_path: Path, size: int, *, square_icon: bool = True) -> Image.Image:
    """Supersample 4× then downscale for clean tabs and Apple touch icons."""
    ss = 4
    S = size * ss
    img = Image.new("RGBA", (S, S), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)

    if square_icon:
        inset = int(round(INSET * S / CANVAS))
        face = [inset, inset, S - inset, S - inset]
        rx = (S - 2 * inset) * (36 / 312)
        stroke = max((S - 2 * inset) * (8 / 312), 4 * ss / 2)
        draw.rectangle([0, 0, S, S], fill=PLATE)
        draw.rounded_rectangle(face, radius=rx, fill=SOFT, outline=LIFT, width=int(round(stroke)))
        fw = fh = S - 2 * inset
        fx = fy = inset
    else:
        # Landscape official mark on transparent, padded to square for touch icons.
        fw, fh = int(S * 0.88), int(S * 0.88 * 232 / 312)
        fx, fy = (S - fw) // 2, (S - fh) // 2
        rx = fw * (36 / 312)
        stroke = max(fw * (8 / 312), 4)
        draw.rounded_rectangle([fx, fy, fx + fw, fy + fh], radius=rx, fill=SOFT, outline=LIFT, width=int(round(stroke)))

    lay = jp_layout(fw, fh, fx, fy)
    ttf = ImageFont.truetype(str(font_path), size=int(round(lay["font_size"])))
    # Pillow letter-spacing via manual pair placement.
    j_w = ttf.getlength("J")
    tracking = -0.08 * lay["font_size"]
    p_w = ttf.getlength("P")
    total = j_w + tracking + p_w
    x = lay["cx"] - total / 2
    y = lay["baseline"]
    draw.text((x, y), "J", font=ttf, fill=PLATE, anchor="ls")
    draw.text((x + j_w + tracking, y), "P", font=ttf, fill=PLATE, anchor="ls")
    ry, rh, rw, rx_ = lay["rule_y"], lay["rule_h"], lay["rule_w"], lay["rule_x"]
    draw.rounded_rectangle([rx_, ry, rx_ + rw, ry + rh], radius=rh / 2, fill=AMBER)

    return img.resize((size, size), Image.Resampling.LANCZOS)


def write(path: Path, data: str | bytes) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    if isinstance(data, str):
        path.write_text(data, encoding="utf-8")
    else:
        path.write_bytes(data)
    print(f"wrote {path} ({path.stat().st_size} bytes)")


def main() -> None:
    if not FONT.is_file():
        raise SystemExit(f"missing font: {FONT}")
    font = TTFont(FONT)

    favicon_svg = svg_favicon(font)
    mark_outlined = svg_mark(font)

    write(PUBLIC / "favicon.svg", favicon_svg)
    write(HERE / "favicon.svg", favicon_svg)
    write(HERE / "mark-outlined.svg", mark_outlined)

    # Tiny 32 viewBox alias (same vectors, browsers that prefer small files)
    write(HERE / "mark-32.svg", favicon_svg)

    sizes = {
        PUBLIC / "favicon-32.png": 32,
        PUBLIC / "favicon-192.png": 192,
        PUBLIC / "apple-touch-icon.png": 180,
        HERE / "favicon-32.png": 32,
        HERE / "favicon-192.png": 192,
        HERE / "apple-touch-icon.png": 180,
        HERE / "favicon-512.png": 512,
    }
    rendered: dict[int, Image.Image] = {}
    for path, size in sizes.items():
        if size not in rendered:
            rendered[size] = render_png(FONT, size)
        rendered[size].save(path, "PNG", optimize=True)
        print(f"wrote {path} ({path.stat().st_size} bytes)")

    # Landscape mark PNG for the brand kit (not the tab icon).
    mark_png = render_png(FONT, 512, square_icon=False)
    mark_png.save(HERE / "mark.png", "PNG", optimize=True)
    print(f"wrote {HERE / 'mark.png'} ({(HERE / 'mark.png').stat().st_size} bytes)")


if __name__ == "__main__":
    main()
