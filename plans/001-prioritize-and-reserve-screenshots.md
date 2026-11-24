# Plan 001: Reserve screenshot space and prioritize loading

> **Executor instructions**: Follow this plan step by step. Run every verification command and confirm the expected result before moving on. If a STOP condition occurs, stop and report; do not improvise. Update this plan's row in `plans/README.md` when done, unless the reviewer maintains the index.
>
> **Drift check (run first)**: `git diff --stat 398dc2a..HEAD -- web/src/pages/Home/Home.jsx web/src/pages/Home/components/Features/Features.jsx web/src/pages/Home/styles.sass web/src/pages/Home/components/Features/styles.sass`
> If any in-scope file changed since this plan was written, compare the current-state excerpts with the live code. A mismatch is a STOP condition.

## Status

- **Priority**: P1
- **Effort**: S
- **Risk**: LOW
- **Depends on**: none
- **Category**: perf
- **Planned at**: commit `398dc2a`, 2026-11-24

## Why this matters

The home page requests all three screenshots immediately. The two feature screenshots are below a hero that is at least one viewport tall, but they still compete with the hero image and fonts for bandwidth. At 390x844 on a throttled mobile connection, the hero image took 3.12 seconds to transfer and LCP was 4.54 seconds in the audit run.

The images also have no intrinsic dimensions in markup. Their boxes gain their final height only after image metadata arrives, which can move later content. Reserving the exact existing aspect ratios and giving the hero high priority makes the current layout more stable and gets the visible screenshot delivered first without changing its appearance.

## Current state

Relevant files:

- `web/src/pages/Home/Home.jsx` — home page and above-fold hero image.
- `web/src/pages/Home/components/Features/Features.jsx` — two below-fold feature screenshots.
- `web/src/pages/Home/styles.sass` — hero image width and 3D presentation.
- `web/src/pages/Home/components/Features/styles.sass` — feature image width and border.

Current excerpts:

```jsx
// web/src/pages/Home/Home.jsx:49-52
<div className="hero-visual">
    <div className="interface-preview">
        <img src={InterfaceImage} alt="Pixies Interface" draggable={false}/>
    </div>
</div>
```

```jsx
// web/src/pages/Home/components/Features/Features.jsx:17-19
<div className="feature-image">
    <img src={Screenshot1} alt="Automated speed testing interface"/>
</div>
```

```jsx
// web/src/pages/Home/components/Features/Features.jsx:31-33
<div className="feature-image">
    <img src={Screenshot2} alt="Speed test analytics dashboard"/>
</div>
```

```sass
// web/src/pages/Home/styles.sass:78-88
.interface-preview
  position: relative
  z-index: 2
  width: 100%
  max-width: 650px
  transform: rotateY(-8deg) rotateX(4deg)
  transform-style: preserve-3d

  img
    width: 100%
    border-radius: 12px
```

```sass
// web/src/pages/Home/components/Features/styles.sass:48-54
.feature-image
  position: relative

  img
    width: 100%
    border-radius: 12px
    border: 1px solid $border-color
```

Asset dimensions measured during recon:

| Asset | Intrinsic size | Bytes |
|---|---:|---:|
| `web/src/common/assets/interface.png` | 1873x896 | 179,863 |
| `web/src/common/assets/sc1.png` | 1905x998 | 189,197 |
| `web/src/common/assets/sc2.png` | 2400x1350 | 430,382 |

Baseline browser observations on the production preview:

- Desktop 1440x900: hero rendered at 647x323; feature images at 534x280 and 534x301.
- Mobile 390x844: hero rendered at about 341x163; feature images at 342x181 and 342x192.
- All three images had `loading="auto"`, `decoding="auto"`, and `fetchPriority="auto"`.
- Local mobile CLS was 0.05. This is a local audit observation, not field data.

Repo conventions: plain JavaScript/JSX, double quotes, component-adjacent Sass, no TypeScript. Keep the existing class names, alt text, `draggable={false}`, transforms, borders, and breakpoints. `brand/brand.md:47-57` requires Inter and restrained typography; this plan does not change type.

## Commands you will need

