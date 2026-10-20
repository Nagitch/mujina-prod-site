import type { RequestHandler } from './$types'
import { genPosts } from '$lib/server/posts'
import { sitemap } from '$lib/utils/urls'

const pageRoutes = Object.keys(import.meta.glob('/src/routes/**/+page.svelte', { eager: true }))
  .map(path => path.replace('/src/routes', '').replace(/\/\+page\.svelte$/, '') || '/')
const slideRoutes = Object.keys(import.meta.glob('/urara/slides/**/index.html', { eager: true }))
  .map(path => path.replace('/urara', '').replace(/\/index\.html$/, ''))

export const prerender = true
export const trailingSlash = 'never'
export const GET: RequestHandler = () => new Response(sitemap([
  ...pageRoutes.filter(path => path !== '/offline').map(path => ({ path })),
  ...slideRoutes.map(path => ({ path })),
  ...genPosts({ filterUnlisted: true }).map(post => ({ path: post.path, updated: post.updated ?? post.published ?? post.created })),
]), { headers: { 'content-type': 'application/xml; charset=utf-8' } })
