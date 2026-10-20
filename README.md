# MUJINA personal site

Status: active

Homepage, portfolio and Japanese blog at <https://www.mujina-prod.com/>.
This independent repository is `Nagitch/mujina-prod-site`. The workbench records
its released commit as a submodule; it is not a build or deployment dependency.

## Setup

Use Node **24.x** (`nvm install && nvm use`) and **pnpm 10.34.7**, as declared in
`.nvmrc` and `package.json`. If necessary, install that pnpm version with
`npm install --global pnpm@10.34.7`. Then, from this repository:

```sh
pnpm install --frozen-lockfile
pnpm dev
```

The development server prints its local URL. No production credentials are
needed for local rendering or CI. Dependency install hooks are restricted by
`pnpm-workspace.yaml`; review unknown hooks instead of approving everything.
See [publishing and supply-chain operations](docs/publishing-security.md).

## Structure

| Location | Purpose |
| --- | --- |
| `urara/blog/<slug>/+page.svelte.md` | Authored articles and adjacent images |
| `urara/assets/`, `urara/favicon.png`, `urara/robots.txt` | Shared public assets |
| `urara/slides/<slug>/index.html` | Self-contained public slide exports and assets |
| `src/routes/` | Authored Svelte pages and feed/sitemap endpoints |
| `src/lib/config/` | Site, navigation, profile and feature configuration |
| `src/lib/components/`, `src/app.css` | Components, Tailwind/daisyUI themes and typography |
| `src/sw.ts`, `scripts/pwa-manifest.ts` | Worker and explicit offline inventory |
| `scripts/content-files.mjs`, `urara.ts` | Content copying and safe cleanup |
| `tests/`, `scripts/verify-*.mjs` | Regression and generated-output validation |

SvelteKit/Svelte render pages; mdsvex compiles articles, Shiki highlights standard
code fences, and vite-imagetools/Sharp generate article images. Vercel is the
production publisher; static output is also built for local validation.
Node adapter output can be tested with `pnpm start`.

## Write an article

Create `urara/blog/<stable-slug>/+page.svelte.md`, using an existing article as a
reference. Set dates explicitly; the slug is part of the public URL and feed
identity, so avoid renaming published articles without a migration plan.

```md
---
title: 'Article title'
created: 2026-10-20
updated: 2026-10-20
tags:
  - 'Example'
---

## First section

Article text.

![Descriptive alternative text](./example.png)
```

Headings create the table of contents. Use standard fenced code blocks with a
language name; the removed Twoslash extensions are not supported. Put images
beside the article and use relative Markdown links. Check generated images,
code, tables and heading links in the preview at desktop and mobile widths.

Keep unfinished writing on a separate branch. `unlisted` removes an article
from listings, feeds, sitemap and offline selection, but its direct URL can
still be public. Flags and future dates are **not a privacy or publishing gate**:
content copied into a production build may be reachable. Do not merge drafts
into `main` before publication is intended. See [preserved drafts and content
review](docs/content-maintenance.md).

## Images and slides

Shared images belong in `urara/assets/`; article images belong beside their
Markdown. Preserve meaningful alternative text and verify resized AVIF output.
For slides, place an HTML export plus its required relative assets under
`urara/slides/<slug>/`. Verify `/slides/<slug>/` directly and add an intentional
public link where appropriate. Public slide entry points are included in the
sitemap. Slides, external media and YouTube are excluded from offline storage.

## Generated files and recovery

Edit `urara/` or authored Svelte sources, not generated Markdown copies in
`src/routes/`, generated images in `src/static/`, or generated `static/` files.
`.urara-generated.json` records ownership and content hashes. `pnpm clean`
removes only recorded, unchanged generated files and refuses to overwrite or
remove unowned or locally modified output. Never delete source directories as
a cleanup shortcut.

If interrupted generation leaves an ownership conflict, preserve the affected
file and compare it to its source before removing only verified generated
copies. For an old checkout without a manifest, use a fresh checkout as the
safest recovery. Generated output, dependency directories and local settings
are ignored and must not be committed.

## Validation

```sh
pnpm verify:install-policy
pnpm tsc
pnpm test
pnpm urara:build
pnpm check
pnpm clean
pnpm lint
pnpm verify:build
pnpm preview
```

CI performs a frozen install and these checks. `verify:build` runs two static
builds with tracked-source fingerprints, validates every public article/feed,
XML/canonical URLs and stable feed IDs, decodes AVIF images, checks offline
inventory and generated CSS, and verifies Node 24 Vercel output. It leaves the
static `build/` available for preview. `pnpm build` runs one normal build.

Browser checks include direct article reload, all themes, keyboard navigation,
mobile tables/code, reduced motion and click-to-play video. Follow the actual
migration, offline, update and desktop-install checklist in
[offline verification](docs/offline-verification.md). Other engines/physical
mobile devices are not considered tested merely because unit tests pass.

## Publish and roll back

1. Open a PR against `main`; verify the latest commit's Validate job and Vercel
   preview, including primary routes and relevant browser behavior.
2. Merge only the verified commit. Confirm the resulting **production**
   deployment is READY for the merge SHA, with `www.mujina-prod.com` and the
   apex redirect assigned. Check home, blog, portfolio, a direct article,
   images, feeds, sitemap and worker.
3. Update only the `mujina-prod-site` gitlink in a separate workbench PR after
   production verification. Preserve unrelated workbench changes.

For an urgent rollback, promote the previous known-good deployment in the same
Vercel project, verify aliases/routes, then revert the responsible merge in a
validated PR and update the workbench reference. There is no database migration.
Detailed project identity, legacy targets, security settings and Search Console
limitations are recorded in [publishing operations](docs/publishing-security.md).

## Maintenance and attribution

- [Dependency decisions and audit evidence](docs/dependency-maintenance.md)
- [Offline behavior and verification](docs/offline-verification.md)
- [Draft preservation, links and deferred factual review](docs/content-maintenance.md)

Built on [Urara](https://github.com/importantimport/urara), originally authored
by 藍+85CD and contributors. Upstream attribution in the site footer and the
original [WTFPL license](COPYING) are retained. Site-specific maintenance is
managed in this repository; upstream documentation remains available in the
Urara repository.
