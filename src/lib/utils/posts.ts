import type { FFFFlavoredFrontmatter } from 'fff-flavored-frontmatter'

type GenTagsFunction = (posts: Urara.Post[]) => string[]

/**
 * Detect Post Type
 * @param fm - post frontmatter
 * @returns - post type string
 */
export function typeOfPost(fm: FFFFlavoredFrontmatter): 'article' | 'audio' | 'bookmark' | 'like' | 'note' | 'photo' | 'reply' | 'repost' | 'video' {
  return fm.title
    ? 'article'
    : fm.image
      ? 'photo'
      : fm.audio
        ? 'audio'
        : fm.video
          ? 'video'
          : fm.bookmark_of
            ? 'bookmark'
            : fm.like_of
              ? 'like'
              : fm.repost_of
                ? 'repost'
                : fm.in_reply_to
                  ? 'reply'
                  : 'note'
}

/**
 * Generate Tags List
 * @param posts - posts list
 * @returns - tags list
 */
export const genTags: GenTagsFunction = posts => [
  ...new Set(posts.reduce((acc, posts) => (posts.tags ? [...acc, ...posts.tags] : acc), ['']).slice(1)),
]
