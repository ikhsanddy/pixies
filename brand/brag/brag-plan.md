# Pixies launch — brag plan

**Tone:** polished (serious, elegant, restrained — for developers who run their own infrastructure)
**Format:** landscape 1920x1080, 30fps, 20.5s
**Title:** Pixies

## Angle

Speed-test apps show you a number and forget it. Pixies is the record: a self-hosted instance that
schedules the tests, keeps the history for as long as you configure, watches the line, and speaks up
when it degrades. The video sells the record, not the needle. That is also why the new mark is a
pulse that leaves pixels behind instead of a speedometer.

## Hook

A single pulse runs across an empty dark frame. Nothing else. Then one line: "Your line has a
history." (2.8s)

## Highlights

1. **The record** — a real dashboard panel: download, upload, ping and jitter over a 30-day window.
2. **The sources** — Ookla, LibreSpeed and Cloudflare servers, each with its own latency.
3. **The guardrail** — health checks that reach you by email, Signal, WhatsApp or Telegram, plus
   Prometheus and Grafana support, and CSV/JSON export.

## Punchline

Wordmark, then "Self-hosted speed analytics." and the CTA "Open source on GitHub" (no URL).

## Storyboard

| # | Scene | In | Out | Dur | On screen |
|---|---|---|---|---|---|
| 1 | Pulse / hook | 0.0 | 2.735 | 2.735 | pulse stroke draws across frame, dot lands, "Your line has a history." |
| 2 | Reveal | 2.735 | 6.565 | 3.83 | wordmark + "Self-hosted internet speed analytics." + "Records your internet speed over a configurable retention period." |
| 3 | Speed history | 6.565 | 10.365 | 3.8 | dashboard panel, chart draws, 4 stats count in: 942.6 Mbps / 51.4 Mbps / 8 ms / 0.7 ms, caption "Speed, ping and jitter, recorded on a schedule." |
| 4 | Servers | 10.365 | 14.195 | 3.83 | three server cards (Ookla, LibreSpeed, Cloudflare) + caption "Bring your own servers." |
| 5 | Health checks | 14.195 | 17.475 | 3.28 | alert panel: "Line degraded" with channels; caption "Email, Signal, WhatsApp or Telegram. Prometheus and Grafana ready." |
| 6 | Outro | 17.475 | 20.0 | 2.525 | wordmark, "Self-hosted speed analytics.", "Open source on GitHub" |

Scene durations sum to 20.0s.

## Grounding

Every product claim on screen is lifted from `README.md`:
"records your internet speed over a fully configurable retention period", statistics on speed and
ping, Cron-scheduled tests, multiple servers, health checks via email / Signal / WhatsApp / Telegram,
Prometheus and Grafana, Ookla / LibreSpeed / Cloudflare. Chart values are illustrative demo data
inside a mock dashboard, not claims. Tone copy ("Your line has a history.") asserts nothing about
features.

## Visual identity

Ground `#0B0F14`, raised panel `#141A21`, hairline `#232B34`, text `#E6EDF3`, muted `#93A1AE`,
accent `#35E0A0`. Type: Inter (400/500/600) for copy, JetBrains Mono (500) for numbers and labels.
Motion: restrained; draw-on strokes, 12–24px rises, no bounces, no loops.

## Audio

Bundled track `happy-beats-business-moves-vol-10` (60s, trimmed to 20s) at a moderate bed level,
fade in over 0.8s, fade out over the last 1.6s. Three soft interface SFX at panel and card reveals,
under the music. Beat grid read after the first composition pass; major reveals are snapped to
strong beats within +/-0.15s.
