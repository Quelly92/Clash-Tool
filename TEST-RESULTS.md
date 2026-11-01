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

Published at [https://quelly92.github.io/Clash-Tool/](https://quelly92.github.io/Clash-Tool/). On November 1, 2026 at 20:23 UTC, publication of commit `180f1ed684b2e20c0e17d30a8cf0962d90134bcd` was independently verified: [Pages workflow 41346478133](https://github.com/Quelly92/Clash-Tool/actions/runs/41346478133) completed successfully for that exact commit, and the HTTPS root page plus all nine runtime assets returned HTTP 200 with correct content types and bytes identical to the tested package, including the manifest, service worker and all three PNG icons. The owner-created repository's original README was preserved, and package documentation is in `POTION-TIME.md`. No Pages settings or permissions were changed during upload. Physical iPhone/native Safari installation, offline retention and device behavior remain unverified; prior Chromium mobile-emulation evidence above is not a physical-device certification.
