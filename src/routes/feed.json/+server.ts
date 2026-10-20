import type { RequestHandler } from './$types'
import { feed } from '$lib/config/general'
import { any, favicon } from '$lib/config/icon'
import { site } from '$lib/config/site'
import { genPosts } from '$lib/server/posts'
import { absoluteUrl, canonicalPage } from '$lib/utils/urls'

import { json } from '@sveltejs/kit'

function render(posts = genPosts({ filterUnlisted: true, postHtml: true, postLimit: feed.limit })) {
  return {
    authors: [
      {
        avatar: site.author.avatar ? absoluteUrl(site.author.avatar) : undefined,
        name: site.author.name,
        url: canonicalPage(),
      },
    ],
    description: site.description,
    favicon: favicon?.src ? absoluteUrl(favicon.src) : undefined,
    feed_url: absoluteUrl('/feed.json'),
    home_page_url: canonicalPage(),
    hubs: feed.hubs?.map(hub => ({
      type: 'WebSub',
      url: hub,
    })),
    icon: absoluteUrl(any['512'].src ?? any['192'].src),
    items: posts.map(post => ({
      _indieweb: {
        'in-reply-to': post.in_reply_to,
        'type': post.type,
      },
      content_html: post.html,
      date_modified: post.updated ?? post.published ?? post.created,
      date_published: post.published ?? post.created,
      id: post.path.slice(1),
      image: post.image ? absoluteUrl(post.image) : undefined,
      summary: post.summary,
      tags: post.tags,
      title: post.title,
      url: canonicalPage(post.path),
    })),
    language: site.lang ?? 'en',
    title: site.title,
    version: 'https://jsonfeed.org/version/1.1',
  }
}

export const prerender = true
export const trailingSlash = 'never'
export const GET: RequestHandler = async () =>
  json(render(), {
    headers: {
      'content-type': 'application/feed+json; charset=utf-8',
    },
  })
