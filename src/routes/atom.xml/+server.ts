import type { RequestHandler } from './$types'
import { feed } from '$lib/config/general'
import { favicon } from '$lib/config/icon'
import { site } from '$lib/config/site'
import { genPosts } from '$lib/server/posts'
import { genTags } from '$lib/utils/posts'
import { absoluteUrl, atomId, canonicalPage, cdata, xml } from '$lib/utils/urls'

function categories(tags: string[] = []) {
  return tags.map(tag => `<category term="${xml(tag)}" scheme="${xml(`${canonicalPage()}?tags=${encodeURIComponent(tag)}`)}"/>`).join('')
}

function render(posts = genPosts({ filterUnlisted: true, postHtml: true, postLimit: feed.limit })): string {
  return `<?xml version="1.0" encoding="utf-8"?>
<feed xmlns="http://www.w3.org/2005/Atom">
  <id>${xml(atomId())}</id>
  <title>${cdata(site.title)}</title>
  ${site.subtitle ? `<subtitle>${cdata(site.subtitle)}</subtitle>` : ''}
  ${favicon ? `<icon>${xml(absoluteUrl(favicon.src))}</icon>` : ''}
  <link href="${xml(canonicalPage())}"/>
  <link href="${xml(absoluteUrl('/atom.xml'))}" rel="self" type="application/atom+xml"/>
  ${feed.hubs?.map(hub => `<link href="${xml(hub)}" rel="hub"/>`).join('') ?? ''}
  <updated>${new Date().toJSON()}</updated>
  <author><name>${cdata(site.author.name ?? '')}</name></author>
  ${categories(genTags(posts))}
  ${posts.map(post => `<entry>
    <title type="html">${cdata(post.title ?? '')}</title>
    <link href="${xml(canonicalPage(post.path))}"/>
    <id>${xml(atomId(post.path))}</id>
    <published>${new Date(post.published ?? post.created).toJSON()}</published>
    <updated>${new Date(post.updated ?? post.published ?? post.created).toJSON()}</updated>
    ${post.summary ? `<summary type="html">${cdata(post.summary.toString())}</summary>` : ''}
    <content type="html">${cdata(post.html ?? '')}</content>
    ${categories(post.tags)}
  </entry>`).join('')}
</feed>`
}

export const prerender = true
export const trailingSlash = 'never'
export const GET: RequestHandler = () => new Response(render(), {
  headers: { 'content-type': 'application/atom+xml; charset=utf-8' },
})
