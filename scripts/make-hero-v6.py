from collections import deque
from math import cos, pi, sin
from pathlib import Path

from PIL import Image, ImageDraw, ImageEnhance, ImageFilter

SRC = Path(
    "/Users/pratanucool/.cursor/projects/Users-pratanucool-Documents-My-Projects-Github-jb-portfolio/assets/v2_awv-fdf584bd0cc8433e-18419291-2e4c-43bf-8997-3f2519271920.jpg"
)
STILL = Path("public/hero/portrait-v6.jpg")
DEST = Path("public/hero/portrait-v6.gif")
FRAMES = 12
DURATION_MS = 95


def luma(rgb: tuple[int, int, int]) -> float:
    r, g, b = rgb
    return 0.2126 * r + 0.7152 * g + 0.0722 * b


def sat(rgb: tuple[int, int, int]) -> int:
    return max(rgb) - min(rgb)


def clamp(value: float, lo: int = 0, hi: int = 255) -> int:
    return max(lo, min(hi, int(value)))


def crop_figure(im: Image.Image) -> Image.Image:
    w, h = im.size
    return im.crop((int(w * 0.36), 0, w, h))


def erase_band(im: Image.Image, box: tuple[float, float, float, float]) -> None:
    px = im.load()
    w, h = im.size
    x0, y0, x1, y1 = int(w * box[0]), int(h * box[1]), int(w * box[2]), int(h * box[3])
    killed = bytearray(w * h)
    for y in range(y0, y1):
        for x in range(x0, x1):
            rgb = px[x, y]
            brightness = luma(rgb)
            chroma = sat(rgb)
            # Letters and the play mark are pale. Leave gold / green / pink orbit.
            if brightness > 110 and chroma < 58:
                px[x, y] = (0, 0, 0)
                killed[y * w + x] = 1
    for y in range(y0, y1):
        for x in range(x0, x1):
            if killed[y * w + x]:
                continue
            near = False
            for ny in (y - 1, y, y + 1):
                for nx in (x - 1, x, x + 1):
                    if 0 <= ny < h and 0 <= nx < w and killed[ny * w + nx]:
                        near = True
            if near and luma(px[x, y]) > 48 and sat(px[x, y]) < 34:
                px[x, y] = (0, 0, 0)


def erase_watermark(im: Image.Image) -> Image.Image:
    """Play icon + Deevid sit above the brain; the leftover AI sits further right."""
    out = im.copy()
    erase_band(out, (0.58, 0.03, 0.83, 0.20))
    erase_band(out, (0.82, 0.03, 0.98, 0.13))
    return out


def subject_mask(im: Image.Image) -> bytearray:
    """Large bright/coloured bodies only: face, book, brain, clothes. Not orbit specks."""
    w, h = im.size
    px = im.load()
    seen = bytearray(w * h)
    keep = bytearray(w * h)

    def is_content(x: int, y: int) -> bool:
        rgb = px[x, y]
        return luma(rgb) > 62 or sat(rgb) > 48

    for y in range(h):
        for x in range(w):
            i = y * w + x
            if seen[i] or not is_content(x, y):
                continue
            q: deque[tuple[int, int]] = deque([(x, y)])
            seen[i] = 1
            cells: list[int] = []
            while q:
                cx, cy = q.popleft()
                cells.append(cy * w + cx)
                for nx, ny in ((cx + 1, cy), (cx - 1, cy), (cx, cy + 1), (cx, cy - 1)):
                    if 0 <= nx < w and 0 <= ny < h:
                        ni = ny * w + nx
                        if not seen[ni] and is_content(nx, ny):
                            seen[ni] = 1
                            q.append((nx, ny))
            if len(cells) >= 280:
                for idx in cells:
                    keep[idx] = 1

    grown = bytearray(keep)
    for _ in range(18):
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
    """Turn the charcoal plate to true black. Keep the figure and orbit specks."""
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
            if luma(rgb) < 82 and sat(rgb) < 40:
                dest[x, y] = (0, 0, 0)
    return out


def edge_fill_black(im: Image.Image) -> Image.Image:
    """Sweep leftover grain that still touches the frame."""
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
        if luma(rgb) > 78 or sat(rgb) > 38:
            continue
        px[x, y] = (0, 0, 0)
        offer(x + 1, y)
        offer(x - 1, y)
        offer(x, y + 1)
        offer(x, y - 1)
    return im


