# Plan 002: Serve viewport-sized lossless WebP screenshots

> **Executor instructions**: Follow this plan step by step. Run every verification command and confirm the expected result before moving on. If a STOP condition occurs, stop and report; do not improvise. Update this plan's row in `plans/README.md` when done, unless the reviewer maintains the index.
>
> **Drift check (run first)**: `git diff --stat 398dc2a..HEAD -- web/src/common/assets web/src/pages/Home/Home.jsx web/src/pages/Home/components/Features/Features.jsx`
> If any in-scope file changed since this plan was written, compare the current-state excerpts with the live code. A mismatch is a STOP condition.

## Status

- **Priority**: P1
- **Effort**: M
- **Risk**: LOW
- **Depends on**: `plans/001-prioritize-and-reserve-screenshots.md`
- **Category**: perf
- **Planned at**: commit `398dc2a`, 2026-11-24

## Why this matters

The home page ships three PNG screenshots totaling 799,442 bytes to every visitor, regardless of viewport or pixel density. Their intrinsic widths are 1873, 1905, and 2400 pixels, while the current layout renders them at about 341-647 CSS pixels wide. A phone at DPR2 still needs only about 684 pixels for the feature slots.

Lossless WebP variants at 400, 800, and 1200 pixels (1300 for the hero) preserve image content while letting the browser choose a right-sized file. Audit-generated variants totaled 235,374 bytes for the three 800px files, a 70.6% reduction from the current PNGs at mobile DPR2 and desktop DPR1. The original PNGs remain as fallbacks, and no runtime dependency is added.

## Current state

This plan assumes plan 001 has landed. The three fallback images must already have intrinsic dimensions and loading/priority attributes:

```jsx
// web/src/pages/Home/Home.jsx, after plan 001
<img
    src={InterfaceImage}
    alt="Pixies Interface"
    width="1873"
    height="896"
    loading="eager"
    fetchPriority="high"
    decoding="async"
    draggable={false}
/>
```

```jsx
// web/src/pages/Home/components/Features/Features.jsx, after plan 001
<img
    src={Screenshot1}
    alt="Automated speed testing interface"
    width="1905"
    height="998"
    loading="lazy"
    fetchPriority="low"
    decoding="async"
/>
```

```jsx
<img
    src={Screenshot2}
    alt="Speed test analytics dashboard"
    width="2400"
    height="1350"
    loading="lazy"
    fetchPriority="low"
    decoding="async"
/>
```

Current imports:

```jsx
// web/src/pages/Home/Home.jsx:1
import InterfaceImage from "@/common/assets/interface.png";
```

```jsx
// web/src/pages/Home/components/Features/Features.jsx:2-3
import Screenshot1 from "@/common/assets/sc1.png";
import Screenshot2 from "@/common/assets/sc2.png";
```

Layout facts that determine `sizes`:

- Hero: `web/src/pages/Home/styles.sass:78-83` caps `.interface-preview` at 650px. At <=1100px the grid stacks; page side padding is 6rem above 640px and 3rem at <=640px (`web/src/pages/Home/styles.sass:90-113`).
- Features: `web/src/pages/Home/components/Features/styles.sass:3-18` gives each image about 534px on wide desktops. At <=900px the grid stacks with 4rem side padding; at <=640px padding becomes 3rem total (`web/src/pages/Home/components/Features/styles.sass:56-82`).

Repo conventions: plain JavaScript/JSX, double quotes, component-adjacent Sass, no TypeScript. Keep the current PNG files unchanged as fallbacks. `brand/brand.md:75-94` governs the logo, not these product screenshots; do not recrop, annotate, or redesign the screenshots.

## Commands you will need

Run commands from the repository root unless stated otherwise.

