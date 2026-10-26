from collections import deque
from math import pi, sin
from pathlib import Path

from PIL import Image, ImageDraw, ImageFilter

SRC = Path(
    "/Users/pratanucool/.cursor/projects/Users-pratanucool-Documents-My-Projects-Github-jb-portfolio/assets/can_you_animate_the_lightbulb__2K_20261025235926-1bff7740-92fc-459b-beeb-44b9f9190bec.jpg"
)
STILL = Path("public/hero/portrait-v6.jpg")
DEST = Path("public/hero/portrait-v6.gif")
FRAMES = 14
DURATION_MS = 110


def luma(rgb: tuple[int, int, int]) -> float:
    r, g, b = rgb
    return 0.2126 * r + 0.7152 * g + 0.0722 * b


def sat(rgb: tuple[int, int, int]) -> int:
    return max(rgb) - min(rgb)


def clamp(value: float, lo: int = 0, hi: int = 255) -> int:
    return max(lo, min(hi, int(value)))


def components(im: Image.Image, test, min_size: int, max_size: int) -> list[list[tuple[int, int]]]:
    w, h = im.size
    px = im.load()
    seen = bytearray(w * h)
    found: list[list[tuple[int, int]]] = []
    for y in range(h):
        for x in range(w):
            i = y * w + x
            if seen[i] or not test(px[x, y], x, y):
                continue
            q: deque[tuple[int, int]] = deque([(x, y)])
            seen[i] = 1
            cells: list[tuple[int, int]] = []
            while q:
                cx, cy = q.popleft()
                cells.append((cx, cy))
                for nx, ny in ((cx + 1, cy), (cx - 1, cy), (cx, cy + 1), (cx, cy - 1)):
                    if 0 <= nx < w and 0 <= ny < h:
                        ni = ny * w + nx
                        if not seen[ni] and test(px[nx, ny], nx, ny):
                            seen[ni] = 1
                            q.append((nx, ny))
            if min_size <= len(cells) <= max_size:
                found.append(cells)
    return found


def black_field(im: Image.Image) -> Image.Image:
    w, h = im.size
    px = im.load()
    for y in range(h):
        for x in range(w):
            rgb = px[x, y]
            if luma(rgb) < 86 and sat(rgb) < 40:
                px[x, y] = (0, 0, 0)
    return im


def content_box(im: Image.Image) -> tuple[int, int, int, int]:
    w, h = im.size
    px = im.load()
    left, top, right, bottom = w, h, 0, 0
    for y in range(h):
        for x in range(w):
            rgb = px[x, y]
            if luma(rgb) > 18 or sat(rgb) > 18:
                if x < left:
                    left = x
                if y < top:
                    top = y
                if x > right:
                    right = x
                if y > bottom:
                    bottom = y
    pad_x = int((right - left) * 0.04)
    pad_y = int((bottom - top) * 0.03)
    return (
        max(0, left - pad_x),
        max(0, top - pad_y),
        min(w, right + 1 + pad_x),
        min(h, bottom + 1 + pad_y),
    )


def brain_mask(im: Image.Image) -> tuple[bytearray, float, float]:
    w, h = im.size
    px = im.load()
    mask = bytearray(w * h)
    sx = sy = n = 0
    for y in range(int(h * 0.02), int(h * 0.46)):
        for x in range(int(w * 0.12), w):
            r, g, b = px[x, y]
            if g > 108 and g > r + 14 and g > b + 6:
                mask[y * w + x] = 1
                sx += x
                sy += y
                n += 1
    if n < 80:
        return mask, w * 0.62, h * 0.22
    return mask, sx / n, sy / n


def bulb_pixels(im: Image.Image) -> list[tuple[int, int, tuple[int, int, int]]]:
    def is_bulb(rgb: tuple[int, int, int], _x: int, _y: int) -> bool:
        r, g, b = rgb
        return r > 190 and g > 150 and b < 120 and r >= g

    clusters = components(im, is_bulb, 16, 700)
    h = im.size[1]
    px = im.load()
    best: list[tuple[int, int]] = []
    best_score = -1.0
    for cells in clusters:
        ys = [p[1] for p in cells]
        cy = sum(ys) / len(ys)
        if cy > h * 0.26:
            continue
        score = sum(luma(px[x, y]) for x, y in cells) / len(cells)
        if score > best_score:
            best_score = score
            best = cells
    return [(x, y, px[x, y]) for x, y in best]


