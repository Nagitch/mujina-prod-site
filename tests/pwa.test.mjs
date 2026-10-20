import assert from 'node:assert/strict'
import fs from 'node:fs/promises'
import { stripTypeScriptTypes } from 'node:module'
import test from 'node:test'
import vm from 'node:vm'
import { outputUrl, publicPages } from '../scripts/pwa-manifest.ts'

test('offline inventory contains only public HTML routes and preserves asset URLs', () => {
  const pages = publicPages([{ path: '/blog/公開' }, { path: '/blog/hidden', flags: ['unlisted'] }, { path: '/blog/draft', flags: ['draft'] }])
  assert(pages.has('/blog/公開/'))
  assert(!pages.has('/blog/hidden/'))
  assert(!pages.has('/blog/draft/'))
  assert.equal(outputUrl('prerendered/pages/blog/post/index.html'), '/blog/post/')
  assert.equal(outputUrl('prerendered/pages/index.html'), '/')
  assert.equal(outputUrl('client/_app/image.avif'), '/_app/image.avif')
})

async function worker({ tabs = 1, offline = false } = {}) {
  const events = new Map()
  const deleted = []
  let applied = 0
  const pages = new Map([
    ['https://site.test/', new Response('home')],
    ['https://site.test/blog/post/', new Response('article')],
    ['/offline/', new Response('offline guide')],
  ])
  const self = {
    __WB_MANIFEST: [],
    registration: { scope: 'https://site.test/' },
    location: { origin: 'https://site.test' },
    clients: { matchAll: async () => Array.from({ length: tabs }), claim: async () => {} },
    skipWaiting: async () => applied++,
    addEventListener: (name, callback) => events.set(name, callback),
  }
  const source = stripTypeScriptTypes(await fs.readFile(new URL('../src/sw.ts', import.meta.url), 'utf8')).replace(/^import .+$/gm, '')
  vm.runInNewContext(source, {
    self,
    URL,
    Response,
    setCacheNameDetails: () => {},
    precache: () => {},
    matchPrecache: async url => pages.get(url)?.clone(),
    caches: { delete: async key => deleted.push(key) },
    fetch: async () => {
      if (offline)
        throw new Error('Offline')
      return new Response('network')
    },
  })
  return { events, deleted, applied: () => applied }
}

test('offline navigation returns the requested article and an explicit fallback for unknown pages', async () => {
  const { events } = await worker({ offline: true })
  for (const [url, expected] of [['/blog/post/?tags=example', 'article'], ['/slides/deck/', 'offline guide'], ['/missing/', 'offline guide']]) {
    let response
    events.get('fetch')({ request: { url: `https://site.test${url}`, method: 'GET', mode: 'navigate' }, respondWith: value => (response = value) })
    assert.equal(await (await response).text(), expected)
  }
  for (const request of [{ url: 'https://youtube.com/video', method: 'GET' }, { url: 'https://site.test/api', method: 'POST' }])
    events.get('fetch')({ request, respondWith: () => assert.fail('External/non-GET requests must not be intercepted') })
})

test('updates require consent and wait for other tabs; migration removes only the exact legacy cache', async () => {
  for (const tabs of [1, 2]) {
    const w = await worker({ tabs })
    let promise
    let message
    w.events.get('message')({ data: { type: 'APPLY_UPDATE' }, source: { postMessage: value => (message = value.type) }, waitUntil: value => (promise = value) })
    await promise
    assert.equal(w.applied(), tabs === 1 ? 1 : 0)
    if (tabs === 2)
      assert.equal(message, 'UPDATE_BLOCKED')
    w.events.get('activate')({ waitUntil: value => (promise = value) })
    await promise
    assert.deepEqual(w.deleted, ['workbox-precache-v2-https://site.test/'])
  }
})