| Purpose | Command | Expected on success |
|---|---|---|
| Check existing image tool | `python -c "import PIL; print(PIL.__version__)"` | Prints an installed Pillow version. If Pillow is absent, STOP; do not install it. |
| Build | `cd web && bun run build` | Exit 0; hashed WebP assets appear in `web/dist/assets/`. Existing Vite/Sass warnings are allowed. |
| Lint baseline | `cd web && bun run lint` | Known baseline failure: ESLint 10 cannot find `eslint.config.*`. Do not fix lint config. |
| Preview | `cd web && bun run preview -- --host 127.0.0.1 --port 4173` | Serves the production build; stop after browser checks. |
| Scope check | `git status --short` | Only the in-scope assets and two JSX files changed, plus the pre-existing brand changes. |

There is no automated test suite (`README.md:187-188`). Use the build, exact asset checks, and browser checks below. Install no packages.

## Scope

**In scope** (the only files to create or modify):

- `web/src/common/assets/interface-400.webp`
- `web/src/common/assets/interface-800.webp`
- `web/src/common/assets/interface-1300.webp`
- `web/src/common/assets/sc1-400.webp`
- `web/src/common/assets/sc1-800.webp`
- `web/src/common/assets/sc1-1200.webp`
- `web/src/common/assets/sc2-400.webp`
- `web/src/common/assets/sc2-800.webp`
- `web/src/common/assets/sc2-1200.webp`
- `web/src/pages/Home/Home.jsx`
- `web/src/pages/Home/components/Features/Features.jsx`

**Out of scope** (do NOT touch):

- Existing PNGs, `web/public/`, fonts, favicon, logo, or social image.
- Sass files; plan 001 already added `height: auto`.
- `web/index.html`, package manifests, lockfiles, Vite config, ESLint config.
- `client/`, `server/`, `docs/`, `brand/`, and all other apps.
- The pre-existing deletion of `brand/launch.mp4` and untracked `brand/pixies.mp4`. Preserve and never stage or commit them.
- Cropping, lossy compression, visual redesign, copy, route structure, or accessibility behavior.

## Git workflow

The operator requires each completed task to be committed and pushed separately to `origin/master`.

- Do not create a branch.
- After all gates pass, commit only the in-scope files with `perf(web): serve responsive lossless screenshots`.
- Never use `git add .` or `git add -A`. Use the harness selective-commit tool when available; otherwise stage the eleven exact paths.
- Push with `git push origin master`.
- Confirm the commit contains no `brand/` path and the pre-existing brand changes remain in the worktree.

## Steps

### Step 1: Generate lossless variants from the existing PNGs

Run this from the repository root. It only writes the nine in-scope WebP files:

```bash
python - <<'PY'
from pathlib import Path
from PIL import Image

assets = Path("web/src/common/assets")
variants = {
    "interface": (400, 800, 1300),
    "sc1": (400, 800, 1200),
    "sc2": (400, 800, 1200),
}

for name, widths in variants.items():
    with Image.open(assets / f"{name}.png") as source:
        for width in widths:
            height = round(source.height * width / source.width)
            image = source.resize((width, height), Image.Resampling.LANCZOS)
            image.save(assets / f"{name}-{width}.webp", "WEBP", lossless=True, method=6)
PY
```

Do not overwrite the source PNGs. Do not use lossy WebP quality settings.

**Verify**: run this check:

```bash
python - <<'PY'
from pathlib import Path
from PIL import Image

expected = {
    "interface-400.webp": (400, 191),
    "interface-800.webp": (800, 383),
    "interface-1300.webp": (1300, 622),
    "sc1-400.webp": (400, 210),
    "sc1-800.webp": (800, 419),
    "sc1-1200.webp": (1200, 629),
    "sc2-400.webp": (400, 225),
    "sc2-800.webp": (800, 450),
    "sc2-1200.webp": (1200, 675),
}
assets = Path("web/src/common/assets")
for name, size in expected.items():
    with Image.open(assets / name) as image:
        assert image.size == size, (name, image.size, size)
        print(name, image.size, (assets / name).stat().st_size)
PY
```

