import type { Handle } from '@sveltejs/kit/hooks'

import { site } from '#lib/config/site.ts'

export const handle: Handle = async ({ event, resolve }) =>
  await resolve(event, {
    transformPageChunk: ({ html }) => html.replace('<html lang="en">', `<html lang="${site.lang ?? 'en'}">`),
  })
