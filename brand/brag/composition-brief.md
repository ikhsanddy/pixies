# Hyperframes Composition Brief: Pixies

## Objective
A 20-second launch video for Pixies, the self-hosted internet speed analytics dashboard. It shows the
record of tests, not a single measurement, and lands the new logo and name. No URL or domain appears anywhere; the project is not deployed.

## Output
- Composition directory: `brand/brag/composition/`
- Rendered video: `brand/launch.mp4` (poster baked as frame 0), source render `brand/brag/brag.mp4`
- Poster: `brand/brag/poster.jpg` (19.4s, settled outro)
- Format: landscape 1920x1080, 30fps
- Duration: 20.5s (615 frames)

## Source Material
- Project root: `D:/project/pixies`
- Primary files read: `README.md`, `client/index.html`, `client/public/manifest.json`, `brand/brand.md`
- Product name: Pixies
- Tagline: Self-hosted internet speed analytics.
- Key visual: the new mark (pulse rising into two pixel squares) from `brand/logo-dark.svg`
- Copy that must appear verbatim (from README):
  - Records your internet speed over a configurable retention period.
  - Ookla, LibreSpeed, Cloudflare (server providers)
  - Health checks: email, Signal, WhatsApp, Telegram
  - Prometheus and Grafana
  - CSV / JSON export (server/routes/speedtests.js)

## Creative Direction
- Tone preset: polished
- Interpretation: restrained motion, long holds, no jokes. Confidence comes from type and spacing.
- Angle: speed-test apps show a number and forget it; Pixies keeps the history.
- Hook: a bare pulse runs across the frame, then "Your line has a history." (0.0-2.735s)
- Outro: wordmark, "Self-hosted speed analytics.", "Open source on GitHub" (17.475-20.0s)
- Avoid: generic SaaS language, fake dashboards built from unrelated UI, invented metrics claims.

## Visual Identity
- Background: `#0B0F14`; raised panels `#141A21`; hairline `#232B34`
- Text: `#E6EDF3`; muted `#93A1AE`
- Accent: `#35E0A0`
- Display/body font: Inter (400/500/600, woff2 in `assets/fonts`)
- Numerals and labels: JetBrains Mono 500 (woff2 in `assets/fonts`)
- Project visuals: `assets/brand/wordmark-dark.svg`, `assets/brand/logo-dark.svg`, the pulse motif
  reused at three scales (hook scope, chart line, mark)

## Storyboard
1. Hook - 0.0-2.735s - scope pulse draws, dot lands, "Your line has a history."
2. Reveal - 2.735-6.565s - wordmark + "Self-hosted internet speed analytics." + retention line
3. Speed history - 6.565-10.365s - dashboard panel, chart draws, download/upload/ping/jitter
4. Servers - 10.365-14.195s - Ookla / LibreSpeed / Cloudflare cards
5. Health checks - 14.195-17.475s - alert panel with four channels + Prometheus/Grafana panel
6. Outro - 17.475-20.0s - wordmark, tagline, "Open source on GitHub"

## Audio
- Audio role: warm electronic bed, quiet enough to read over
- Music: `assets/music/pulse.mp3` (bundled `happy-beats-business-moves-vol-10`, 110 BPM)
- Music treatment: fade in 0-0.8s to 0.34, hold, fade to 0 over 18.3-19.9s via the volume lane
- Music cue guidance: `beats/assets/music/pulse.mp3.json` (108 beats); scene cuts snapped to beats
  2.735 / 6.565 / 10.365 / 14.195 / 17.475; strong cues 6.565 and 17.475 used for scene 3 and outro
- Audio-reactive treatment: none (restraint chosen over any pulse-driven glow)
- Audio-coupled moments: dashboard panel entrance, server card stagger, alert panel entrance
- SFX: `assets/sfx/switch1.ogg` at the three panel/card reveals, volume 0.12, on separate tracks
- All on-screen copy, captions and audio content are English only.

## Hyperframes Instructions
- Single standalone composition at `composition/index.html`, GSAP timeline registered on
  `window.__timelines["main"]`, six timed scenes on track 0.
- Requirements: at least one real product element (dashboard panel, provider names, health-check
  channels), readable text at every hold, 15-25s window, music and SFX present.
- Gate: `npx hyperframes check` (0 errors; layout 0 issues; 23/23 contrast checks pass).
- Verify after render with ffprobe: 1920x1080, 30fps, h264 + aac, 20.0s.