Expected: all assertions pass. Audit-generated byte totals were 23,802 + 67,218 + 146,630 for `interface`, 24,388 + 68,504 + 150,240 for `sc1`, and 35,028 + 99,652 + 158,206 for `sc2`. Small encoder-version differences are acceptable within the gates below.

### Step 2: Add WebP `<source>` elements while retaining PNG fallbacks

In `web/src/pages/Home/Home.jsx`, keep the original PNG import and add three imports:

```jsx
import Interface400 from "@/common/assets/interface-400.webp";
import Interface800 from "@/common/assets/interface-800.webp";
import Interface1300 from "@/common/assets/interface-1300.webp";
```

Replace the hero `<img>` with:

```jsx
<picture>
    <source
        type="image/webp"
        srcSet={`${Interface400} 400w, ${Interface800} 800w, ${Interface1300} 1300w`}
        sizes="(max-width: 640px) calc(100vw - 3rem), (max-width: 1100px) calc(100vw - 6rem), 650px"
    />
    <img
        src={InterfaceImage}
        alt="Pixies Interface"
        width="1873"
        height="896"
        loading="eager"
        fetchPriority="high"
        decoding="async"
        draggable={false}
    />
</picture>
```

In `web/src/pages/Home/components/Features/Features.jsx`, keep both original PNG imports and add six WebP imports:

```jsx
import Screenshot1400 from "@/common/assets/sc1-400.webp";
import Screenshot1800 from "@/common/assets/sc1-800.webp";
import Screenshot11200 from "@/common/assets/sc1-1200.webp";
import Screenshot2400 from "@/common/assets/sc2-400.webp";
import Screenshot2800 from "@/common/assets/sc2-800.webp";
import Screenshot21200 from "@/common/assets/sc2-1200.webp";
```

Replace the first feature image with:

```jsx
<picture>
    <source
        type="image/webp"
        srcSet={`${Screenshot1400} 400w, ${Screenshot1800} 800w, ${Screenshot11200} 1200w`}
        sizes="(max-width: 640px) calc(100vw - 3rem), (max-width: 900px) calc(100vw - 4rem), 534px"
    />
    <img
        src={Screenshot1}
        alt="Automated speed testing interface"
        width="1905"
        height="998"
        loading="lazy"
        fetchPriority="low"
        decoding="async"
    />
</picture>
```

Replace the second feature image with:

```jsx
<picture>
    <source
        type="image/webp"
        srcSet={`${Screenshot2400} 400w, ${Screenshot2800} 800w, ${Screenshot21200} 1200w`}
        sizes="(max-width: 640px) calc(100vw - 3rem), (max-width: 900px) calc(100vw - 4rem), 534px"
    />
    <img
        src={Screenshot2}
        alt="Speed test analytics dashboard"
        width="2400"
        height="1350"
        loading="lazy"
        fetchPriority="low"
        decoding="async"
    />
</picture>
```

The `<picture>` wrappers are transparent to the existing descendant-image Sass selectors. Do not add classes or change layout CSS.

**Verify**: `rg -n 'picture|type="image/webp"|srcSet=|sizes=|src=\{InterfaceImage\}|src=\{Screenshot[12]\}' web/src/pages/Home/Home.jsx web/src/pages/Home/components/Features/Features.jsx` → three `<picture>` blocks, three WebP sources, and all three original PNG fallbacks remain.

### Step 3: Build and verify emitted assets

**Verify**: `cd web && bun run build` → exit 0. The output must list nine hashed `.webp` files in addition to the original hashed PNGs. The build may repeat known Vite/Sass warnings.

Check the selected source files' total bytes:

