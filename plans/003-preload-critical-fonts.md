# Plan 003: Preload the three Inter weights used above the fold

> **Executor instructions**: Follow this plan step by step. Run every verification command and confirm the expected result before moving on. If a STOP condition occurs, stop and report; do not improvise. Update this plan's row in `plans/README.md` when done, unless the reviewer maintains the index.
>
> **Drift check (run first)**: `git diff --stat 398dc2a..HEAD -- web/index.html`
> If `web/index.html` changed since this plan was written, compare the current-state excerpt with the live code. A mismatch is a STOP condition.

## Status

- **Priority**: P2
- **Effort**: S
- **Risk**: LOW
- **Depends on**: none
- **Category**: perf
- **Planned at**: commit `398dc2a`, 2026-11-24

## Why this matters

The home page uses Inter 400 for body text, 700 for headings and 600 text, and 900 for 800-weight display text. In the audit production load, the browser discovered these fonts only after the CSS loaded; all three requests started at about 136ms. A font preload can start the same files with the document, reducing the delay before text and LCP can render.

Only the three weights used by the home page should be preloaded. The 300 and 500 faces are not used on the home page; preloading them would add about 34KB of unnecessary WOFF2 traffic. This plan changes no typography, copy, or visual design.

## Current state

`web/index.html:1-22` is the HTML entry. It has no font preloads:

```html
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link rel="icon" href="/assets/img/favicon.ico" />
    <meta property="og:image" content="/assets/img/logo.png" />
    <meta property="og:title" content="Pixies - Automated Speedtests" />
    <meta property="og:description" content="Track your internet speed automatically with detailed analytics and history" />
    <meta name="description" content="Track your internet speed automatically. Pixies runs scheduled speed tests and provides detailed analytics with a configurable history retention period." />
    <meta name="theme-color" content="#0a0e12" />
    <meta http-equiv="content-Type" content="text/html; utf-8" />
    <meta name="robots" content="INDEX,FOLLOW" />
    <meta http-equiv="content-Language" content="en" />
    <meta name="keywords" content="pixies, network, speedtest, internet speed test, network monitoring" />
    <meta name="author" content="Pixies" />
    <title>Pixies - Automated Speedtests</title>
</head>
```

`web/src/common/styles/fonts.sass:1-34` declares five Inter faces with `font-display: swap`. Their files live in `web/public/assets/fonts/`, so the URLs are stable across builds:

| Weight | WOFF2 bytes | Home-page use |
|---|---:|---|
| 300 | 17,328 | None |
| 400 | 16,708 | Body text |
| 500 | 17,552 | None on home |
| 700 | 17,784 | Headings and 600-weight text |
| 900 | 17,176 | 800-weight display text |

Audit baseline on the production preview:

- Local desktop 1440x900: FCP 376ms, LCP 492ms.
- Local mobile 390x844: FCP 284ms, LCP 296ms, CLS 0.05.
- All three required WOFF2 files loaded; 300 and 500 remained `unloaded` in `document.fonts`.
- Font requests started at about 136ms, after the CSS request at about 25ms.
- These are local observations, not field data or guaranteed improvement thresholds.

Repo conventions: two-space HTML indentation, double-quoted attributes, plain JavaScript/JSX elsewhere. `brand/brand.md:47-57` specifies Inter for UI/product type and a system fallback; keep both unchanged.

## Commands you will need

Run commands from the repository root unless stated otherwise.

| Purpose | Command | Expected on success |
|---|---|---|
| Build | `cd web && bun run build` | Exit 0; preload links remain in `web/dist/index.html`. Existing Vite/Sass warnings are allowed. |
| Inspect built HTML | `rg -n 'rel="preload"|inter-v12-latin' web/dist/index.html` | Exactly three font preloads: 400, 700, 900. |
| Lint baseline | `cd web && bun run lint` | Known baseline failure: ESLint 10 cannot find `eslint.config.*`. Do not fix lint config. |
| Preview | `cd web && bun run preview -- --host 127.0.0.1 --port 4173` | Serves the production build; stop after browser checks. |
| Scope check | `git status --short` | Only `web/index.html` changed by this task, plus the pre-existing brand changes. |

There is no automated test suite (`README.md:187-188`). Browser checks use existing Chrome/Chromium DevTools; install no packages.

## Scope

**In scope** (the only file to modify):

- `web/index.html`

**Out of scope** (do NOT touch):

- `web/src/common/styles/fonts.sass` or any font binary.
- Weights 300 and 500; do not preload or delete them.
- Image markup or assets; plans 001-002 own those.
- Package manifests, lockfiles, Vite config, ESLint config.
- `client/`, `server/`, `docs/`, `brand/`, and all other apps.
- The pre-existing deletion of `brand/launch.mp4` and untracked `brand/pixies.mp4`. Preserve and never stage or commit them.
- Font family, fallback stack, weights, sizes, colors, or layout.

## Git workflow

The operator requires each completed task to be committed and pushed separately to `origin/master`.

