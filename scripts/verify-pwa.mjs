import assert from 'node:assert/strict'
import fs from 'node:fs/promises'
import { offlineManifest, publicPages } from './pwa-manifest.ts'

export async function verifyPwa(posts) {
  const files = await fs.readdir('.svelte-kit/output', { recursive: true })
  const entries = (await Promise.all(files.filter(file => /\.(?:html|json|webmanifest|js|css|svg|ico|avif|webp|png|jpg|jpeg)$/.test(file)).map(async url => ({ url, revision: 'test', size: (await fs.stat(`.svelte-kit/output/${url}`)).size })))).filter(entry => !entry.url.startsWith('server/'))
  const { manifest } = await offlineManifest(entries)
  const paths = manifest.map(entry => entry.url)
  for (const page of publicPages(posts)) assert(paths.includes(page), `Missing offline page ${page}`)
  assert(!paths.some(path => path.startsWith('/slides/') || /^https?:/.test(path)))
  const sw = await fs.readFile('build/sw.js', 'utf8')
  assert(!sw.includes('__WB_MANIFEST'))
  assert(!sw.includes('process.env'))
  assert(!sw.includes('/slides/'))
  const offline = await fs.readFile('build/offline/index.html', 'utf8')
  assert(!/(?:href|src)="\.\.\//.test(offline), 'Offline fallback must use root-relative assets')
  const home = await fs.readFile('build/index.html', 'utf8')
  assert(!home.includes('<iframe'))
  assert(!/https?:\/\/(?:www\.)?(?:youtube|i.ytimg)/.test(home))
  console.info(`Offline inventory: ${manifest.length} files, ${manifest.reduce((sum, entry) => sum + entry.size, 0)} bytes; slides/external requests excluded.`)
}
