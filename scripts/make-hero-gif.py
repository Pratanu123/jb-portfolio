from math import cos, pi, sin
from pathlib import Path

from PIL import Image, ImageDraw, ImageEnhance, ImageFilter

SRC = Path("public/hero/portrait-v5.jpg")
DEST = Path("public/hero/portrait-v5.gif")
FRAMES = 16
DURATION_MS = 90


def clamp(value: float, lo: int, hi: int) -> int:
    return max(lo, min(hi, int(value)))


def draw_dot(draw: ImageDraw.ImageDraw, x: float, y: float, r: float, color: tuple[int, int, int, int]) -> None:
    draw.ellipse((x - r, y - r, x + r, y + r), fill=color)


def main() -> None:
    base = Image.open(SRC).convert("RGBA")
    w, h = base.size
    cx, cy = w * 0.52, h * 0.22
    frames: list[Image.Image] = []

    orbits = [
        (118, 78, 0.0, (180, 255, 120, 210), 2.2),
        (168, 112, 0.7, (120, 210, 255, 190), 1.8),
        (214, 148, 1.4, (255, 210, 80, 180), 2.0),
        (86, 58, 2.1, (255, 120, 200, 200), 1.6),
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
        overlay = Image.new("RGBA", base.size, (0, 0, 0, 0))
        draw = ImageDraw.Draw(overlay)

        glow = Image.new("RGBA", base.size, (0, 0, 0, 0))
        glow_draw = ImageDraw.Draw(glow)
        glow_r = 70 + 10 * sin(t)
        glow_draw.ellipse(
            (cx - glow_r, cy - glow_r * 0.78, cx + glow_r, cy + glow_r * 0.78),
            fill=(90, 220, 80, int(28 + 22 * pulse)),
        )
        overlay = Image.alpha_composite(overlay, glow.filter(ImageFilter.GaussianBlur(18)))
        draw = ImageDraw.Draw(overlay)

        for idx, (rx, ry, phase, color, radius) in enumerate(orbits):
            for bead in range(5):
                angle = t * (1.15 if idx % 2 == 0 else -0.85) + phase + bead * (2 * pi / 5)
                x = cx + rx * cos(angle)
                y = cy + ry * sin(angle)
                alpha = clamp(color[3] * (0.45 + 0.55 * pulse), 0, 255)
                draw_dot(draw, x, y, radius, (color[0], color[1], color[2], alpha))

        for idx, (phase, r, g, b) in enumerate(sparks):
            angle = -t * 0.7 + phase
            dist = 150 + 36 * sin(t + idx)
            x = cx + dist * cos(angle)
            y = cy + dist * 0.62 * sin(angle) - 8
            size = 1.4 + 1.1 * (0.5 + 0.5 * sin(t * 2 + idx))
            draw_dot(draw, x, y, size, (r, g, b, 200))
            if idx % 2 == 0:
                draw.line((x - 4, y, x + 4, y), fill=(r, g, b, 120), width=1)
                draw.line((x, y - 4, x, y + 4), fill=(r, g, b, 120), width=1)

        frame = Image.alpha_composite(base, overlay)
        bright = ImageEnhance.Brightness(frame).enhance(1.0 + 0.035 * pulse)
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
    print(f"wrote {DEST} ({DEST.stat().st_size} bytes, {FRAMES} frames)")


if __name__ == "__main__":
    main()
