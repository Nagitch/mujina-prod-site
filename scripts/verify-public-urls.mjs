import assert from 'node:assert/strict'
import fs from 'node:fs/promises'
import { DOMParser } from '@xmldom/xmldom'
import { atomId, canonicalPage } from '../src/lib/utils/urls.ts'

export async function verifyPublicUrls(posts) {
  const parser = new DOMParser({ onError: level => assert.fail(`Invalid generated XML: ${level}`) })
  const sitemap = parser.parseFromString(await fs.readFile('build/sitemap.xml', 'utf8'), 'application/xml')
  assert.equal(sitemap.documentElement.namespaceURI, 'http://www.sitemaps.org/schemas/sitemap/0.9')
  const locations = Array.from(sitemap.getElementsByTagName('loc'), node => node.textContent)
  assert.equal(new Set(locations).size, locations.length)
  for (const path of ['/', '/blog/', '/portfolio/', ...posts.filter(post => !post.flags?.includes('unlisted')).map(post => post.path)]) {
    const canonical = canonicalPage(path)
    assert(locations.includes(canonical), `Sitemap omitted ${path}`)
    const html = await fs.readFile(`build${new URL(canonical).pathname}index.html`, 'utf8')
    const link = html.match(/<link\s[^>]*rel="canonical"[^>]*>/)?.[0]
    assert.equal(link?.match(/href="([^"]+)"/)?.[1], canonical)
    const meta = html.match(/<meta\s[^>]*property="og:url"[^>]*>/)?.[0]
    assert.equal(meta?.match(/content="([^"]+)"/)?.[1], canonical)
  }
  for (const location of locations) {
    assert.equal(new URL(location).origin, 'https://www.mujina-prod.com')
    assert(location.endsWith('/'))
    await fs.access(`build${decodeURI(new URL(location).pathname)}index.html`)
  }
  const atom = parser.parseFromString(await fs.readFile('build/atom.xml', 'utf8'), 'application/xml')
  assert.equal(atom.documentElement.namespaceURI, 'http://www.w3.org/2005/Atom')
  const atomIds = Array.from(atom.getElementsByTagName('id'), node => node.textContent)
  const json = JSON.parse(await fs.readFile('build/feed.json', 'utf8'))
  for (const post of posts.filter(post => !post.flags?.includes('unlisted'))) {
    assert(atomIds.includes(atomId(post.path)), `Atom identity changed: ${post.path}`)
    assert(json.items.some(item => item.id === post.path.slice(1) && item.url === canonicalPage(post.path)))
  }
  assert.match(await fs.readFile('build/robots.txt', 'utf8'), /Sitemap: https:\/\/www\.mujina-prod\.com\/sitemap\.xml/)
}
