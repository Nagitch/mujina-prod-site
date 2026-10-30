# Dependency advisory maintenance

## 2026-10-20 migration (#56)

Baseline: Tailwind 3.4.19, daisyUI 4.12.24, typography 0.5.20. The full pnpm audit reported **4 findings**: braces 3.0.3 (high), selector-parser 6.0.10 and 6.1.5 (moderate), KaTeX 0.16.47 (low).

| Path | Resolution |
| --- | --- |
| Tailwind → chokidar / fast-glob → braces | Upgrade Tailwind to 4.3.3; old watcher/glob dependencies disappear |
| Tailwind → postcss-nested → selector-parser 6.1.5 | Removed with Tailwind 3 |
| typography 0.5.20 → selector-parser 6.0.10 | Parent-scoped override to 7.1.6 |
| Antfu → ESLint Markdown → micromark-extension-math → KaTeX 0.16.47 | Parent-scoped override to 0.18.2 |

The overrides in `pnpm-workspace.yaml` target only those two parent relationships. Remove each override when its parent accepts a patched version, and rerun its compatibility tests. No audit finding is ignored.

Use Tailwind's Vite integration and daisyUI 5.7.50. `src/app.css` contains the theme/plugins and scans only `src/`, including generated public article modules. The `.css` extension is intentional: the Vite plugin must compile its directives. The former `.pcss` entry could otherwise pass the build while leaving raw directives in the browser. The build regression test rejects uncompiled directives.

The custom MUJINA palette retains its previous OKLCH values, now in named daisyUI 5 variables. Existing theme choices remain available; custom colors are scoped so switching themes works. Typography colors, checklists, code panels, container widths, rounded controls and mobile table scrolling have explicit compatibility coverage. Portfolio table markup is adjusted only for scrolling/accessibility; its factual text is unchanged.

