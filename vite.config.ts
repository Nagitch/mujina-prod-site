import process from 'node:process'
import adapterNode from '@sveltejs/adapter-node'
import adapterStatic from '@sveltejs/adapter-static'
import adapterVercel from '@sveltejs/adapter-vercel'
import { sveltekit } from '@sveltejs/kit/vite'
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte'

import tailwindcss from '@tailwindcss/vite'
import { mdsvex } from 'mdsvex'
import unoCSS from 'unocss/vite'
import { defineConfig } from 'vite'
import { imagetools } from 'vite-imagetools'

import mdsvexConfig from './mdsvex.config.js'
import { withPwa } from './scripts/pwa-adapter.ts'

import unoConfig from './uno.config.ts'

const adapters = {
  vercel: adapterVercel(),
  node: adapterNode(),
  static: adapterStatic({
    assets: 'build',
    fallback: undefined,
    pages: 'build',
  }),
}

const adapterName = process.env.ADAPTER?.toLowerCase()
if (adapterName && !Object.hasOwn(adapters, adapterName))
  throw new Error(`Unknown ADAPTER: ${adapterName}`)

export default defineConfig({
  envPrefix: 'URARA_',
  plugins: [
    tailwindcss(),
    unoCSS(unoConfig),
    imagetools(),
    sveltekit({
      extensions: ['.svelte', ...(mdsvexConfig.extensions ?? [])],
      preprocess: [mdsvex(mdsvexConfig), vitePreprocess()],
      paths: { relative: false },
      files: { serviceWorker: 'src/sw.ts' },
      serviceWorker: { register: false },
      adapter: withPwa(adapterName
        ? adapters[adapterName as keyof typeof adapters]
        : process.env.VERCEL ? adapters.vercel : adapters.static),
      csp: {
        directives: {
          'style-src': ['self', 'unsafe-inline', 'https://giscus.app'],
        },
        mode: 'auto',
      },
      prerender: { handleMissingId: 'warn' },
    }),
  ],
  // avoid vfx-js issue with vite https://github.com/fand/react-vfx/issues/72
  ssr: {
    noExternal: ['@vfx-js/core'],
  },
})