Run commands from the repository root unless stated otherwise.

| Purpose | Command | Expected on success |
|---|---|---|
| Build | `cd web && bun run build` | Exit 0; Vite emits `dist/index.html` and hashed assets. Existing Vite/Sass warnings are allowed. |
| Lint baseline | `cd web && bun run lint` | Known baseline failure: ESLint 10 cannot find `eslint.config.*`. Do not fix lint config in this plan. |
| Preview | `cd web && bun run preview -- --host 127.0.0.1 --port 4173` | Preview serves the production build; stop it after browser checks. |
| Scope check | `git status --short` | Only this plan's in-scope files are changed by this task, plus the pre-existing brand changes described below. |

There is no automated test suite (`README.md:187-188`). Browser checks below use existing Chrome/Chromium DevTools; install no audit packages.

## Scope

**In scope** (four source/Sass files plus authorized task documentation):

- `web/src/pages/Home/Home.jsx`
- `web/src/pages/Home/components/Features/Features.jsx`
- `web/src/pages/Home/styles.sass`
- `web/src/pages/Home/components/Features/styles.sass`
- `plans/001-prioritize-and-reserve-screenshots.md` (verification corrections)
- `plans/README.md` (row 001 status only)

**Out of scope** (do NOT touch):

- Any image binary; responsive variants belong to plan 002.
- `web/index.html`; font preloads belong to plan 003.
- `web/package.json`, `web/bun.lock`, dependencies, Vite config, ESLint config.
- `client/`, `server/`, `docs/`, `brand/`, and all other repositories or apps.
- The pre-existing deletion of `brand/launch.mp4` and untracked `brand/pixies.mp4`. Preserve them and never stage or commit them.
- Visual design, copy, route structure, accessibility behavior, and responsive breakpoints.

## Git workflow

The operator requires each completed task to be committed and pushed separately to `origin/master`.

- Do not create a branch.
- After every gate passes, commit only the four source/Sass files, this corrected plan, and `plans/README.md` with `perf(web): prioritize and reserve hero screenshots`.
- Never use `git add .` or `git add -A`. Use the harness selective-commit tool when available; otherwise stage those six exact paths.
- Push with `git push origin master`.
- Confirm `git status --short` still shows the pre-existing brand deletion and untracked video, and that neither entered the commit.

## Steps

### Step 1: Add intrinsic dimensions and loading hints

In `web/src/pages/Home/Home.jsx:51`, change only the hero image to:

```jsx
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

In `web/src/pages/Home/components/Features/Features.jsx:18` and `:32`, change the two images to:

```jsx
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

Do not add placeholders, skeleton elements, JavaScript observers, or new components.

**Verify**: `rg -n 'width="(1873|1905|2400)"|loading="(eager|lazy)"|fetchPriority="(high|low)"|decoding="async"' web/src/pages/Home/Home.jsx web/src/pages/Home/components/Features/Features.jsx` → all three images have the exact dimensions and expected loading/priority/decoding attributes.

### Step 2: Preserve fluid image heights in CSS

In `web/src/pages/Home/styles.sass`, add `height: auto` directly after `width: 100%` inside `.interface-preview img`.

In `web/src/pages/Home/components/Features/styles.sass`, add `height: auto` directly after `width: 100%` inside `.feature-image img`.

This is required: HTML `height` attributes otherwise become presentational hints and would force a fixed height despite the existing fluid width.

**Verify**: `rg -n -A3 '^  img$' web/src/pages/Home/styles.sass web/src/pages/Home/components/Features/styles.sass` → both blocks contain `width: 100%` followed by `height: auto`; all other declarations remain unchanged.

### Step 3: Build and check attributes and intrinsic sizes

**Verify**: `cd web && bun run build` → exit 0. The build may repeat the known `__dirname` and Sass `lighten()` warnings. It must not add a second JavaScript entry or fail resolution.

Start the preview, open `http://127.0.0.1:4173/`, and scroll both feature images into view. Before recording final intrinsic sizes or post-load layout, wait until the hero and both feature images satisfy `img.complete && img.naturalWidth > 0`. Attributes may be inspected before load; zero natural dimensions before lazy loading is triggered are expected.

