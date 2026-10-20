import { sveltekit } from '@sveltejs/kit/vite'
import { SvelteKitPWA as pwa } from '@vite-pwa/sveltekit'
import LightningCSS from 'postcss-lightningcss'
import TailwindCSS from 'tailwindcss'
import unoCSS from 'unocss/vite'
import { defineConfig } from 'vite'
import { imagetools } from 'vite-imagetools'

import { offlineManifest } from './scripts/pwa-manifest'

import tailwindConfig from './tailwind.config'
import unoConfig from './uno.config'

export default defineConfig({
  css: {
    postcss: {
      plugins: [TailwindCSS(tailwindConfig), LightningCSS()],
    },
  },
  envPrefix: 'URARA_',
  plugins: [
    unoCSS(unoConfig),
    imagetools(),
    sveltekit(),
    pwa({
      manifest: false,
      strategies: 'injectManifest',
      srcDir: 'src',
      filename: 'sw.ts',
      injectRegister: false,
      registerType: 'prompt',
      scope: '/',
      kit: { trailingSlash: 'always' },
      injectManifest: {
        globPatterns: ['client/**/*.{js,css,html,svg,ico,png,jpg,jpeg,webp,avif,webmanifest}', 'prerendered/**/*.{html,json,webmanifest}'],
        globIgnores: ['**/slides/**', '**/sw*', '**/workbox-*'],
        manifestTransforms: [offlineManifest],
      },
    }),
  ],
  // avoid vfx-js issue with vite https://github.com/fand/react-vfx/issues/72
  ssr: {
    noExternal: ['@vfx-js/core'],
  },
})
