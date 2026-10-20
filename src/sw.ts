/// <reference lib="webworker" />
import { setCacheNameDetails } from 'workbox-core'
import { matchPrecache, precache } from 'workbox-precaching'

declare const self: ServiceWorkerGlobalScope & { __WB_MANIFEST: { url: string, revision: string | null }[] }
setCacheNameDetails({ prefix: 'mujina-prod-site', suffix: self.registration.scope })
precache(self.__WB_MANIFEST)

self.addEventListener('message', (event) => {
  if (event.data?.type !== 'APPLY_UPDATE')
    return
  event.waitUntil((async () => {
    const tabs = await self.clients.matchAll({ type: 'window', includeUncontrolled: true })
    if (tabs.length > 1) {
      event.source?.postMessage({ type: 'UPDATE_BLOCKED' })
      return
    }
    await self.skipWaiting()
  })())
})

self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    // Exact legacy Workbox cache for this scope only; other applications are untouched.
    const legacy = `workbox-precache-v2-${self.registration.scope}`
    await caches.delete(legacy)
    await self.clients.claim()
  })())
})

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET' || new URL(event.request.url).origin !== self.location.origin)
    return
  // Precache routes own known pages. Unknown/slides navigations use the network,
  // then an explicit offline explanation, never the home page's HTML.
  const url = new URL(event.request.url)
  url.search = ''
  event.respondWith((async () => {
    const page = await matchPrecache(url.href)
    if (page)
      return page
    try {
      return await fetch(event.request)
    }
    catch {
      return event.request.mode === 'navigate' ? (await matchPrecache('/offline/')) ?? Response.error() : Response.error()
    }
  })())
})