- Do not create a branch.
- After all gates pass, commit only `web/index.html` with `perf(web): preload critical Inter font weights`.
- Never use `git add .` or `git add -A`. Use the harness selective-commit tool when available; otherwise stage the exact path `web/index.html`.
- Push with `git push origin master`.
- Confirm the commit contains no `brand/` path and the pre-existing brand changes remain in the worktree.

## Steps

### Step 1: Add three font preload links

In `web/index.html`, immediately after the favicon link at line 6, add:

```html
<link rel="preload" as="font" type="font/woff2" href="/assets/fonts/inter-v12-latin-regular.woff2" crossorigin />
<link rel="preload" as="font" type="font/woff2" href="/assets/fonts/inter-v12-latin-700.woff2" crossorigin />
<link rel="preload" as="font" type="font/woff2" href="/assets/fonts/inter-v12-latin-900.woff2" crossorigin />
```

Keep `crossorigin` even though the fonts are same-origin. Font fetches are CORS requests, and omitting it causes a second fetch.

Do not preload 300 or 500. Do not add JavaScript, a font observer, `font-display` changes, or new font files.

**Verify**: `rg -n 'rel="preload"|inter-v12-latin' web/index.html` → exactly three preload lines, for regular, 700, and 900, each with `type="font/woff2"` and `crossorigin`.

### Step 2: Build and inspect the production HTML

**Verify**: `cd web && bun run build` → exit 0. The build may repeat the known `__dirname` and Sass `lighten()` warnings.

Then run `rg -n 'rel="preload"|inter-v12-latin' web/dist/index.html`.

Expected: the same three font preloads appear in the built HTML with unchanged `/assets/fonts/...` URLs. No preload references 300 or 500.

### Step 3: Verify one request per font and no unused-font warning

Start the preview. Open `http://127.0.0.1:4173/` at 1440x900 with cache disabled. Wait for the page to settle, then check the Network panel and browser console.

**Verify**:

- Exactly one successful request is made for each of the regular, 700, and 900 WOFF2 files.
- No request is made for the 300 or 500 WOFF2 or any TTF file.
- The console contains no warning that a preloaded font was not used.
- Text renders in Inter after the fonts load; the fallback remains visible before swap, as it does today.

Run this in the browser console:

```js
({
  fonts: [...document.fonts].map((font) => ({weight: font.weight, status: font.status})),
  requests: performance.getEntriesByType("resource")
    .filter((entry) => entry.name.includes("/assets/fonts/"))
    .map((entry) => ({
      name: entry.name.split("/").pop(),
      initiatorType: entry.initiatorType,
      startTime: Math.round(entry.startTime),
      transferSize: entry.transferSize
    }))
})
```

Expected: weights 400, 700, and 900 are `loaded`; weights 300 and 500 are `unloaded`; the three font resource entries initiate from `link`; each has one transfer and starts earlier than the audit baseline's roughly 136ms on the same local preview setup.

### Step 4: Recheck the mobile home page

Repeat the Network and console checks at 390x844 with cache disabled. Record FCP, LCP, and CLS from the Performance panel before and after the change using the same machine and settings.

**Verify**: the same three fonts load once, 300/500 stay unloaded, and there are no console errors. Compare the after metrics with the recorded before metrics; a local timing improvement is expected but not guaranteed. Any material visual or layout regression is a failure even if timing improves.

## Test plan

No unit-test framework exists. The regression checks are:

- Built HTML contains exactly the three intended preloads.
- Browser makes one request per intended font and none for unused faces or TTF fallbacks.
- `document.fonts` reports the expected loaded/unloaded weights.
- No unused-preload warning or console error appears.
- Desktop and mobile typography remain visually unchanged.
- Record before/after FCP, LCP, and CLS; do not claim a field improvement from a local run.

## Done criteria

ALL must hold:

- [ ] `web/index.html` contains exactly three font preloads for 400, 700, and 900.
- [ ] No preload references 300, 500, or a TTF file.
- [ ] `cd web && bun run build` exits 0 and preserves all three links in `web/dist/index.html`.
- [ ] Browser checks pass at 1440x900 and 390x844.
- [ ] Each intended font has one request; unused faces and TTF files have none.
- [ ] No unused-preload warning, console error, or visual/layout regression appears.
- [ ] Before/after FCP, LCP, and CLS are recorded in the task result.
- [ ] `git status --short` contains no out-of-scope changes except the preserved brand changes.
- [ ] `plans/README.md` status row is `DONE`.
- [ ] The scoped commit is pushed to `origin/master`; the commit contains no `brand/` path.

## STOP conditions

Stop and report if:

- `web/index.html` differs from the current-state excerpt.
- The built HTML drops or rewrites the font URLs.
- Any intended font is requested twice, any unused face is requested, or the browser reports an unused preload.
- Removing the preloads is required to avoid a regression.
- The selective commit would include `brand/launch.mp4` or `brand/pixies.mp4`.

## Maintenance notes

- If the home page stops using one of these weights, remove its preload in the same change.
- If a new above-fold weight is introduced, measure whether it is needed before adding another preload; more preloads can compete with the hero image.
- Keep the WOFF2 filenames stable or update the preload URLs with the font change.
- The 300 and 500 files may still be used by secondary pages. This plan neither removes nor preloads them.
