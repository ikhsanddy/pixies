# Pixies brand

Self-hosted internet speed analytics. The brand is a measurement tool, not a consumer gadget:
calm ink surfaces, one pulse-green accent, type that behaves like a control panel.

## Rationale

The retired mark was a speedometer: a dial and a needle. It said "speed test" and nothing
about the thing that makes the product useful, which is the record of many tests over time.

The Pixies mark keeps the measurement but changes the metaphor. A single speed pulse rises, dips,
and then leaves the signal as two discrete squares. The pulse is the test; the squares are the
readings that detach from it and become data. Two squares, not one, is the quiet nod to the plural
name: small pixel sprites leaving a trace. It reads as signal, as speed, and as a graph, without a
dial, a needle, or a gauge arc.

The form is deliberately asymmetric: one heavy stroke, one merged block, one small satellite. That
tension is what keeps an otherwise simple mark from looking like a generic heartbeat icon, and it
survives at 16px because the silhouette is three masses, not ten details.

## Palette

| Token | Hex | Use |
|---|---|---|
| Pulse | `#35E0A0` | Accent on dark surfaces. Mark, active states, key values. |
| Pulse Deep | `#04785C` | Accent on light surfaces. Same role, contrast-corrected. |
| Ink | `#0B0F14` | Dark background, primary text on light. |
| Ink Raised | `#141A21` | Cards and panels on dark. |
| Hairline Dark | `#232B34` | Borders and dividers on dark. |
| Paper | `#F4F7F4` | Light background. |
| Paper Sunken | `#E8EDEA` | Light-mode panels. |
| Text Light | `#E6EDF3` | Primary text on dark. |
| Text Muted Dark | `#93A1AE` | Secondary text on dark. |
| Text Muted Light | `#5A6672` | Secondary text on light. |

Measured contrast (WCAG 2.1):

- Pulse on Ink: **11.3:1** (body text and graphics, AAA for large text)
- Pulse Deep on Paper: **5.1:1**, on pure white **5.5:1** (AA body text)
- Text Light on Ink: **16.3:1**; Ink on Paper: **17.8:1**
- Pulse on Paper is **1.5:1** and must never carry text or a lone mark on light backgrounds.
  Use Pulse Deep there instead. This is the single most common way to break the brand.

One accent, always. Pulse and Pulse Deep are the same role expressed for two backgrounds; they are
not two brand colors to be used side by side.

## Typography

- **Wordmark:** Inter, outlined to paths (`wordmark.svg`). Tracking -0.022em, optical weight
  between Regular and Medium (the outline carries a 2.2/64 stroke compensation).
- **UI and product:** Inter (already shipped by the app at
  `client/public/assets/fonts/inter-v12-latin-regular.ttf`).
- **Numbers, timings, server names:** a real mono (`ui-monospace`, `SFMono-Regular`, `JetBrains Mono`,
  `Menlo`, `Consolas`, `monospace`). Speed values, jitter and server labels are monospaced so
  columns of measurements stay aligned.
- **Fallback stack:** `Inter, "Segoe UI", system-ui, -apple-system, "Helvetica Neue", Arial, sans-serif`.
- Display sizes: tight tracking (-0.02em), weights 500-600. Body: weight 400, line-height 1.5-1.6.

## Files

| File | Purpose |
|---|---|
| `logo.svg` | Primary mark, 100x100 viewBox, inherits `currentColor`. |
| `logo-dark.svg` | Mark in Pulse for Ink and darker surfaces. |
| `logo-light.svg` | Mark in Pulse Deep for Paper and lighter surfaces. |
| `icon.svg` | Square app icon: Pulse mark on an Ink rounded tile. Favicon and PWA source. |
| `logo-512.png`, `logo-192.png`, `logo-64.png` | Raster exports of `icon.svg` (512, 192, 64 px). |
| `favicon.ico` | Multi-resolution icon: 16, 24, 32, 48, 64 px. |
| `wordmark.svg` | Mark + outlined "Pixies", `currentColor`. Lockup, 266x140. |
| `wordmark-dark.svg` | Pulse mark + `#E6EDF3` wordmark, for dark surfaces. |
| `wordmark-light.svg` | Pulse Deep mark + Ink wordmark, for light surfaces. |
| `concepts/` | Six exploration variants plus rendered previews (design history). |
| `showcase.html` | Offline review page for the concepts and the final mark. |

## Usage rules

**Clear space.** Keep at least half the mark's height (0.5x) clear on every side. Never let text,
cards, or edges touch the mark.

**Minimum sizes.** Mark: 16px for the icon, 24px for standalone mark use. Wordmark: 96px wide.
Below 24px, use `icon.svg` (the tile keeps the green readable on white browser chrome).

**Backgrounds.** Dark UI: `logo-dark.svg` or `wordmark-dark.svg`. Light UI: `logo-light.svg` or
`wordmark-light.svg`. Inline SVG: `logo.svg` / `wordmark.svg` inherit `currentColor`; set `color`,
do not recolor individual paths.

**Do not** rotate, skew, stretch, outline, add drop shadows or glows to the mark. Do not place the
mark on a mid-tone photo without a solid Ink or Paper plate behind it. Do not separate the two pixel
squares from the pulse, re-space them, or rebuild the mark from parts: the gap rhythm is the logo.
Do not recreate the wordmark in live text; use the outlined files or Inter with the tracked settings
above.

**Favicon.** `favicon.ico` and the PNG set are generated from `icon.svg`. Regenerate from the SVG,
never upscale a raster export.

## Motion

The mark may animate once, on first load only: the pulse draws left to right over 400ms
(ease-out), then the two squares fade and settle with a 60ms stagger. No loops, no infinite
pulsing. Respect `prefers-reduced-motion` and render the static mark.
