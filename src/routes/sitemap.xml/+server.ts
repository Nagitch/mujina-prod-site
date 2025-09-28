import { site } from '$lib/config/site'
import { genPosts } from '$lib/utils/posts'

import type { RequestHandler } from './$types'

const pageRoutes = Object.keys(import.meta.glob('/src/routes/**/+page.svelte', { eager: true }))
  .map(path => path.replace('/src/routes', '').replace(/\/\+page\.svelte$/, '') || '/')
  .filter(route => route !== '/')

const slideRoutes = Object.keys(import.meta.glob('/urara/slides/**/index.html', { eager: true }))
  .map(path => path.replace('/urara', '').replace(/\/index\.html$/, ''))

const render = (): string => {
  const postEntries = genPosts()
    .map(
      post => `
        <url>
            <loc>${site.protocol + site.domain + post.path}</loc>
            <lastmod>${new Date(post.updated ?? post.published ?? post.created).toISOString()}</lastmod>
            <priority>0.5</priority>
        </url>`,
    )
    .join('')

  const staticEntries = [...pageRoutes, ...slideRoutes]
    .sort()
    .map(
      route => `
        <url>
            <loc>${site.protocol + site.domain + route}</loc>
            <priority>0.7</priority>
        </url>`,
    )
    .join('')

  return `<?xml version='1.0' encoding='utf-8'?>
  <urlset
    xmlns="https://www.sitemaps.org/schemas/sitemap/0.9"
    xmlns:xhtml="https://www.w3.org/1999/xhtml"
    xmlns:mobile="https://www.google.com/schemas/sitemap-mobile/1.0"
    xmlns:news="https://www.google.com/schemas/sitemap-news/0.9"
    xmlns:image="https://www.google.com/schemas/sitemap-image/1.1"
    xmlns:video="https://www.google.com/schemas/sitemap-video/1.1">
    <url>
      <loc>${site.protocol + site.domain}</loc>
    </url>${staticEntries}${postEntries}
  </urlset>`.trim()
}

export const prerender = true
export const trailingSlash = 'never'
export const GET: RequestHandler = async () =>
  new Response(render(), {
    headers: {
      'content-type': 'application/xml; charset=utf-8',
    },
  })
