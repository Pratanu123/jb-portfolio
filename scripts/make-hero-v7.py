from collections import deque
from math import cos, pi, sin
from pathlib import Path

from PIL import Image, ImageDraw, ImageEnhance, ImageFilter

SRC = Path(
    "/Users/pratanucool/.cursor/projects/Users-pratanucool-Documents-My-Projects-Github-jb-portfolio/assets/can_you_animate_the_lightbulb__2K_20261025235926-1bff7740-92fc-459b-beeb-44b9f9190bec.jpg"
)
STILL = Path("public/hero/portrait-v6.jpg")
DEST = Path("public/hero/portrait-v6.gif")
FRAMES = 16
DURATION_MS = 80


def luma(rgb: tuple[int, int, int]) -> float:
    r, g, b = rgb
    return 0.2126 * r + 0.7152 * g + 0.0722 * b


def sat(rgb: tuple[int, int, int]) -> int:
    return max(rgb) - min(rgb)


def clamp(value: float, lo: int = 0, hi: int = 255) -> int:
    return max(lo, min(hi, int(value)))


def crop_figure(im: Image.Image) -> Image.Image:
    w, h = im.size
    return im.crop((int(w * 0.34), 0, w, h))


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


def subject_mask(im: Image.Image) -> bytearray:
    w, h = im.size
    px = im.load()
    keep = bytearray(w * h)

    def is_content(rgb: tuple[int, int, int], _x: int, _y: int) -> bool:
        return luma(rgb) > 70 or sat(rgb) > 46

    for cells in components(im, is_content, 240, w * h):
        for x, y in cells:
            keep[y * w + x] = 1

    grown = bytearray(keep)
    for _ in range(16):
        nxt = bytearray(grown)
        for y in range(1, h - 1):
            row = y * w
            for x in range(1, w - 1):
                if grown[row + x]:
                    continue
                if (
                    grown[row + x - 1]
                    or grown[row + x + 1]
                    or grown[row - w + x]
                    or grown[row + w + x]
                ):
                    nxt[row + x] = 1
        grown = nxt
    return grown


def black_field(im: Image.Image) -> Image.Image:
    w, h = im.size
    protect = subject_mask(im)
    out = im.copy()
    dest = out.load()
    for y in range(h):
        row = y * w
        for x in range(w):
            if protect[row + x]:
                continue
            rgb = dest[x, y]
            if luma(rgb) < 88 and sat(rgb) < 42:
                dest[x, y] = (0, 0, 0)
    return out


def edge_fill_black(im: Image.Image) -> Image.Image:
    w, h = im.size
    px = im.load()
    seen = bytearray(w * h)
    q: deque[tuple[int, int]] = deque()

    def offer(x: int, y: int) -> None:
        if 0 <= x < w and 0 <= y < h:
            q.append((x, y))

    for x in range(w):
        offer(x, 0)
        offer(x, h - 1)
    for y in range(h):
        offer(0, y)
        offer(w - 1, y)

    while q:
        x, y = q.popleft()
        i = y * w + x
        if seen[i]:
            continue
        seen[i] = 1
        rgb = px[x, y]
        if luma(rgb) > 80 or sat(rgb) > 40:
            continue
        px[x, y] = (0, 0, 0)
        offer(x + 1, y)
        offer(x - 1, y)
        offer(x, y + 1)
        offer(x, y - 1)
    return im


def brain_mask(im: Image.Image) -> tuple[bytearray, float, float]:
    w, h = im.size
    px = im.load()
    mask = bytearray(w * h)
    sx = sy = n = 0
    for y in range(int(h * 0.02), int(h * 0.48)):
        for x in range(int(w * 0.18), w):
            r, g, b = px[x, y]
            if g > 108 and g > r + 14 and g > b + 6:
                mask[y * w + x] = 1
                sx += x
                sy += y
                n += 1
    grown = bytearray(mask)
    for _ in range(8):
        nxt = bytearray(grown)
        for y in range(1, h - 1):
            row = y * w
            for x in range(1, w - 1):
                if grown[row + x]:
                    continue
                if (
                    grown[row + x - 1]
                    or grown[row + x + 1]
                    or grown[row - w + x]
                    or grown[row + w + x]
                ):
                    nxt[row + x] = 1
        grown = nxt
    if n < 80:
        return grown, w * 0.62, h * 0.24
    return grown, sx / n, sy / n


def bulb_pixels(im: Image.Image, brain: bytearray) -> list[tuple[int, int, tuple[int, int, int]]]:
    w, h = im.size
    px = im.load()

    def is_bulb(rgb: tuple[int, int, int], _x: int, _y: int) -> bool:
        r, g, b = rgb
        return r > 190 and g > 150 and b < 120 and r >= g

    clusters = components(im, is_bulb, 20, 900)
    best: list[tuple[int, int]] = []
    best_score = -1.0
    for cells in clusters:
        xs = [p[0] for p in cells]
        ys = [p[1] for p in cells]
        cy = sum(ys) / len(ys)
        if cy > h * 0.28:
            continue
        score = (sum(luma(px[x, y]) for x, y in cells) / len(cells)) - cy * 0.05
        if score > best_score:
            best_score = score
            best = cells
    return [(x, y, px[x, y]) for x, y in best]


