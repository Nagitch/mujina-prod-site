import { typeOfPost } from '$lib/utils/posts'
import { render } from 'svelte/server'

interface GenPostsOptions {
  /** hide posts with 'unlisted' flag */
  filterUnlisted?: boolean
  /** import.meta.glob<Urara.Post.Module> https://vitejs.dev/guide/features.html#glob-import */
  modules?: { [path: string]: Urara.Post.Module }
  /** set to true to output html */
  postHtml?: boolean
  /** limit a certain number of posts */
  postLimit?: number
}

type GenPostsFunction = (options?: GenPostsOptions) => Urara.Post[]

/**
 * Generate Posts List
 * @param options - An optional configuration object
 * @param options.filterUnlisted - Hide unlisted posts
 * @param options.modules - Compiled Markdown modules
 * @param options.postHtml - Include rendered HTML
 * @param options.postLimit - Limit the number of posts
 * @returns - posts list
 */
export const genPosts: GenPostsFunction = ({
  filterUnlisted = false,
  modules = import.meta.glob<Urara.Post.Module>('/src/routes/**/*.{md,svelte.md}', { eager: true }),
  postHtml = false,
  postLimit = undefined,
} = {}) =>
  Object.entries(modules)
    .map(([, module]) => ({
      ...module.metadata,
      html:
        postHtml || typeOfPost(module.metadata) !== 'article'
          // eslint-disable-next-line no-control-regex -- Strip control characters from serialized feed HTML.
          ? render(module.default).body.replace(/[\u0000-\u001F]/g, '').replace(/[\r\n]/g, '').match(/<main [^>]+>(.*?)<\/main>/gi)?.[0].replace(/<main [^>]+>(.*?)<\/main>/gi, '$1').replace(/( style=")(.*?)(")/gi, '').replace(/(<span>)(.*?)(<\/span>)/gi, '$2').replace(/(<main>)(.*?)(<\/main>)/gi, '$2')
          : '',
      type: typeOfPost(module.metadata),
    }))
    .filter((post, index) => (!filterUnlisted || !post.flags?.includes('unlisted')) && (!postLimit || index < postLimit))
    .sort((a, b) => Date.parse(b.published ?? b.created) - Date.parse(a.published ?? a.created))
