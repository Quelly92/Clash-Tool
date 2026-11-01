# Potion Time

A tiny, dark, mobile-first Clash of Clans potion calculator. Vanilla HTML, CSS and JavaScript; no build, accounts, analytics, runtime packages or external network dependencies. All app assets and icons are included.

## Deploy to GitHub Pages

1. Create a **new public repository**, for example `potion-time`.
2. Upload the contents of this folder to its root, including `icons/`. `index.html` must be at the repository root, not inside another folder. Commit to `main`. Include `.nojekyll` when using Git; it is optional for this plain-file project if a browser upload omits it.
3. Open **Settings → Pages → Deploy from a branch**. Select **main**, **/(root)**, then Save.
4. Wait for the Pages deployment to finish. Open the HTTPS address shown in Pages settings. Verify both tabs, then wait for **Ready offline**, disconnect and reload.

No build command, package installation, custom domain or paid service is required. Relative paths support either a project subdirectory or a domain root. See [GitHub's publishing instructions](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site).

## Install on iPhone

Open the published HTTPS link in **Safari → Share → Add to Home Screen → Add**. Wait until the app says **Ready offline**, then use the Home Screen icon. Test once in airplane mode. Initial loading needs internet; iOS may clear website storage, in which case reopen online. Browser emulation cannot certify physical iPhone installation or Safari storage behavior.

## Use

Choose **Research / Pet** (24×) or **Builder** (10×). Enter remaining days, hours and minutes; adjust potion count with the −/+ buttons or its numeric field. Results update immediately. Clear empties the time fields and restores one potion, retaining the selected tab. Copy includes the potion type/count, completion duration from now and time saved. Only the last tab is remembered locally, when storage permits. No upgrade data is sent anywhere. Results are durations, not a running countdown or calendar finish timestamp.

Hours and minutes may exceed 23/59, so entering `25` hours works directly. Blank fields mean zero, including potion count. Each field accepts whole numbers from 0 through 1,000,000; signs, decimals, exponent notation, and larger values show an error instead of a misleading result. That bound keeps integer second calculations safe even for extreme durations. Research can finish on a half-second; the display preserves that precision.

## Mechanics and calculation

Official rules verified November 1, 2026: Research and Pet potions give 24× speed for one hour; Builder potions give 10× for one hour. Repeated potions extend duration at the same speed. Sources: [Supercell Support](https://support.supercell.com/clash-of-clans/en/articles/magic-items-and-the-trader.html) and its [readable official Support mirror](https://sc-clashofclans.zendesk.com/hc/en-us/articles/49529083243291-Magic-Items-The-Trader).

For original remaining seconds `T`, rate `R`, and potion count `N`, boost duration is `B = N × 3600`:

```js
completion = T <= R * B ? T / R : T - (R - 1) * B;
saved = T - completion;
```

This assumes uninterrupted normal boosts activated now, one upgrade, and a continuously working builder. Extra unused boost after completion is not assigned to another upgrade. No other modifiers, concurrent boosts or multi-upgrade scheduling are included. A Builder result is per builder, not a sum across the builder crew.

## Local development and tests

Serve the files with `python3 -m http.server 8000`, then open `http://localhost:8000`. Service workers need localhost or HTTPS; opening `index.html` as a local file is unsupported.

Run `npm test` (Node 18+; no npm install). This covers all six requested cases and zero, invalid, huge, boundary, partial-boost, stacking and invariant cases.

Optional browser regression runner: `TEST_URL=http://localhost:8000/ node tests/browser.cjs`. It requires Playwright available to Node and Chromium at `/usr/bin/chromium` (or set `CHROMIUM_PATH`). These are development tools only and are not loaded by the app. Browser checks include UI calculations, reset, copy, tab memory/keyboard, mobile layouts and offline use. See `TEST-RESULTS.md` for actual execution evidence.

## Maintenance

When modifying app assets, increment `VERSION` in `sw.js` and publish all changed files together. New caches install atomically; a failed download leaves the prior version intact. After a successful update, close all app/site windows and reopen to activate it. Cache cleanup only touches this app's scope, preserving other GitHub Pages apps on the same origin. There are no recurring computational or AI services.

Unofficial fan utility, not affiliated with or endorsed by Supercell. Icons are locally generated original artwork; no game assets are included.
