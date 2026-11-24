# Plan 003: Preload Inter 400 and 700 globally

> **Executor instructions**: Follow this plan step by step. Run every verification command and confirm the expected result before moving on. If a STOP condition occurs, stop and report; do not improvise. Update this plan's row in `plans/README.md` when done, unless the reviewer maintains the index.
>
> **Drift check (run first)**: `git diff ffd4624 -- web/index.html` and `git status --short -- web/index.html`
> If `web/index.html` changed since this plan was written, compare the current-state excerpt with the live code. A mismatch is a STOP condition.

## Status

- **Priority**: P2
- **Effort**: S
- **Risk**: LOW
- **Depends on**: none
- **Category**: perf
- **Planned at**: commit `ffd4624`, 2026-11-24

## Why this matters

The home page uses Inter 400 for body text and 700 for headings and 600-weight text. Both faces are used across the public site, but the browser discovers them only after CSS loads; both requests started at about 136ms in the audit load. Preloading these two files starts the same 34,492 bytes with the document.

Inter 900 serves the home hero's 800-weight display text and the 404 heading, but normal secondary routes do not use it. A global 900 preload would waste 17,176 bytes and can trigger an unused-preload warning on those routes, so 900 remains on normal CSS discovery. This plan changes no typography, copy, or visual design.

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

| Weight | WOFF2 bytes | Use | Global preload |
|---|---:|---|---|
| 300 | 17,328 | Unused by the public site | No |
| 400 | 16,708 | Body text on every route | Yes |
| 500 | 17,552 | Install and submission controls | No |
| 700 | 17,784 | Headings and 600-weight text | Yes |
| 900 | 17,176 | Home and 404 display text | No; CSS discovery |

Audit baseline on the production preview:

- Local desktop 1440x900: FCP 376ms, LCP 492ms.
- Local mobile 390x844: FCP 284ms, LCP 296ms, CLS 0.05.
- All three required WOFF2 files loaded; 300 and 500 remained `unloaded` in `document.fonts`.
- Font requests started at about 136ms, after the CSS request at about 25ms.
- These are local observations, not field data or guaranteed improvement thresholds.

Repo conventions: the current HTML entry uses four-space indentation and double-quoted attributes; match it. Plain JavaScript/JSX elsewhere. `brand/brand.md:47-57` specifies Inter for UI/product type and a system fallback; keep both unchanged.

## Commands you will need

Run commands from the repository root unless stated otherwise.

| Purpose | Command | Expected on success |
|---|---|---|
| Build | `cd web && bun run build` | Exit 0; preload links remain in `web/dist/index.html`. Existing Vite/Sass warnings are allowed. |
| Inspect built HTML | `rg -n 'rel="preload"|inter-v12-latin' web/dist/index.html` | Exactly two font preloads: 400 and 700. |
| Lint baseline | `cd web && bun run lint` | Known baseline failure: ESLint 10 cannot find `eslint.config.*`. Do not fix lint config. |
| Preview | `cd web && bun run preview -- --host 127.0.0.1 --port 4173` | Serves the production build; stop after browser checks. |
| Scope check | `git status --short` | Only `web/index.html` and the two plan files changed, plus the pre-existing brand changes. |

There is no automated test suite (`README.md:187-188`). Browser checks use existing Chrome/Chromium DevTools; install no packages.

## Scope

**In scope** (the only files to modify):

- `web/index.html`
- `plans/README.md`
- `plans/003-preload-critical-fonts.md`

**Out of scope** (do NOT touch):

- `web/src/common/styles/fonts.sass` or any font binary.
- Weights 300, 500, and 900; do not preload or delete them.
- Image markup or assets; plans 001-002 own those.
- Package manifests, lockfiles, Vite config, ESLint config.
- `client/`, `server/`, `docs/`, `brand/`, and all other apps.
- The pre-existing deletion of `brand/launch.mp4` and untracked `brand/pixies.mp4`. Preserve and never stage or commit them.
- Font family, fallback stack, weights, sizes, colors, or layout.

## Git workflow

The operator requires each completed task to be committed and pushed separately to `origin/master`.

- Do not create a branch.
- After all gates pass, commit `web/index.html` together with `plans/README.md` and this corrected plan file using `perf(web): preload critical Inter font weights`.
- Never use `git add .` or `git add -A`. Use the harness selective-commit tool when available; otherwise stage the three exact paths listed in Scope.
- Push with `git push origin master`.
- Confirm the commit contains no `brand/` path and the pre-existing brand changes remain in the worktree.

## Steps

### Step 1: Add two global font preload links

In `web/index.html`, immediately after the favicon link at line 6, add:

```html
<link rel="preload" as="font" type="font/woff2" href="/assets/fonts/inter-v12-latin-regular.woff2" crossorigin />
<link rel="preload" as="font" type="font/woff2" href="/assets/fonts/inter-v12-latin-700.woff2" crossorigin />
```

Keep `crossorigin` even though the fonts are same-origin. Font fetches are CORS requests, and omitting it causes a second fetch.

Do not preload 300, 500, or 900. Do not add JavaScript, a font observer, `font-display` changes, or new font files.

**Verify**: `rg -n 'rel="preload"|inter-v12-latin' web/index.html` → exactly two preload lines, for regular and 700, each with `type="font/woff2"` and `crossorigin`.

### Step 2: Build and inspect the production HTML

**Verify**: `cd web && bun run build` → exit 0. The build may repeat the known `__dirname` and Sass `lighten()` warnings.

Then run `rg -n 'rel="preload"|inter-v12-latin' web/dist/index.html`.

Expected: the same two font preloads appear in the built HTML with unchanged `/assets/fonts/...` URLs. No preload references 300, 500, or 900.

### Step 3: Verify one request per font and no unused-font warning

Start the preview. Open `http://127.0.0.1:4173/` at 1440x900 with cache disabled. Wait for the page to settle, then check the Network panel and browser console.

**Verify**:

- Exactly one successful preload request is made for each of the regular and 700 WOFF2 files.
- Inter 900 is requested once through normal CSS discovery because the home hero uses it.
- No request is made for the 300 or 500 WOFF2 files or any TTF file on home.
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

Expected on home: weights 400, 700, and 900 are `loaded`; weights 300 and 500 are `unloaded`; the 400 and 700 resource entries initiate from `link`; 900 initiates from CSS; each file has one transfer and the preloaded faces start earlier than the audit baseline's roughly 136ms on the same local preview setup.

### Step 4: Recheck mobile home and secondary routes

Repeat the home Network and console checks at 390x844 with cache disabled. Record FCP, LCP, and CLS from the Performance panel before and after the change using the same machine and settings.

Then open each secondary route directly with cache disabled: `/install`, `/tutorials`, `/tutorials/submit`, `/imprint`, and `/privacy`.

**Verify**: home still loads 400, 700, and 900 once, while 300/500 stay unloaded. On every secondary route, 400 and 700 load once from `link`, 900 is neither requested nor loaded, and no unused-preload warning or console error appears. Weight 500 may load on routes that use it. Compare home before/after metrics; a local timing improvement is expected but not guaranteed. Any material visual or layout regression is a failure even if timing improves.

## Test plan

No unit-test framework exists. The regression checks are:

- Built HTML contains exactly the two intended preloads.
- Browser makes one preload request each for 400 and 700 on every route.
- Home loads 900 once through CSS; secondary routes never request 900.
- `document.fonts` reports the expected loaded/unloaded weights for each route.
- No unused-preload warning or console error appears.
- Desktop, mobile, and secondary-route typography remain visually unchanged.
- Record before/after FCP, LCP, and CLS; do not claim a field improvement from a local run.

## Done criteria

ALL must hold:

- [ ] `web/index.html` contains exactly two font preloads for 400 and 700.
- [ ] No preload references 300, 500, 900, or a TTF file.
- [ ] `cd web && bun run build` exits 0 and preserves both links in `web/dist/index.html`.
- [ ] Home browser checks pass at 1440x900 and 390x844; 900 loads once through CSS.
- [ ] Direct checks pass on all five secondary routes; 900 is not requested and no unused-preload warning appears.
- [ ] Each preloaded font has one request on every route; no console error or visual/layout regression appears.
- [ ] Before/after FCP, LCP, and CLS are recorded in the task result.
- [ ] `git status --short` contains no out-of-scope changes except the preserved brand changes.
- [ ] `plans/README.md` status row is `DONE`, and this plan file is included if the executor corrected it.
- [ ] The scoped commit includes `web/index.html`, `plans/README.md`, and this plan file, is pushed to `origin/master`, and contains no `brand/` path.

## STOP conditions

Stop and report if:

- `web/index.html` differs from the current-state excerpt.
- The built HTML drops or rewrites the font URLs.
- Any intended font is requested twice, a preloaded face is unused, 900 is preloaded or requested on a secondary route, or the browser reports an unused preload.
- Removing the preloads is required to avoid a regression.
- The selective commit would include `brand/launch.mp4` or `brand/pixies.mp4`.

## Maintenance notes

- If a route starts using 900 above the fold, measure the benefit before changing its discovery path; do not restore a global preload by default.
- If a new globally used weight is introduced, measure whether it is needed before adding another preload; more preloads can compete with the hero image.
- Keep the WOFF2 filenames stable or update the preload URLs with the font change.
- The 300, 500, and 900 files remain available to CSS. This plan neither removes nor preloads them.
