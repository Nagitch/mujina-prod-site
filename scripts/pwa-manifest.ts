import type { ManifestTransform } from 'workbox-build'
import fs from 'node:fs/promises'

export function publicPages(posts: { path: string, flags?: string[] }[]) {
  return new Set(['/', '/blog/', '/portfolio/', '/offline/', ...posts.filter(post => !post.flags?.some(flag => ['unlisted', 'draft'].includes(flag))).map(post => `${post.path.replace(/\/+$/, '')}/`)])
}

export function outputUrl(file: string) {
  const url = file.replace(/^(?:client\/|prerendered\/(?:pages|dependencies)\/)/, '/')
  return url.endsWith('/index.html') ? url.slice(0, -10) : url
}

/** Restrict offline storage to public pages and assets referenced by those pages. */
export const offlineManifest: ManifestTransform = async (entries) => {
  const root = '.svelte-kit/output/'
  const posts = JSON.parse(await fs.readFile(`${root}prerendered/dependencies/posts.json`, 'utf8'))
  const pages = publicPages(posts)
  const selected = entries.filter(entry => pages.has(outputUrl(entry.url)))
  const documents = await Promise.all(selected.map(entry => fs.readFile(root + entry.url, 'utf8')))
  // Compiled styles include the shared background; HTML includes transformed article images.
  const styles = entries.filter(entry => /^client\/_app\/.*\.css$/.test(entry.url))
  documents.push(...await Promise.all(styles.map(entry => fs.readFile(root + entry.url, 'utf8'))))
  const text = documents.join('\n')
  const manifest = entries.filter(({ url }) => {
    const path = outputUrl(url)
    if (path.startsWith('/slides/') || path.includes('/sw.js') || path.includes('/workbox-'))
      return false
    if (pages.has(path) || path === '/posts.json' || path === '/manifest.webmanifest')
      return true
    if (/^\/_app\/immutable\/.*\.(?:js|css)$/.test(path))
      return true
    if (/\.(?:avif|webp|png|jpg|jpeg|svg|ico)$/.test(path)) {
      return text.includes(path) || text.includes(path.split('/').at(-1)!) || /^\/assets\/(?:any|maskable|favicon)/.test(path)
    }
    return false
  }).map(entry => ({ ...entry, url: outputUrl(entry.url) }))
  if (!manifest.some(entry => entry.url === '/offline/'))
    throw new Error('Missing offline fallback')
  return { manifest, warnings: [] }
}