def floaters(im: Image.Image, brain: bytearray) -> list[dict]:
    w, h = im.size
    px = im.load()

    def is_speck(rgb: tuple[int, int, int], _x: int, _y: int) -> bool:
        return sat(rgb) > 58 or (luma(rgb) > 110 and sat(rgb) > 30)

    sprites: list[dict] = []
    for cells in components(im, is_speck, 10, 900):
        xs = [p[0] for p in cells]
        ys = [p[1] for p in cells]
        cx = sum(xs) / len(xs)
        cy = sum(ys) / len(ys)
        ix, iy = int(cx), int(cy)
        if 0 <= ix < w and 0 <= iy < h and brain[iy * w + ix]:
            continue
        if cy > h * 0.46:
            continue
        if cx > w * 0.28 and cy > h * 0.16 and cy < h * 0.42 and abs(cx - w * 0.62) < w * 0.18:
            continue
        sprites.append({"cx": cx, "cy": cy, "pixels": [(x, y, px[x, y]) for x, y in cells]})
    return sprites


def lift_sprites(im: Image.Image, sprites: list[dict]) -> Image.Image:
    out = im.copy()
    px = out.load()
    for sprite in sprites:
        for x, y, _rgb in sprite["pixels"]:
            px[x, y] = (0, 0, 0)
    return out


def animate(base: Image.Image, sprites: list[dict], bulb: list[tuple[int, int, tuple[int, int, int]]], bx: float, by: float) -> None:
    rgba = base.convert("RGBA")
    w, h = rgba.size
    frames: list[Image.Image] = []

    for i in range(FRAMES):
        t = (2 * pi * i) / FRAMES
        pulse = 0.5 + 0.5 * sin(t)
        overlay = Image.new("RGBA", rgba.size, (0, 0, 0, 0))
        draw = ImageDraw.Draw(overlay)

        if bulb:
            sx = sum(p[0] for p in bulb) / len(bulb)
            sy = sum(p[1] for p in bulb) / len(bulb)
            glow = Image.new("RGBA", rgba.size, (0, 0, 0, 0))
            glow_draw = ImageDraw.Draw(glow)
            rad = 14 + 6 * pulse
            glow_draw.ellipse(
                (sx - rad, sy - rad * 0.85, sx + rad, sy + rad * 0.85),
                fill=(255, 220, 90, int(22 + 36 * pulse)),
            )
            overlay = Image.alpha_composite(overlay, glow.filter(ImageFilter.GaussianBlur(8)))
            draw = ImageDraw.Draw(overlay)
            for x, y, (r, g, b) in bulb:
                lift = 1.0 + 0.28 * pulse
                draw.point((x, y), fill=(clamp(r * lift), clamp(g * lift), clamp(b * lift), 255))

        brain_glow = Image.new("RGBA", rgba.size, (0, 0, 0, 0))
        brain_draw = ImageDraw.Draw(brain_glow)
        gr = 46 + 4 * sin(t)
        brain_draw.ellipse(
            (bx - gr, by - gr * 0.7, bx + gr, by + gr * 0.7),
            fill=(90, 210, 90, int(10 + 10 * pulse)),
        )
        overlay = Image.alpha_composite(overlay, brain_glow.filter(ImageFilter.GaussianBlur(16)))

        moved = Image.new("RGBA", rgba.size, (0, 0, 0, 0))
        mp = moved.load()
        for idx, sprite in enumerate(sprites):
            bob = 2.4 * sin(t + idx * 0.7)
            sway = 1.4 * sin(t * 0.85 + idx)
            for x, y, rgb in sprite["pixels"]:
                px_ = int(round(x + sway))
                py_ = int(round(y + bob))
                if 0 <= px_ < w and 0 <= py_ < h:
                    mp[px_, py_] = (rgb[0], rgb[1], rgb[2], 255)

        frame = Image.alpha_composite(rgba, overlay)
        frame = Image.alpha_composite(frame, moved)
        frames.append(frame.convert("P", palette=Image.Palette.ADAPTIVE, colors=192))

    frames[0].save(
        DEST,
        save_all=True,
        append_images=frames[1:],
        duration=DURATION_MS,
        loop=0,
        optimize=True,
        disposal=2,
    )


def main() -> None:
    im = Image.open(SRC).convert("RGB")
    im = black_field(im)
    im = im.crop(content_box(im))
    if im.width > 980:
        scale = 980 / im.width
        im = im.resize((980, max(1, int(im.height * scale))), Image.Resampling.LANCZOS)
    brain, bx, by = brain_mask(im)
    sprites = floaters(im, brain)
    bulb = bulb_pixels(im)
    still = lift_sprites(im, sprites)
    still.save(STILL, "JPEG", quality=94, optimize=True)
    animate(still, sprites, bulb, bx, by)
    print(f"size={still.size} sprites={len(sprites)} bulb={len(bulb)}")
    print(f"wrote {STILL} ({STILL.stat().st_size} bytes)")
    print(f"wrote {DEST} ({DEST.stat().st_size} bytes)")


if __name__ == "__main__":
    main()
