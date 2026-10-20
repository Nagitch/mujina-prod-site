import assert from 'node:assert/strict'
import { test } from 'node:test'
import { DOMParser } from '@xmldom/xmldom'
import { absoluteUrl, atomId, canonicalPage, cdata, pagePath, sitemap, xml } from '../src/lib/utils/urls.ts'

test('HTML URLs normalize slash and Unicode while navigation preserves query and hash', () => {
  assert.equal(pagePath('/blog?tags=Rust#top'), '/blog/?tags=Rust#top')
  assert.equal(canonicalPage('/blog/index.html?tags=Rust#top'), 'https://www.mujina-prod.com/blog/')
  assert.equal(canonicalPage(''), 'https://www.mujina-prod.com/')
  assert.equal(canonicalPage('/日本語/'), 'https://www.mujina-prod.com/%E6%97%A5%E6%9C%AC%E8%AA%9E/')
  assert.equal(absoluteUrl('/feed.json'), 'https://www.mujina-prod.com/feed.json')
  assert.equal(absoluteUrl('https://example.org/image.png'), 'https://example.org/image.png')
})

test('Atom identity retains the old hostname and path spelling', () => {
  assert.equal(atomId('/blog/rust-rhai-benchmark'), 'https://mujina-prod.com/blog/rust-rhai-benchmark')
  assert.equal(atomId(), 'https://mujina-prod.com/')
})

test('sitemap has the specified namespace, deduplicated canonical URLs and escaped text', () => {
  const source = sitemap([{ path: '/' }, { path: '' }, { path: '/blog' }, { path: '/blog/' }, { path: '/a&b/日本語', updated: '2025-01-01' }])
  const document = new DOMParser({ onError: level => assert.fail(`XML ${level}`) }).parseFromString(source, 'application/xml')
  assert.equal(document.documentElement.namespaceURI, 'http://www.sitemaps.org/schemas/sitemap/0.9')
  const locations = Array.from(document.getElementsByTagName('loc'), el => el.textContent)
  assert.equal(locations.length, 3)
  assert(locations.includes('https://www.mujina-prod.com/a&b/%E6%97%A5%E6%9C%AC%E8%AA%9E/'))
  assert.equal(document.getElementsByTagName('lastmod')[0].textContent, '2025-01-01T00:00:00.000Z')
})

test('XML attributes and CDATA round-trip special characters and closing delimiters', () => {
  const value = `A&B <tag> "quotes" 'apostrophe' ]]> 日本語`
  const source = `<root value="${xml(value)}">${cdata(value)}</root>`
  const document = new DOMParser({ onError: level => assert.fail(`XML ${level}`) }).parseFromString(source, 'application/xml')
  assert.equal(document.documentElement.getAttribute('value'), value)
  assert.equal(document.documentElement.textContent, value)
})
