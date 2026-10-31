import type { RequestHandler } from './$types'
import { json } from '@sveltejs/kit'

import { genPosts } from '#lib/server/posts.ts'

export const prerender = true
export const trailingSlash = 'never'
export const GET: RequestHandler = async () => json(genPosts())