```bash
python - <<'PY'
from pathlib import Path

assets = Path("web/src/common/assets")
groups = {
    "400px": ["interface-400.webp", "sc1-400.webp", "sc2-400.webp"],
    "800px": ["interface-800.webp", "sc1-800.webp", "sc2-800.webp"],
    "1200px": ["sc1-1200.webp", "sc2-1200.webp"],
    "1300px": ["interface-1300.webp"],
}
for label, names in groups.items():
    total = sum((assets / name).stat().st_size for name in names)
    print(label, total)
    if label == "400px":
        assert total <= 90_000, total
    if label == "800px":
        assert total <= 250_000, total
assert sum((assets / name).stat().st_size for name in groups["1200px"] + groups["1300px"]) <= 460_000
PY
```
Expected: all assertions pass. The 800px total should be about 235KB; the desktop-DPR2 total should be about 455KB.

### Step 4: Verify browser candidate selection and visual parity

Start the production preview. In Chrome DevTools device toolbar, test these four cases with cache disabled:

| Viewport | DPR | Expected `naturalWidth` for hero | Expected `naturalWidth` for each feature |
|---|---:|---:|---:|
| 390x844 | 1 | 400 | 400 |
| 390x844 | 2 | 800 | 800 |
| 1440x900 | 1 | 800 | 800 |
| 1440x900 | 2 | 1300 | 1200 |

For each case, load `/`, scroll both feature blocks into view, and run:

```js
[...document.querySelectorAll(".home-page picture img")].map((image) => ({
  alt: image.alt,
  currentSrc: image.currentSrc,
  naturalWidth: image.naturalWidth,
  naturalHeight: image.naturalHeight,
  renderedWidth: image.getBoundingClientRect().width,
  renderedHeight: image.getBoundingClientRect().height
}))
```

**Verify**: `currentSrc` ends in the expected `.webp` variant; dimensions and rendered aspect ratios match the table and the existing layout. Compare screenshots at 390x844 and 1440x900 with the pre-change page. Text, crop, colors, borders, transforms, and spacing must remain visually unchanged. No console errors appear.

## Test plan

No unit-test framework exists. The regression checks are:

- Exact dimensions and byte ceilings for all nine generated files.
- Production build emits the WebP assets.
- Browser selects the expected candidate at mobile/desktop DPR1 and DPR2.
- Original PNG fallbacks remain in markup and still render if WebP sources are removed in DevTools.
- Lazy feature images still load on scroll.
- Side-by-side screenshots confirm no visual change.

## Done criteria

ALL must hold:

- [ ] Pillow was already available; no dependency was installed.
- [ ] All nine WebP files have the exact expected dimensions.
- [ ] The 400px total is <=90,000 bytes; the 800px total is <=250,000 bytes; the desktop-DPR2 total is <=460,000 bytes.
- [ ] `cd web && bun run build` exits 0 and emits all nine hashed WebP assets.
- [ ] All four browser candidate-selection cases pass.
- [ ] PNG fallbacks remain functional and visual comparison passes at 390x844 and 1440x900.
- [ ] `git status --short` contains no out-of-scope changes except the preserved brand changes.
- [ ] `plans/README.md` status row is `DONE`.
- [ ] The scoped commit is pushed to `origin/master`; the commit contains no `brand/` path.

## STOP conditions

Stop and report if:

- Plan 001 has not landed or the current images lack dimensions/loading hints.
- Pillow is unavailable. Do not install it or add an image dependency.
- The PNGs differ from the dimensions in the current-state table.
- Lossless encoding cannot meet the byte ceilings without resizing beyond the specified widths.
- A browser selects a candidate outside the expected table; investigate `sizes` before changing layout.
- Visual comparison shows any crop, color, geometry, or spacing change.
- The selective commit would include `brand/launch.mp4` or `brand/pixies.mp4`.

## Maintenance notes

- If the hero max-width or feature-grid breakpoints change, update the two `sizes` strings and re-check candidate selection.
- If a source screenshot changes, regenerate all three of its variants and update its intrinsic width/height in plan 001's markup.
- Keep the largest original PNG as the fallback; do not delete it just because modern browsers choose WebP.
- The variant widths cover current slots through DPR2. Revisit them if the layout starts rendering images wider than 650px for the hero or 836px for features.
