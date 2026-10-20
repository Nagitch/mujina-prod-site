<script lang='ts'>
  import { goto } from '$app/navigation'
  import { page } from '$app/stores'
  import Footer from '$lib/components/footer.svelte'
  import Head from '$lib/components/head.svelte'
  import Profile from '$lib/components/index_profile.svelte'
  import Post from '$lib/components/post_card.svelte'
  import { posts as storedPosts, tags as storedTags } from '$lib/stores/posts'
  import { title as storedTitle } from '$lib/stores/title'
  import { fly } from '$lib/utils/motion'
  import { blogTagsPath } from '$lib/utils/urls'
  import { onMount } from 'svelte'

  let allPosts: Urara.Post[]
  let allTags: string[]
  let loaded: boolean
  let [posts, tags, years]: [Urara.Post[], string[], number[]] = [[], [], []]

  storedTitle.set('')

  $: allPosts = $storedPosts.filter(post => !post.flags?.includes('unlisted'))

  $: allTags = $storedTags

  $: if (posts.length > 1)
    years = [new Date(posts[0].published ?? posts[0].created).getFullYear()]

  $: tags = loaded ? $page.url.searchParams.get('tags')?.split(',').filter(Boolean) ?? [] : []
  $: posts = allPosts.filter(post => tags.every(tag => post.tags?.includes(tag)))

  const selectTags = (selected: string[]) => goto(blogTagsPath(selected), { replaceState: true, noScroll: true, keepFocus: true })

  onMount(() => {
    loaded = true
  })
</script>

<Head page={{ title: 'Blog', path: '/blog/' }} />

<div class='flex flex-col flex-nowrap justify-center xl:flex-row xl:flex-wrap h-feed'>
  <div
    class='flex-1 w-full max-w-screen-md order-first mx-auto xl:mr-0 xl:ml-8 xl:max-w-md'
    in:fly={{ delay: 500, duration: 300, x: 25 }}
    out:fly={{ duration: 300, x: 25 }}>
    <Profile />
  </div>
  <div
    class='flex-1 w-full max-w-screen-md xl:order-last mx-auto xl:ml-0 xl:mr-8 xl:max-w-md'
    in:fly={{ delay: 500, duration: 300, x: -25 }}
    out:fly={{ duration: 300, x: -25 }}>
    {#if allTags && Object.keys(allTags).length > 0}
      <div
        class='flex xl:flex-wrap gap-2 overflow-y-hidden my-auto overflow-x-auto xl:overflow-x-hidden max-h-24 xl:max-h-fit max-w-fit xl:max-w-full pl-8 md:px-0 xl:pl-8 xl:pt-8'>
        {#each allTags as tag}
          <button
            class='btn btn-sm btn-ghost normal-case mt-4 mb-8 border-dotted border-base-content/20 border-2 xl:m-0'
            class:!btn-secondary={tags.includes(tag)}
            class:shadow-lg={tags.includes(tag)}
            id={tag}
            aria-pressed={tags.includes(tag)}
            on:click={() => selectTags(tags.includes(tag) ? tags.filter(tagName => tagName !== tag) : [...tags, tag])}>
            #{tag}
          </button>
        {/each}
      </div>
    {/if}
  </div>
  <div class='flex-none w-full max-w-screen-md mx-auto xl:mx-0'>
    {#key posts}
      <!-- {:else} is not used because there is a problem with the transition -->
      {#if loaded && posts.length === 0}
        <div
          class='bg-base-300 text-base-content shadow-inner text-center md:rounded-box p-10 -mb-2 md:mb-0 relative z-10'
          in:fly={{ delay: 500, duration: 300, x: 100 }}
          out:fly={{ duration: 300, x: -100 }}>
          <div class='prose items-center'>
            <h2>
              Not found: [{#each tags as tag, i}
                '{tag}'{#if i + 1 < tags.length},{/if}
              {/each}]
            </h2>
            <button class='btn btn-secondary' on:click={() => selectTags([])}>
              <span class='i-heroicons-outline-trash mr-2'></span>
              tags = []
            </button>
          </div>
        </div>
      {/if}
      <main
        class='flex flex-col relative bg-base-100 md:bg-transparent md:gap-8 z-10'
        itemprop='mainEntityOfPage'
        itemscope
        itemtype='https://schema.org/Blog'>
        {#each posts as post, index}
          {@const year = new Date(post.published ?? post.created).getFullYear()}
          {#if !years.includes(year)}
            <div
              class='divider my-4 md:my-0'
              in:fly={{ delay: 500, duration: 300, x: index % 2 ? 100 : -100 }}
              out:fly={{ duration: 300, x: index % 2 ? -100 : 100 }}>
              {years.push(year) && year}
            </div>
          {/if}
          <div
            class='rounded-box transition-all duration-500 ease-in-out hover:z-30 md:shadow-xl md:hover:-translate-y-0.5 hover:shadow-lg md:hover:shadow-2xl'
            in:fly={{ delay: 500, duration: 300, x: index % 2 ? 100 : -100 }}
            out:fly={{ duration: 300, x: index % 2 ? -100 : 100 }}>
            <Post decoding={index < 5 ? 'auto' : 'async'} loading={index < 5 ? 'eager' : 'lazy'} {post} preview={true} />
          </div>
        {/each}
      </main>
      <div
        class='sticky bottom-0 md:static md:mt-8'
        class:hidden={!loaded}
        in:fly={{ delay: 500, duration: 300, x: posts.length + (1 % 2) ? 100 : -100 }}
        out:fly={{ duration: 300, x: posts.length + (1 % 2) ? -100 : 100 }}>
        <div class='divider mt-0 mb-8 hidden lg:flex'></div>
        <Footer />
      </div>
    {/key}
  </div>
</div>
