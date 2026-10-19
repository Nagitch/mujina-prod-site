# MUJINA personal site

Status: active

Personal homepage, portfolio and blog at https://www.mujina-prod.com, based on
Urara. The independent repository is `Nagitch/mujina-prod-site`; the workbench
only pins its commit as a submodule.

## Development and verification

Use Node **24.x** (`nvm install && nvm use`) and **pnpm 9.10.0**, declared in
`package.json`. Install that exact pnpm version if Corepack is unavailable.

```sh
pnpm install --frozen-lockfile
pnpm dev
```

Author Markdown, images and slides under `urara/`; authored Svelte routes remain
under `src/routes/`. Generated files are recorded in `.urara-generated.json`.
Cleanup removes only those files and refuses to overwrite or remove unowned or
locally modified output. Do not commit the manifest or generated directories.
If an old checkout has generated files without a manifest, use a fresh checkout
or inspect and remove only those generated files before building.

```sh
pnpm tsc
pnpm test
pnpm urara:build
pnpm check
pnpm clean
pnpm lint
pnpm verify:build
pnpm preview
```

The regression suite covers cleanup ownership and watch shutdown. Build
verification runs two complete builds, checks all tracked file contents, and
checks core endpoints and every published post's generated route, then builds
Vercel output and verifies its Node 24 function runtime. PR and main
CI run the same commands. `pnpm build` logs the actual Node version.

## Deployment

Vercel project `mujina-prod-site` uses this child repository directly, with Node
24.x selected both in the project and `engines.node`. Its root is this repository
root, not the parent workbench. Verify the preview for the exact PR commit before
merging and inspect the resulting production deployment and core routes.

The existing GitHub Pages publisher is retained with an explicit Node 24 input
and a pinned reusable workflow. Deployment consolidation, dependency upgrades,
SEO and PWA improvements are tracked separately in the maintenance issues.

See [dependency maintenance](docs/dependency-maintenance.md) for the updated
framework groups, compatibility decisions, remaining audit findings and checks.

## Upstream Urara documentation and attribution

<br />
<div align="center">
<a href="https://github.com/importantimport/urara">
<img src="https://github.com/importantimport/urara/raw/main/urara/hello-world/urara.webp" alt="urara" /></a>
</div>
<br />

<p align="center">
<a href="https://fff.js.org"><img src="https://img.shields.io/badge/%F0%9F%8C%9F%20F%20F%20F-1.2-yellow?style=flat" alt="fff" /></a>
<img src="https://img.shields.io/github/languages/top/importantimport/urara?color=%23ff3e00" alt="Language" />
<a href="https://github.com/importantimport/urara/blob/main/COPYING"><img src="https://img.shields.io/github/license/importantimport/urara?color=%23fff" alt="License" /></a>
<img src="https://app.fossa.com/api/projects/git%2Bgithub.com%2Fimportantimport%2Furara.svg?type=shield" alt="FOSSA Status" />
</p>
<p align="center">
<a href="https://urara-demo.netlify.app">🚀 Demo</a>
/
<a href="https://urara-docs.netlify.app">📝 Documentation</a>
/
<a href="https://github.com/importantimport/urara/discussions">💬 Discussions</a>
</p>
<p align="center">
<span>English</span>
|
<a href="https://github.com/importantimport/urara/blob/main/README.zh.md">正體中文</a>
</p>

## 🎉 Try it now!

### Local

```bash
npx degit importantimport/urara my-blog && cd my-blog # create a new project in my-blog
pnpm i # if u don't have pnpm installed, run: npm i -g pnpm
```

### Remote

