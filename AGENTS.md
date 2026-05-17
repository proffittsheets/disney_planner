# AGENTS.md

## Project overview

A zero-dependency, single-page static web app for planning a Disney World trip — 2 adults, 1 child (almost 4), 1 grandparent, flying from Atlanta, targeting 2029. The app runs directly from `index.html` with no build step, no npm, no framework.

## File structure

```
index.html                  — HTML skeleton, page layout, tab/navigation structure
styles.css                  — All styling; uses CSS custom properties (--bi, --t, --bg2, etc.) and dark mode
js/
  hotels.js                 — Hotel data arrays (hotels.deluxe, hotels.assoc), hotelSvgs, hotelDetails
  parks.js                  — Per-park data: rides, snacks, restaurants, shops, day plans, festival schedules
  budget.js                 — Budget line items (fi array), fireworksDNs, eveningDNs, resortRests
  app.js                    — All global state, every render function, and event handlers
images/                     — Local WebP copies of CC-licensed photos (max 1400px)
terraform/                  — AWS infrastructure: S3 + CloudFront; see terraform/README.md
```

## Architecture

**No modules, no imports.** All JS files are loaded as plain `<script>` tags. Variables in `hotels.js`, `parks.js`, and `budget.js` are globals that `app.js` reads directly.

**State lives in `app.js` top-level vars:** `sel` (selected hotel key), `season`, `nights`, `clubLevel`, `travelMode`, `activeFireworks`, `activeEvening`, `wantMemMaker`, `wantStroller`, `wantBands`, `tripDate`, `inflRate`, `inflYears`, `tripMult`.

**Rendering is always a full re-render.** The single `render()` function calls all five sub-renders (`renderHotels`, `renderBudget`, `renderParkNav`, `renderResortRests`, `renderTimeline`). There is no diffing or partial update.

**Pages are hidden/shown via CSS `.active` class.** The main planner is `#pg-main`; each park gets `#pg-{id}`; each hotel gets `#pg-hotel-{key}`. Only one page has `active` at a time.

**`gi(id)`** is the project-wide shorthand for `document.getElementById(id)`.

**`p(n)`** applies inflation multiplier: `Math.round(n * tripMult)`. Always use this when displaying prices.

**`fmt(n)`** formats a dollar amount, returning `'Free'` for 0 or `'$X,XXX'` otherwise.

## Data conventions

- Hotel keys (e.g. `'beachclub'`, `'grandfloridian'`) are the join key between `hotels.deluxe`/`hotels.assoc`, `hotelSvgs`, and `hotelDetails`.
- Budget line items (`fi` array in `budget.js`) each have: `bk` (category bucket), `label`, `note`, `color`, `off` (off-peak price), `peak`, and optional boolean flags (`isFly`, `isDrive`, `isMemMaker`, `isStroller`, `isBand`).
- Park objects (in `parks.js`) each have: `id`, `name`, `tag`, `hbg`, `htxt`, `img`, `age`, `pills`, `rAll` (rides), `snacks`, `rests`, `shops`, `day`, `night`, `coming` (optional), `festivals` (EPCOT only), `maps` (optional).

## Running locally

Open `index.html` directly in a browser — no server needed.

## Deployment

Infrastructure is Terraform-managed (S3 + CloudFront). Deploy site files with:

```bash
cd terraform
./deploy.sh
```

The script reads bucket name and CloudFront distribution ID from Terraform outputs. See [terraform/README.md](terraform/README.md) for first-time setup.

Never commit `backend.hcl`, `*.tfvars`, `.terraform/`, or `*.tfstate*` — these are gitignored and contain account-specific values.

## Style conventions

- CSS variables throughout — prefer existing vars (`--bi`, `--t`, `--t2`, `--t3`, `--ti`, `--bg2`, `--bgs`, `--ts`, etc.) over hardcoded colors.
- Inline styles are used heavily in JS-generated HTML — this is intentional and consistent with the existing pattern; don't extract to classes unless a pattern repeats many times.
- All money values displayed to the user must go through `fmt(p(value))` so inflation multipliers apply.
- No TypeScript, no linting, no test suite. Correctness is verified by loading in a browser.

## Domain notes

- **Extended Evening Hours (EEH):** Only Disney-owned deluxe resorts qualify. Swan/Dolphin, Waldorf, and Four Seasons do not. The `eeh` boolean on hotel objects controls this.
- **Club level:** Some hotels have a `club` sub-object with `offExtra`/`peakExtra` per-night prices and `perks` text. The `clubLevel` global toggles it.
- **Inflation model:** Prices are stored in approximate 2026 dollars. `tripMult = (1+inflRate)^inflYears / (1+inflRate)^3` adjusts them. When `tripDate` is null, `inflYears` defaults to 3 (2029 baseline).
- **Booking timeline:** Calculated entirely from `tripDate` in `renderTimeline()`. Key windows: 60-day dining, 7-day Lightning Lane Multi Pass, packages in May/June of the year before travel.
