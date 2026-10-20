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

The earlier refresh reduced 123 audit findings to the four addressed above. It moved Svelte 4 to 5.57.2, Vite 5 to 7.3.7, the Svelte Vite plugin to 6, mdsvex to 0.12.8, and svelte-check to 4.7.7. Keep SvelteKit 2.70.3, TypeScript 5.9.3 and compatible adapters: the PWA integration's peer contract supports Kit 1/2. Kit 3/Vite 8 requires a separate compatibility review.

Server-side article rendering uses `svelte/server` in `$lib/server/posts.ts`; browser helpers must not import compiled articles or server rendering. Shiki 4.5 handles standard language fences; unused Twoslash/fence metadata extensions were removed. Image tooling uses Sharp 0.35.5, `as=img` metadata and the `w` resize directive; build verification decodes generated AVIF images. Set-like frontmatter arrays are deduplicated after remark-fff 1.x.

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
