<script lang='ts'>
  import { site } from '$lib/config/site'

  export let post: Urara.Post
  export let preview: boolean = false
  const publishedDate = new Date(post.published ?? post.created)
  const updatedDate = new Date(post.updated ?? post.published ?? post.created)
  // human readable: `2024-08-24` (year-month-day, zero-padded month/day)
  const stringPublished = `${publishedDate.getFullYear()}-${String(publishedDate.getMonth() + 1).padStart(2, '0')}-${String(publishedDate.getDate()).padStart(2, '0')}`
  const stringUpdated = `${updatedDate.getFullYear()}-${String(updatedDate.getMonth() + 1).padStart(2, '0')}-${String(updatedDate.getDate()).padStart(2, '0')}`
  const jsonPublished = publishedDate.toJSON()
  const jsonUpdated = updatedDate.toJSON()
</script>

<div class='flex font-semibold gap-1.5' class:md:mb-4={!preview && post.type !== 'article'}>
  <a
    class='opacity-75 duration-500 ease-in-out h-card hover:opacity-100 hover:text-primary p-author'
    class:hidden={preview}
    href={site.protocol + site.domain}
    rel='author'>
    {site.author.name}
  </a>
  <span class='opacity-50' class:hidden={preview}>/</span>
  <a class='u-url u-uid swap group/time' href={post.path}>
    <time
      class='font-semibold opacity-75 duration-500 ease-in-out mr-auto group-hover/time:opacity-0 dt-published'
      datetime={jsonPublished}
      itemprop='datePublished'>
      {stringPublished}
    </time>
    <time
      class='font-semibold duration-500 ease-in-out mr-auto opacity-0 group-hover/time:opacity-100 text-primary dt-updated'
      datetime={jsonUpdated}
      itemprop='dateModified'>
      {stringUpdated}
    </time>
  </a>
</div>
