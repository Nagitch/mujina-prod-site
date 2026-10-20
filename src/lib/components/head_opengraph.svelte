<script lang='ts'>
  import { any, maskable } from '$lib/config/icon'
  import { site } from '$lib/config/site'
  import { absoluteUrl, canonicalPage } from '$lib/utils/urls'

  export let post: undefined | Urara.Post
  export let page: undefined | Urara.Page
</script>

<svelte:head>
  <meta content={site.title} property='og:site_name' />
  <meta content={site.lang} property='og:locale' />
  {#if post}
    <meta content='article' property='og:type' />
    <meta content={post.title ?? post.summary ?? post.path.slice(1)} property='og:title' />
    {#if post.summary}
      <meta content={post.summary} property='og:description' />
    {/if}
    {#if post.image}
      <meta content={absoluteUrl(post.image)} property='og:image' />
      <meta content='summary_large_image' name='twitter:card' />
    {:else}
      <meta content={absoluteUrl(maskable['512'].src ?? any['512'].src ?? any['192'].src)} property='og:image' />
      <meta content='summary' name='twitter:card' />
    {/if}
    {#if post.tags}
      {#each post.tags as tag}
        <meta content={tag} property='article:tag' />
      {/each}
    {/if}
    <meta content={canonicalPage(post.path)} property='og:url' />
    <meta content={site.author.name} property='article:author' />
    <meta content={post.published ?? post.created} property='article:published_time' />
    <meta content={post.updated ?? post.published ?? post.created} property='article:modified_time' />
  {:else}
    <meta content='website' property='og:type' />
    <meta content={absoluteUrl(maskable['512'].src ?? any['512'].src ?? any['192'].src)} property='og:image' />
    <meta content={site.description} property='og:description' />
    {#if page}
      <meta content={page.title ?? page.path.slice(1)} property='og:title' />
      <meta content={canonicalPage(page.path)} property='og:url' />
    {:else}
      <meta content={site.title} property='og:title' />
      <meta content={canonicalPage()} property='og:url' />
    {/if}
  {/if}
</svelte:head>
