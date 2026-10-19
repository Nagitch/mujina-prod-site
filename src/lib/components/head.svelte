<script lang='ts'>
  import { dev } from '$app/environment'
  import OpenGraph from '$lib/components/head_opengraph.svelte'
  import { head } from '$lib/config/general'
  import { site } from '$lib/config/site'

  // An explicit default makes this Svelte prop optional.
  // eslint-disable-next-line no-undef-init
  export let post: undefined | Urara.Post = undefined
  // eslint-disable-next-line no-undef-init
  export let page: undefined | Urara.Page = undefined
</script>

<svelte:head>
  <meta content={site.author?.name} name='author' />
  {#if post}
    <link href={site.protocol + site.domain + post.path} rel='canonical' />
    {#if post.type === 'article'}
      <title>{post.title} | {site.title}</title>
    {:else if post.type === 'note'}
      <title>{post.summary ?? post.path.slice(1)} | {site.title}</title>
    {/if}
    {#if post.tags}<meta content={post.tags.join(', ')} name='keywords' />{/if}
    {#if post.summary}<meta content={post.summary} name='description' />{/if}
  {:else}
    <meta content={site.description} name='description' />
    <meta content={site.keywords?.join(', ')} name='keywords' />
    {#if page}
      <title>{page.title ?? page.path.slice(1)} | {site.title}</title>
      <link href={site.protocol + site.domain + page.path} rel='canonical' />
    {:else}
      <title>{site.subtitle ? `${site.title} - ${site.subtitle}` : site.title}</title>
      <link href={site.protocol + site.domain} rel='canonical' />
    {/if}
  {/if}
  {#if head.custom}
    {#each head.custom({ dev, page, post }) as tag}
      <!-- Trusted HTML returned by the repository head configuration. -->
      <!-- eslint-disable-next-line svelte/no-at-html-tags -->
      {@html tag}
    {/each}
  {/if}
</svelte:head>

<OpenGraph {page} {post} />