Browser baseline follows the [Tailwind upgrade guide](https://tailwindcss.com/docs/upgrade-guide): Safari 16.4+, Chrome 111+, Firefox 128+. Component changes follow the [daisyUI upgrade guide](https://daisyui.com/docs/upgrade/).

## Verification

- `tests/fixtures/typography-selectors.json` records results from the pre-upgrade selector-parser 6.0.10 through typography's actual transformation helper. The test compares pseudo-elements, selector lists, attributes, `:is`, `:has` and `:where` after upgrading.
- Math compatibility tests use the actual Markdown dependency path: patched KaTeX through micromark's inline/display renderer, invalid TeX handling, unsafe-link rejection, and ESLint Markdown parsing with a positive lint-error control.
- `verify-styles.mjs` parses generated CSS, rejects uncompiled directives, checks all 13 themes and article/table/code rules, and rejects obsolete color variable references.
- Post-upgrade full audit: **0 findings**; `pnpm why braces` has no dependency path; selector-parser resolves only to 7.1.6; math rendering resolves to KaTeX 0.18.2.
- Brave/macOS: all 13 themes were selected through the UI and their applied base/text colors inspected. Desktop home retained its original palette/layout. Article code remains highlighted and horizontally scrollable; images loaded. Mobile 390px article and portfolio views inspected with dark/light themes. Physical mobile devices and other engines remain unverified.

Re-run `pnpm audit`, `pnpm test`, `pnpm check`, `pnpm lint`, `pnpm verify:install-policy` and `pnpm verify:build` after dependency changes. Review install-hook versions rather than expanding the allowlist indiscriminately.

## Retained compatibility decisions from #50

The earlier refresh reduced 123 audit findings to the four addressed above. It moved Svelte 4 to 5.57.2, Vite 5 to 7.3.7, the Svelte Vite plugin to 6, mdsvex to 0.12.8, and svelte-check to 4.7.7. That refresh retained SvelteKit 2.70.3 and TypeScript 5.9.3 because the former PWA integration supported only Kit 1/2. The Kit 3 migration below replaces that integration.

Server-side article rendering uses `svelte/server` in `#lib/server/posts.ts`; browser helpers must not import compiled articles or server rendering. Shiki 4.5 handles standard language fences; unused Twoslash/fence metadata extensions were removed. Image tooling uses Sharp 0.35.5, `as=img` metadata and the `w` resize directive; build verification decodes generated AVIF images. Set-like frontmatter arrays are deduplicated after remark-fff 1.x.

ESLint 10 and the Antfu preset retain supported Svelte legacy props and the project's existing module conventions. Unused dependencies and automatic/Netlify adapters were removed. Vercel uses its explicit adapter; static and documented Node output remain supported. Historical Netlify configuration is not an actively supported deployment target. Node 24 and pnpm 10.34.7 remain pinned, with install hooks restricted by `pnpm-workspace.yaml`.

Existing overrides remain deliberate: Sharp selects patched native codecs; `cookie@<0.7.0` selects the compatible 0.7 line (this site has no application authentication handlers); `tsx@<4.20.0` removes the optional path to old esbuild. Remove overrides when upstream constraints supply equivalent fixes. Full dependency audits include build/lint tools; `audit --prod` alone is not evidence that server output is free of advisories.

## GitHub Actions refresh (#59–#61)

Merged separately after rebasing each PR on the latest main and checking fresh
CI and its exact-commit Vercel preview. `actions/setup-node` 7.1.0 and
`actions/checkout` 7.0.1 use Node 24; checkout documents runner 2.327.1 or newer,
satisfied by the successful GitHub-hosted `ubuntu-latest` runs. The updated
`pnpm/action-setup` v4 commit still runs on Node 20 internally while installing
the project's pinned pnpm 10.34.7; it does not select the application Node
version. Full SHA pins, `contents: read`, and `persist-credentials: false` remain
in place. Final full pnpm audit and GitHub open Dependabot alert inventory both
reported zero findings on 2026-10-20.

## SvelteKit 3 migration (#71 / #72)

The original #72 preview at `5bccb14` failed while importing `parseSync` from Vite 7.3.7. The original #71 preview at `2f0ba57` failed with TS5107 because `moduleResolution: Node` selects deprecated Node10 resolution. Both failures were confirmed in Vercel build logs; they are preview failures, not evidence of a production outage.

Use Kit 3.0.0, TypeScript 6.0.3 (the same update as #71), Vite >=8.0.12, the Svelte Vite plugin 7, and Kit 3 adapters (Node 6, static 4, Vercel 7). Node 24 and Svelte 5.57.2 already satisfy the [official migration requirements](https://svelte.dev/docs/kit/migrating-to-sveltekit-3). Regenerate `pnpm-lock.yaml` with pnpm 10.34.7 rather than combining the competing #71/#72 lockfile patches. If this combined migration is merged, #71 and #72 are superseded; neither is closed by this change.

Configuration now lives in `sveltekit({...})` in `vite.config.ts`, with former `kit` options flattened. The mdsvex pipeline, root-relative paths, CSP, prerender warning policy, and adapter selection (`ADAPTER` first, then Vercel detection, otherwise static) are retained. Native `#lib/*` package imports have explicit extensions. `$app/env` replaces `$app/environment`, and `$app/state` replaces removed stores; the legacy blog filter bridges `page.url` with Svelte's `toStore` so query changes stay reactive. Navigation options use Kit 3's `replace` and `reset` names.

The app extends `$app/tsconfig`, includes `$app/types`, and checks its worker in a separate project. The Node CLI uses Bundler resolution and explicitly includes Node types; `strict: false` preserves its pre-TypeScript-6 default, while the application retains `strict: true`.

`@vite-pwa/sveltekit` 1.1.0 neither declares Kit 3 support nor generates `/sw.js` under Kit 3's environment build pipeline. It and `vite-plugin-pwa` are replaced by a small adapter wrapper: Kit compiles the worker, Workbox injects the existing `offlineManifest` after prerendering and before the selected adapter copies assets. `/sw.js`, scope `/`, manual registration, public-page-only caching, update consent, multi-tab protection and exact legacy-cache cleanup are preserved. Registration specifies `type: module` for Kit 3's module worker. A successful Vite build alone is not sufficient evidence that the PWA output exists.

Validation commands (Node 24, pnpm 10.34.7):

```sh
corepack pnpm install --frozen-lockfile
corepack pnpm verify:install-policy
corepack pnpm test
corepack pnpm urara:build
corepack pnpm check
corepack pnpm clean
corepack pnpm lint
corepack pnpm verify:build
ADAPTER=node corepack pnpm build
VERCEL=1 corepack pnpm build
```

The initial local run of `verify:build` rejected `src/static/assets/any@180.png` as unowned during its second build. Review on 2026-10-31 used a fresh checkout of `3856c4c`, Node 24.22.1 and pnpm 10.34.7: the complete `verify:build` command passed both static builds, tracked-source preservation and Vercel output checks. The earlier failure was not reproduced; its cause was not established, and no ownership safeguards were weakened.

The same checkout passed frozen installation, install-hook policy checks, all 17 tests, app/worker type checks and lint. Output checks passed public routes, XML/feed identity, SSR article HTML, Shiki, AVIF decoding, the 58-file offline inventory and all 13 theme CSS assertions. A separate Node-adapter build served home, blog, portfolio, an article, `/sw.js`, `/manifest.webmanifest`, `/offline/`, both feeds and sitemap with HTTP 200. Vercel Build Output v3 and Node 24 functions passed the build verifier.

Chromium on macOS verified the blog tag filter (6 posts to 1 Rust post and back), offline article reload with both article images, home/blog/portfolio offline navigation, unknown/slide URL fallback, waiting updates, multi-tab blocking and consent-based reload retaining the article URL. No browser runtime errors were recorded. A separate context also migrated the existing Kit 2 classic worker to Kit 3 without clearing storage, retaining the article and unrelated cache while removing the exact legacy cache. These checks used isolated localhost origins; see [offline verification](offline-verification.md) for scope.

The [Validate run for `3856c4c`](https://github.com/Nagitch/mujina-prod-site/actions/runs/41146355492) succeeded. Its [Vercel preview](https://mujina-prod-site-inarz2uk9-mujina-prod.vercel.app) was READY for that exact SHA, and a direct article request returned HTTP 200. Subsequent commits still require their own CI and preview checks. Kit continues to warn that UnoCSS uses unsupported `transformIndexHtml` hooks; generated-style assertions passed. Other browser engines and physical mobile devices remain unverified.
