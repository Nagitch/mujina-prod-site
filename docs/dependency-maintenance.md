# Dependency maintenance (2026-10-20)

This is the remediation record for #50, starting from `2eb9bea1`.

## Updated groups and compatibility decisions

- Svelte 4.2.10 → 5.57.2, Vite 5.1.1 → 7.3.7, Svelte Vite plugin 3 → 6,
  mdsvex 0.11 → 0.12.8, and svelte-check 3 → 4.7.7. Vite 7.3 receives
  important/security fixes according to <https://vite.dev/releases>.
- Keep SvelteKit 2.70.3: the current `@vite-pwa/sveltekit` peer contract supports
  Kit 1/2, not Kit 3. Keep TypeScript 5.9.3 and the compatible Kit 2 adapters.
  A Kit 3/Vite 8 migration is a separate compatibility change, not necessary to
  remove the unsupported Vite 5 line.
- Replace component `.render()` with `render` from `svelte/server`, isolated in
  `$lib/server/posts.ts`. Browser helpers no longer import server rendering or
  compiled articles. See <https://svelte.dev/docs/svelte/svelte-server>.
- Update PWA integration and Workbox together. Keep the cache policy unchanged;
  full offline/installability and cache-boundary work remains #53.
- Update vite-imagetools and Sharp 0.35.5 together. Use the new `as=img` metadata
  contract and `w` resize directive; resolve relative Markdown images against
  their post path. Verification checks the rendered AVIF source and its width.
- Replace the old shiki-twoslash dependency tree with Shiki 4.5.0. Existing code
  blocks use plain language fences (no Twoslash or fence metadata). Those unused
  extensions are no longer enabled; new articles should use standard fences.
- Update UnoCSS, PostCSS/Lightning CSS, Markdown plugins and icon data.
  Normalize set-like frontmatter arrays after remark-fff 1.x to avoid duplicate
  tags/flags. All current articles declare created/updated dates explicitly. Keep
  Tailwind 3.4.19/daisyUI 4.12.24 to preserve the existing theme/class contract.
  A Tailwind 4/daisyUI 5 design migration remains separate work.
- Update ESLint 10 and the Antfu preset; remove the redundant upstream preset
  tied to ESLint 9. Explicit configuration retains supported Svelte legacy props,
  unkeyed-list behavior, root-hosted URLs and Node ESM top-level await. All other
  enabled checks still run. New Svelte HTML diagnostics were repaired.
- Replace npm-run-all with npm-run-all2. Remove unused analytics, embed,
  preprocess, chalk, remark and fence-parser dependencies, plus adapter-auto and
  the unused Netlify adapter. Vercel uses its explicit adapter; static output and
  the documented Node adapter remain supported. `netlify.toml` is historical
  configuration, not an actively supported deployment target.
- Node remains 24.x. This refresh used pnpm 9.10.0; #51 subsequently pins
  pnpm 10.34.7 with an enforced install-script policy. `jiti` 2 is explicitly installed for
  ESLint's TypeScript configuration. The regenerated lockfile is reproducible.

## Overrides

- `sharp`: force 0.35.5 or newer across image tooling to obtain the native codec
  fixes; verified by decoding generated AVIF output.
- `cookie@<0.7.0`: select the compatible 0.7 line to remove Kit's old cookie
  serialization advisory. This site has no application auth/cookie handlers.
- `tsx@<4.20.0`: select a newer 4.x release to remove the optional tooling path
  to old esbuild. No esbuild dev-server endpoint is exposed in production.

Remove each override once upstream constraints provide the same fix.

## Audit and exposure

`pnpm audit --json` on 2026-10-20 (same pnpm version/registry):

| Lockfile | Critical | High | Moderate | Low | Total |
| --- | ---: | ---: | ---: | ---: | ---: |
| Before | 1 | 65 | 47 | 10 | 123 |
| After | 0 | 1 | 2 | 1 | 4 |

Counts are dependency findings, not demonstrated production exploits. The four
remaining findings represent three advisory IDs (two selector-parser versions).
No audit ignores or advisory suppressions are configured. Remaining remediation
is tracked in [#56](https://github.com/Nagitch/mujina-prod-site/issues/56).

| Remaining advisory | Dependency path and applicability | Follow-up |
| --- | --- | --- |
| [braces: recursive-pattern DoS](https://github.com/advisories/GHSA-vfj7-8cjw-p6xm), high | Tailwind/fast-glob/micromatch and build/lint tooling; parses repository glob patterns. No browser/request route accepts such patterns. Builds of untrusted repositories still have this risk. | No patched release was published at the audit date. Monitor upstream; do not invent a replacement version. |
| [postcss-selector-parser: CPU exhaustion](https://github.com/advisories/GHSA-rj75-hqrm-r3gf), moderate ×2 | Tailwind typography (6.0.10) and Tailwind (6.1.5) process repository CSS during builds. Not a production CSS parsing service. | Fixed in 7.1.6; migrate the Tailwind group or take an upstream-compatible update. Avoid forcing a major parser API under Tailwind 3. |
| [KaTeX: trust bypass after prototype pollution](https://github.com/advisories/GHSA-238p-pmpm-9mq7), low | ESLint Markdown math extension only. The website Markdown pipeline does not use KaTeX. The advisory additionally requires existing prototype pollution. | Fixed in 0.18.2; await a compatible Markdown lint dependency update. |

Browser exposure is primarily Svelte and the VFX effect; both are updated. Kit
and its fallback server output are updated/patched independently of their
`devDependencies` classification. Markdown, highlighting, Sharp, CSS generation,
PWA generation and lint are build-time tools. The unused Netlify/automatic
adapter dependency trees were removed. `pnpm audit --prod` alone is therefore
not treated as proof that deployed server output is free of advisories.

## Verification

Run the README validation commands. `verify:build` checks two complete static
builds, tracked-source preservation, all published routes, JSON feed bodies,
syntax highlighting, AVIF generation/decoding, and Node 24 Vercel output.
Browser smoke testing covers direct article entry, image loading, code blocks,
blog tag filtering, navigation, portfolio and the home-page VFX effect.
Remaining PWA/SEO/content requirements are tracked in #52–#54.
