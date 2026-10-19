import process from 'node:process'
import adapterNode from '@sveltejs/adapter-node'
import adapterStatic from '@sveltejs/adapter-static'
import adapterVercel from '@sveltejs/adapter-vercel'
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte'
import { mdsvex } from 'mdsvex'

import mdsvexConfig from './mdsvex.config.js'

const adapter = {
  vercel: adapterVercel(),
  node: adapterNode(),
  static: adapterStatic({
    assets: 'build',
    fallback: undefined,
    pages: 'build',
  }),
}

/** @type {import("@sveltejs/kit").Config} */
export default {
  extensions: ['.svelte', ...(mdsvexConfig.extensions ?? [])],
  kit: {
    adapter:
      process.env.ADAPTER
        // @ts-expect-error adapter types
        ? adapter[process.env.ADAPTER.toLowerCase()]
        : process.env.VERCEL
          ? adapter.vercel
          : adapter.static,
    csp: {
      directives: {
        'style-src': ['self', 'unsafe-inline', 'https://giscus.app'],
      },
      mode: 'auto',
    },
    prerender: {
      handleMissingId: 'warn',
    },
  },
  preprocess: [mdsvex(mdsvexConfig), vitePreprocess()],
}