def brain_center(im: Image.Image) -> tuple[float, float]:
    px = im.load()
    w, h = im.size
    sx = sy = n = 0
    for y in range(int(h * 0.02), int(h * 0.45)):
        for x in range(int(w * 0.25), w):
            r, g, b = px[x, y]
            if g > 110 and g > r + 18 and g > b + 8:
                sx += x
                sy += y
                n += 1
    if n < 80:
        return w * 0.62, h * 0.22
    return sx / n, sy / n


def draw_dot(draw: ImageDraw.ImageDraw, x: float, y: float, r: float, color: tuple[int, int, int, int]) -> None:
    draw.ellipse((x - r, y - r, x + r, y + r), fill=color)


def animate(base: Image.Image) -> None:
    rgba = base.convert("RGBA")
    w, h = rgba.size
    cx, cy = brain_center(base)
    frames: list[Image.Image] = []

    orbits = [
        (w * 0.16, h * 0.11, 0.0, (180, 255, 120, 210), 2.1),
        (w * 0.22, h * 0.15, 0.8, (120, 210, 255, 190), 1.7),
        (w * 0.28, h * 0.19, 1.5, (255, 210, 80, 180), 1.9),
        (w * 0.12, h * 0.08, 2.2, (255, 120, 200, 200), 1.5),
    ]
    sparks = [
        (0.2, 255, 90, 140),
        (1.1, 90, 220, 255),
        (2.4, 255, 230, 80),
        (3.3, 140, 255, 160),
        (4.0, 255, 140, 90),
        (5.2, 180, 160, 255),
    ]

    for i in range(FRAMES):
        t = (2 * pi * i) / FRAMES
        pulse = 0.55 + 0.45 * (0.5 + 0.5 * sin(t))
        overlay = Image.new("RGBA", rgba.size, (0, 0, 0, 0))
        glow = Image.new("RGBA", rgba.size, (0, 0, 0, 0))
        glow_draw = ImageDraw.Draw(glow)
        glow_r = 64 + 9 * sin(t)
        glow_draw.ellipse(
            (cx - glow_r, cy - glow_r * 0.78, cx + glow_r, cy + glow_r * 0.78),
            fill=(90, 220, 80, int(26 + 20 * pulse)),
        )
        overlay = Image.alpha_composite(overlay, glow.filter(ImageFilter.GaussianBlur(16)))
        draw = ImageDraw.Draw(overlay)

        for idx, (rx, ry, phase, color, radius) in enumerate(orbits):
            for bead in range(5):
                angle = t * (1.15 if idx % 2 == 0 else -0.85) + phase + bead * (2 * pi / 5)
                x = cx + rx * cos(angle)
                y = cy + ry * sin(angle)
                alpha = clamp(color[3] * (0.45 + 0.55 * pulse))
                draw_dot(draw, x, y, radius, (color[0], color[1], color[2], alpha))

        for idx, (phase, r, g, b) in enumerate(sparks):
            angle = -t * 0.7 + phase
            dist = w * 0.16 + 28 * sin(t + idx)
            x = cx + dist * cos(angle)
            y = cy + dist * 0.62 * sin(angle) - 8
            size = 1.3 + 1.0 * (0.5 + 0.5 * sin(t * 2 + idx))
            draw_dot(draw, x, y, size, (r, g, b, 200))
            if idx % 2 == 0:
                draw.line((x - 4, y, x + 4, y), fill=(r, g, b, 120), width=1)
                draw.line((x, y - 4, x, y + 4), fill=(r, g, b, 120), width=1)

        frame = Image.alpha_composite(rgba, overlay)
        bright = ImageEnhance.Brightness(frame).enhance(1.0 + 0.03 * pulse)
        frames.append(bright.convert("P", palette=Image.Palette.ADAPTIVE, colors=192))

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
    im = erase_watermark(im)
    im = black_field(im)
    im = edge_fill_black(im)
    im.save(STILL, "JPEG", quality=94, optimize=True)
    gif_base = im.copy()
    if gif_base.width > 820:
        ratio = 820 / gif_base.width
        gif_base = gif_base.resize(
            (820, max(1, int(gif_base.height * ratio))),
            Image.Resampling.LANCZOS,
        )
    animate(gif_base)
    print(f"wrote {STILL} ({STILL.stat().st_size} bytes)")
    print(f"wrote {DEST} ({DEST.stat().st_size} bytes)")


if __name__ == "__main__":
    main()