[![Open in StackBlitz](https://img.shields.io/badge/-Open%20in%20StackBlitz-1374ef?style=for-the-badge&logo=Amp)](https://stackblitz.com/github/importantimport/urara) [![Use this template](https://img.shields.io/badge/-Use%20this%20Template-181717?style=for-the-badge&logo=GitHub)](https://github.com/importantimport/urara/generate) [![Deploy with Vercel](https://img.shields.io/badge/-Deploy%20with%20Vercel-1374ef?style=for-the-badge&logo=Vercel)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fimportantimport%2Furara&env=URARA_SITE_URL&envDescription=Site%20URL.&envLink=https%3A%2F%2Fexample.com&project-name=urara-blog&repository-name=urara-blog) [![Deploy to Netlify](https://img.shields.io/badge/-Deploy%20to%20Netlify-15847d?style=for-the-badge&logo=Netlify&logoColor=white)](https://app.netlify.com/start/deploy?repository=https%3A%2F%2Fgithub.com%2Fimportantimport%2Furara#URARA_SITE_URL=https://example.com&CUSTOM_LOGO=https://github.com/importantimport/urara/raw/main/urara/assets/any@512.png)

## ⚡️ Usage

### Developing

Start a development server:

```bash
pnpm dev
```

### Building

Create a production version of ur blog:

```bash
pnpm build
```

u can preview the built app with `pnpm preview`.

### Documentation

For full documentation, visit [urara-docs.netlify.app](https://urara-docs.netlify.app).

### Give this project a star

tyvm! ur ⭐ will give me more motivation to improve this project.

## ✨ Features

- Out of the box **Atom feed** (WebSub), **Sitemap**, **PWA** (Web app manifest & ServiceWorker) support.
- Present beautiful interface designs and animations with daisyUI, of course.
- Good [IndieWeb](https://indieweb.org/) Compatibility - Multi-kind posts with [microformats2](https://microformats.org/) markup content, Showcasing [Webmentions](https://indieweb.org/Webmention) via [webmentions.io](https://webmentions.io) API.
- Don't worry about the article and image directories - just put them under a folder and they'll be [copied automatically at build time](https://github.com/importantimport/urara/blob/main/urara.ts).
- [Comment Components](https://github.com/importantimport/urara/tree/main/src/lib/components/comments): Webmentions, Giscus, Utterances... u can use more than one.

## 📦️ Pre-packed

### TailwindCSS & PostCSS Plugins

- [daisyUI](https://github.com/saadeghi/daisyui) - The most popular, free and open-source Tailwind CSS component library.
- [Tailwind CSS Typography](https://github.com/tailwindlabs/tailwindcss-typography) - Beautiful typographic defaults for HTML you don't control.
- [Autoprefixer](https://github.com/postcss/autoprefixer) - Parse CSS and add vendor prefixes to rules by Can I Use.
- [CSSNANO](https://github.com/cssnano/cssnano) - A modular minifier, built on top of the PostCSS ecosystem.

### Markdown preprocessor & Syntax highlighter

- [MDsveX](https://github.com/pngwn/MDsveX) - A markdown preprocessor for Svelte.
- [Shiki Twoslash](https://github.com/shikijs/twoslash) - A beautiful Syntax Highlighter.

### Vite Plugins

- [UnoCSS](https://github.com/unocss/unocss) - The instant on-demand atomic CSS engine.
- [VitePWA](https://github.com/antfu/vite-plugin-pwa) - Zero-config PWA for Vite.

## 🚀 Sites

- [./kwaa.dev](https://kwaa.dev) - [kwaa/blog](https://github.com/kwaa/blog)
- [Seviche.cc](https://seviche.cc) - [Sevichecc/Urara-Blog](https://github.com/Sevichecc/Urara-Blog)
- [./khatta.sh](https://blog.shameerkashif.me) - [hash3liZer/khatta](https://github.com/hash3liZer/khatta)

and more...

- [urara-blog - Discussions](https://github.com/importantimport/urara/discussions/2)
- [urara-blog - Topics](https://github.com/topics/urara-blog)

are u using Urara? add the `urara-blog` topic on ur repo!

## 👥 Contributing

If u're interested in contributing to Urara, pls read [contributing docs](.github/CONTRIBUTING.md) before submitting a pull request.

## 📝 License

This work is free, it comes without any warranty. You can redistribute it and/or modify it under the
terms of the Do What The Fuck You Want To Public License, Version 2,
as published by Sam Hocevar. See the [COPYING](https://github.com/importantimport/urara/blob/main/COPYING) file for more details.

[![FOSSA Status](https://app.fossa.com/api/projects/git%2Bgithub.com%2Fimportantimport%2Furara.svg?type=large)](https://app.fossa.com/projects/git%2Bgithub.com%2Fimportantimport%2Furara?ref=badge_large)

special thanks / inspired from:

- [@michaeloliverx - Generate Posts List](https://github.com/pngwn/MDsveX/issues/294#issuecomment-907029639)
- icon made by [Kpouri](https://github.com/kpouri)
