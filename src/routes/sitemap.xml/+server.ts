import type { RequestHandler } from './$types'
import { site } from '$lib/config/site'
import { genPosts } from '$lib/utils/posts'

const render = (): string =>
  `<?xml version='1.0' encoding='utf-8'?>
  <urlset
    xmlns="https://www.sitemaps.org/schemas/sitemap/0.9"
    xmlns:xhtml="https://www.w3.org/1999/xhtml"
    xmlns:mobile="https://www.google.com/schemas/sitemap-mobile/1.0"
    xmlns:news="https://www.google.com/schemas/sitemap-news/0.9"
    xmlns:image="https://www.google.com/schemas/sitemap-image/1.1"
    xmlns:video="https://www.google.com/schemas/sitemap-video/1.1">
    <url>
      <loc>${site.protocol + "www." + site.domain}</loc>
    </url>
    <url>
      <loc>${site.protocol + "www." + site.domain}/blog/</loc>
    </url>
    <url>
      <loc>${site.protocol + "www." + site.domain}/portfolio/</loc>
    </url>
    ${genPosts()
      .map(
        post => `
        <url>
            <loc>${site.protocol + "www." + site.domain + post.path}/</loc>
            <lastmod>${new Date(post.updated ?? post.published ?? post.created).toISOString()}</lastmod>
            <priority>0.5</priority>
        </url>`
      )
      .join('')}
  </urlset>`.trim()

export const prerender = true
export const trailingSlash = 'never'
export const GET: RequestHandler = async () =>
  new Response(render(), {
    headers: {
      'content-type': 'application/xml; charset=utf-8'
    }
  })