Run this in the browser console:

```js
[...document.images].map((image) => ({
  alt: image.alt,
  attributeWidth: image.getAttribute("width"),
  attributeHeight: image.getAttribute("height"),
  loading: image.loading,
  fetchPriority: image.fetchPriority,
  decoding: image.decoding,
  clientWidth: image.clientWidth,
  clientHeight: image.clientHeight,
  naturalWidth: image.naturalWidth,
  naturalHeight: image.naturalHeight,
  ratioDelta: image.naturalWidth
    ? Math.abs(image.clientWidth / image.clientHeight - image.naturalWidth / image.naturalHeight)
    : null
}))
```

Expected: five image elements (the logo appears twice); the hero has HTML attributes `1873` and `896` and is eager/high/async; the feature images have HTML attributes `1905`/`998` and `2400`/`1350` and are lazy/low/async. After the load wait, their `naturalWidth`/`naturalHeight` values match those dimensions and every screenshot `ratioDelta` is below 0.01. Use the untransformed `clientWidth`/`clientHeight` box for this ratio check because the hero has a 3D CSS transform.

### Step 4: Check layout reservation and priority

At both 390x844 and 1440x900, block image transfers before response (pause image requests rather than failing them) and reload. Scroll both feature blocks into view while the requests remain paused so native lazy loading is triggered. Before unblocking, record each screenshot's `getBoundingClientRect()` width and height and the document positions of later sections.

Unblock the image requests, wait until all three screenshots satisfy `img.complete && img.naturalWidth > 0`, and record the same values again.

**Verify**: each screenshot's reserved width/height matches its final width/height within 1 CSS pixel; later sections do not jump when the image arrives. Use `getBoundingClientRect()` only for this blocked-versus-loaded geometry comparison, including the transformed hero. In the Network panel, the hero request has priority **High** and each feature request has priority **Low** once requested. Native lazy loading may still request near-viewport images early on slow connections; that is expected and is not a failure.

**Verify**: both feature images finish loading and retain their current alt text and borders. No console errors appear.

## Test plan

No unit-test framework exists. Use the build and browser assertions in steps 3-4 as the regression check:

- Exact dimensions prevent distorted or fixed-height images.
- Blocked-image layout comparison proves space is reserved before transfer.
- Desktop 1440x900 and mobile 390x844 prove responsive sizing remains fluid.
- Scrolling proves lazy images still appear.
- Existing navigation, links, transforms, borders, and alt text remain unchanged.

## Done criteria

ALL must hold:

- [ ] `cd web && bun run build` exits 0.
- [ ] The source assertions in steps 1-2 pass.
- [ ] Browser DOM assertions in step 3 pass.
- [ ] Blocked-image layout comparison in step 4 passes at 390x844 and 1440x900.
- [ ] Both feature images load when scrolled into view; no console errors.
- [ ] `git status --short` contains no changes outside the four source/Sass files, this plan, and `plans/README.md`, except the preserved brand changes.
- [ ] `plans/README.md` status row is `DONE`.
- [ ] The scoped commit is pushed to `origin/master`; the commit contains no `brand/` path.

## STOP conditions

Stop and report if:

- The current image markup or Sass differs from the excerpts.
- Adding dimensions changes the rendered aspect ratio after `height: auto` is applied.
- The build fails for a reason other than the known warning baseline.
- Correct behavior appears to require a new component, dependency, JavaScript loading logic, or an out-of-scope file.
- The selective commit would include `brand/launch.mp4` or `brand/pixies.mp4`.

## Maintenance notes

- Plan 002 wraps these same images in `<picture>` elements. Keep the dimensions and loading hints on the fallback `<img>`.
- If a screenshot's intrinsic dimensions change, update its width/height attributes and regenerate plan 002's variants.
- Review mobile and desktop screenshots after future CSS changes to the hero or feature grid; incorrect `sizes` values in plan 002 depend on these breakpoints.
- Native lazy-loading distance thresholds vary by browser and connection. Do not replace this simple implementation with an observer unless measured evidence shows a remaining problem.
