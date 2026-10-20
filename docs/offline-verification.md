# Offline behavior and verification

The worker is always registered at `/sw.js` with scope `/`. SvelteKit compiles `src/sw.ts` and Workbox injects the inventory selected by `scripts/pwa-manifest.ts`. See the [SvelteKit PWA integration](https://vite-pwa-org.netlify.app/frameworks/sveltekit) and [Workbox precaching lifecycle](https://developer.chrome.com/docs/workbox/modules/workbox-precaching).

## Storage and updates

- Store home, blog index, portfolio, public blog articles, offline guidance and their local styles/scripts/images. Never precache slides, unlisted/draft HTML, videos or external services.
- Each known route returns its own HTML. Unknown navigation tries the network; on failure it returns an explicit offline guide. Assets in that guide use root-relative URLs.
- Installation finishes before pages become available offline. Browser storage eviction remains possible; offline storage is not a backup.
- Updates wait until the reader chooses **更新して再読み込み**, or all existing tabs close. The button asks readers to close other site tabs first, so old tabs cannot lose their version's assets during activation. **あとで** dismisses the prompt; reopening the page shows a pending update again.
- Activation removes obsolete entries in this site's Workbox cache and the exact legacy `workbox-precache-v2-<registration scope>` cache. Unrelated caches are not deleted.
- The original auto-update worker has no prompt UI. During migration the replacement waits while that old page remains open; closing the old tabs permits normal activation. No unregister/reinstall or manual storage clearing is needed.
- YouTube is created only after clicking the local poster. VFX loads separately after a delay, is destroyed when the page is left/hidden, and is disabled with reduced motion. CSS and page transitions respect reduced motion as well.

## Reproducible checks

Run the standard checks in README, including `pnpm verify:build`. The build check validates the offline inventory, generated worker, asset paths, absence of an initial YouTube iframe, all article output and two-build source preservation. Unit tests exercise route selection, failed navigation, non-GET/external isolation, update consent and multiple-tab gating. These tests complement actual browser checks.

For a browser run, serve a static build on localhost, open home/blog/an article directly and reload. Stop the server and repeat; images and styles must remain available. Open an unknown path and a slide while disconnected: both should show offline guidance. Restore the server with a new build: keep two tabs open, verify the update notice and blocked application, close the other tab, apply, and verify the original article remains the current route. Inspect Application > Cache storage for removal of the old scoped cache. Use a separate local origin to reproduce first installation without changing production storage.

## Recorded results (2026-10-20)

- Node 24.22.0 / pnpm 10.34.7: 13 tests, type check, lint, installation-script policy, repeated static builds and Vercel output checks passed.
- Brave on macOS: migrated from the previous generated worker without clearing storage; new worker waited, then activated after the old tab closed. The cache inspector showed only `mujina-prod-site-precache-v2-http://127.0.0.1:4180/` for this local site.
- With the local server stopped: article direct reload retained its title/body and both generated benchmark images; home, blog and portfolio rendered; an excluded slide URL showed the offline guide with styles.
- A subsequent build produced an update notice in both tabs. Applying with two tabs showed the close-other-tabs message; applying after closing the other tab reloaded only the requested article and removed the notice.
- Keyboard: theme picker opens with Enter, closes with Escape and returns focus; mobile menu opens with Enter. Desktop and 390px mobile layouts inspected.
- Baseline (#52) offline inventory: 112 files / 5,185,834 uncompressed bytes. The new inventory is approximately 62 files / 1.5 MiB (exact bytes printed by `verify:build`); slides account for much of the reduction. Client JavaScript: 342,593 → 340,932 uncompressed bytes, with VFX moved to a deferred chunk. These are build payload/storage figures, not measured compressed network transfer or a Lighthouse score.
- Search is configuration-disabled on this site; its input/close-focus handling is maintained, but no external search submission is claimed.
- Desktop installation: Brave installed the local PWA and launched it in a separate app window while the server was stopped. The test-only application was subsequently uninstalled, retaining browser data.
- Brave reduced-motion emulation: no VFX canvas, scroll behavior auto, and effectively zero CSS transition duration. Restored the browser emulation afterward. A warm-worker network sample measured 61.4 kB transfer / 1,092 kB resources; this is not a cold first-load measurement. A later cold-cache observation is recorded below. Other engines and physical mobile devices remain unverified.

## Supplemental cold-cache observation

Brave DevTools Network, no throttling, HTTP cache disabled: clear only the test preview's Cache Storage/worker for the #52 baseline, then load home; for the updated #61 preview, use its previously unvisited origin. No video interaction was performed. Record the **total** counters (the value after the slash when the Fetch/XHR filter is selected), including worker installation/background requests:

| Preview | Transfer observed | Resources observed |
| --- | ---: | ---: |
| #52, before loading/offline changes | 11,047,049 bytes | 16,632,073 bytes |
| #61, after loading/offline/CSS changes | 1,741,122 bytes | 2,747,176 bytes |

The baseline continued transferring autoplay media and later reached 17,642,954 bytes, whereas the updated capture completed at 9.11 seconds with 109 requests. The new home had no iframe or YouTube script before clicking play. These are individual cold-cache browser observations, not a repeatable benchmark or a claimed percentage improvement: streaming duration, CDN conditions, browser protections and capture timing affect the totals. HTTP-cache disabling was restored afterward. Build inventory tests independently verify that slides are absent from precaching.
