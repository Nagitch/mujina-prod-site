import type { Adapter } from '@sveltejs/kit'
import { copyFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { injectManifest } from 'workbox-build'
import { offlineManifest } from './pwa-manifest.ts'

/** Inject after prerendering and worker compilation, before any adapter copies assets. */
export function withPwa(adapter: Adapter): Adapter {
  return {
    ...adapter,
    async adapt(builder) {
      const client = builder.getClientDirectory()
      const worker = join(client, 'service-worker.js')
      const { count, size, warnings } = await injectManifest({
        swSrc: worker,
        swDest: worker,
        globDirectory: dirname(client),
        globPatterns: ['client/**/*.{js,css,html,svg,ico,png,jpg,jpeg,webp,avif,webmanifest}', 'prerendered/**/*.{html,json,webmanifest}'],
        globIgnores: ['**/slides/**', '**/sw*', '**/service-worker*', '**/workbox-*'],
        dontCacheBustURLsMatching: /_app\/immutable\//,
        manifestTransforms: [offlineManifest],
      })
      for (const warning of warnings) builder.log.warn(warning)
      // Preserve the URL and scope of existing installations and update prompts.
      await copyFile(worker, join(client, 'sw.js'))
      builder.log.info(`PWA precache: ${count} files, ${size} bytes`)
      await adapter.adapt(builder)
    },
  }
}