def orbit_sprites(im: Image.Image, brain: bytearray) -> list[dict]:
    w, h = im.size
    px = im.load()

    def is_speck(rgb: tuple[int, int, int], _x: int, _y: int) -> bool:
        return sat(rgb) > 52 or (luma(rgb) > 95 and sat(rgb) > 28)

    sprites: list[dict] = []
    for cells in components(im, is_speck, 8, 1600):
        xs = [p[0] for p in cells]
        ys = [p[1] for p in cells]
        cx = sum(xs) / len(xs)
        cy = sum(ys) / len(ys)
        ix, iy = int(cx), int(cy)
        if 0 <= ix < w and 0 <= iy < h and brain[iy * w + ix]:
            continue
        # Keep free-floating books, rocket, stars — skip the held book and face.
        if cy > h * 0.50:
            continue
        pixels = [(x, y, px[x, y]) for x, y in cells]
        sprites.append({"cx": cx, "cy": cy, "pixels": pixels})
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
        pulse = 0.5 + 0.5 * (0.5 + 0.5 * sin(t))
        overlay = Image.new("RGBA", rgba.size, (0, 0, 0, 0))
        draw = ImageDraw.Draw(overlay)

        if bulb:
            sx = sum(p[0] for p in bulb) / len(bulb)
            sy = sum(p[1] for p in bulb) / len(bulb)
            glow = Image.new("RGBA", rgba.size, (0, 0, 0, 0))
            glow_draw = ImageDraw.Draw(glow)
            rad = 18 + 10 * pulse
            glow_draw.ellipse(
                (sx - rad, sy - rad * 0.85, sx + rad, sy + rad * 0.85),
                fill=(255, 220, 80, int(40 + 70 * pulse)),
            )
            overlay = Image.alpha_composite(overlay, glow.filter(ImageFilter.GaussianBlur(10)))
            draw = ImageDraw.Draw(overlay)
            for x, y, (r, g, b) in bulb:
                lift = 1.0 + 0.55 * pulse
                draw.point(
                    (x, y),
                    fill=(
                        clamp(r * lift),
                        clamp(g * lift),
                        clamp(b * lift + 20 * pulse),
                        255,
                    ),
                )

        brain_glow = Image.new("RGBA", rgba.size, (0, 0, 0, 0))
        brain_draw = ImageDraw.Draw(brain_glow)
        gr = 52 + 8 * sin(t)
        brain_draw.ellipse(
            (bx - gr, by - gr * 0.72, bx + gr, by + gr * 0.72),
            fill=(90, 220, 90, int(18 + 16 * pulse)),
        )
        overlay = Image.alpha_composite(overlay, brain_glow.filter(ImageFilter.GaussianBlur(14)))

        moved = Image.new("RGBA", rgba.size, (0, 0, 0, 0))
        mp = moved.load()
        for idx, sprite in enumerate(sprites):
            speed = 0.55 if len(sprite["pixels"]) < 80 else 0.28
            angle = t * speed * (1 if idx % 2 == 0 else -1)
            bob = 3.2 * sin(t * 1.2 + idx)
            rx = sprite["cx"] - bx
            ry = sprite["cy"] - by
            nx = bx + rx * cos(angle) - ry * sin(angle)
            ny = by + rx * sin(angle) + ry * cos(angle) + bob
            dx = nx - sprite["cx"]
            dy = ny - sprite["cy"]
            for x, y, rgb in sprite["pixels"]:
                px_ = int(round(x + dx))
                py_ = int(round(y + dy))
                if 0 <= px_ < w and 0 <= py_ < h:
                    mp[px_, py_] = (rgb[0], rgb[1], rgb[2], 255)

        frame = Image.alpha_composite(rgba, overlay)
        frame = Image.alpha_composite(frame, moved)
        frames.append(frame.convert("P", palette=Image.Palette.ADAPTIVE, colors=176))

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
    im = crop_figure(im)
    im = im.resize((im.width * 2, im.height * 2), Image.Resampling.LANCZOS)
    im = black_field(im)
    im = edge_fill_black(im)
    brain, bx, by = brain_mask(im)
    sprites = orbit_sprites(im, brain)
    bulb = bulb_pixels(im, brain)
    still = lift_sprites(im, sprites)
    still.save(STILL, "JPEG", quality=94, optimize=True)

    gif_base = still.copy()
    scale = 1.0
    if gif_base.width > 780:
        scale = 780 / gif_base.width
        gif_base = gif_base.resize(
            (780, max(1, int(gif_base.height * scale))),
            Image.Resampling.LANCZOS,
        )
        sprites = [
            {
                "cx": s["cx"] * scale,
                "cy": s["cy"] * scale,
                "pixels": [
                    (int(x * scale), int(y * scale), rgb) for x, y, rgb in s["pixels"]
                ],
            }
            for s in sprites
        ]
        bulb = [(int(x * scale), int(y * scale), rgb) for x, y, rgb in bulb]
        bx *= scale
        by *= scale

    animate(gif_base, sprites, bulb, bx, by)
    print(f"sprites={len(sprites)} bulb={len(bulb)} center=({bx:.1f},{by:.1f})")
    print(f"wrote {STILL} ({STILL.stat().st_size} bytes)")
    print(f"wrote {DEST} ({DEST.stat().st_size} bytes)")


if __name__ == "__main__":
    main()
