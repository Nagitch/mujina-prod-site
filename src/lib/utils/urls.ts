/** Public identity is independent of the preview/development deployment host. */
export const SITE_ORIGIN = 'https://www.mujina-prod.com'
export const LEGACY_ORIGIN = 'https://mujina-prod.com'

/** HTML pages use directory URLs; query/hash remain available for navigation. */
export function pagePath(path = '/') {
  const url = new URL(path || '/', SITE_ORIGIN)
  const pathname = url.pathname.replace(/\/index\.html$/, '/').replace(/\/+$/, '') || ''
  return `${pathname}/${url.search}${url.hash}`
}

export function canonicalPage(path = '/') {
  const url = new URL(pagePath(path), SITE_ORIGIN)
  url.search = ''
  url.hash = ''
  return url.href
}

/** Files and external image URLs do not get an HTML trailing slash. */
export function absoluteUrl(path: string) {
  return new URL(path, `${SITE_ORIGIN}/`).href
}

/** Atom IDs are permanent identifiers, not current navigation URLs. */
export function atomId(path = '/') {
  return `${LEGACY_ORIGIN}${path}`
}

export function xml(value: string) {
  return value.replace(/[<>&"']/g, char => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;', '"': '&quot;', '\'': '&apos;' })[char]!)
}

export function cdata(value: string) {
  return `<![CDATA[${value.replaceAll(']]>', ']]]]><![CDATA[>')}]]>`
}

export function sitemap(entries: { path: string, updated?: string }[]) {
  const pages = new Map<string, string | undefined>()
  for (const { path, updated } of entries) {
    const url = canonicalPage(path)
    pages.set(url, updated ?? pages.get(url))
  }
  return `<?xml version="1.0" encoding="utf-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${[...pages].sort(([a], [b]) => a.localeCompare(b)).map(([url, updated]) => `\n  <url><loc>${xml(url)}</loc>${updated ? `<lastmod>${xml(new Date(updated).toISOString())}</lastmod>` : ''}</url>`).join('')}\n</urlset>`
}
