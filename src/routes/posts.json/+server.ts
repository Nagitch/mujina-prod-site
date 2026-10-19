import type { RequestHandler } from './$types'
import { genPosts } from '$lib/server/posts'

import { json } from '@sveltejs/kit'

export const prerender = true
export const trailingSlash = 'never'
export const GET: RequestHandler = async () => json(genPosts())
