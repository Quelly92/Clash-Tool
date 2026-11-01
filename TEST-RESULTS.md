# Validation — November 1, 2026

## Passed

- Node v24.19.0: **11/11 test groups passed**, including all six requested examples.
- Required results: `1d 13h 30m`, `2d 3h 30m`, `30m`, `24m`, `2h`, `1h 2m 30s`.
- Zero/empty time, zero potions, invalid characters/negative/decimal/exponent/unsafe inputs, maximum values, exact boost-expiration boundaries, completion during boosts and excess potions.
- Fractional-second precision: one minute with Research gives `2.5s` completion and `57.5s` saved.
- Playwright with installed Chromium: all six examples through actual UI, immediate updates, quantity buttons, clipboard, clear after invalid input, half seconds, huge values, remembered tab after reload and arrow-key tab switching.
- Viewports: 320×568, 375×667, 390×844, 430×932 and 844×390. No horizontal overflow. Default-content test needs no vertical scroll at 375×667, 390×844 or 430×932. Smaller/landscape screens and open installation help may scroll. All input/button/summary targets at least 44 CSS pixels tall.
- Offline: waited for service-worker activation, disabled the browser context's network, reloaded, calculated in both modes and navigated with a query string. All passed under `/potion-calculator/`, testing project-subdirectory relative paths.
- No JavaScript page errors and no external-origin requests in the browser run. 18,011 runtime bytes total including three custom PNG icons (before HTTP compression).
- Mobile screenshot visually inspected internally; screenshots are not included as deliverables.

The browser regression run exposed a reset-event timing bug and a compact-height overflow; both were corrected, and the complete browser suite subsequently passed. Node tests were rerun successfully on the final implementation.

## Remaining limitations

These were Chromium mobile emulation tests, not physical iPhone or native Safari tests. WebKit was not installed. Real Safari Home Screen installation, keyboard/safe-area behavior, and long-term iOS storage retention remain unverified. The app handles service-worker setup failure visibly, but cannot prevent OS cache eviction. Updates require closing old app windows.

## Publication status

Not published. The available GitHub connector lacks new-repository creation and Pages configuration tools. The remaining shell route reported an invalid GitHub credential via `gh auth status`; no repository creation or deployment was attempted. No denial was bypassed, credentials were not extracted, and existing projects were not modified. The ZIP is ready for a new public repository and GitHub Pages, using the README steps. Live HTTPS acceptance remains pending publication.
