<script lang="ts">
  import { onMount } from 'svelte'
  import { fade, fly } from 'svelte/transition'
  import { page } from '$app/stores'
  import { browser } from '$app/environment'
  import { goto } from '$app/navigation'
  import { posts as storedPosts, tags as storedTags } from '$lib/stores/posts'
  import { title as storedTitle } from '$lib/stores/title'
  import Head from '$lib/components/head.svelte'
  import Footer from '$lib/components/footer.svelte'
  import Post from '$lib/components/post_card.svelte'

  let allPosts: Urara.Post[]
  let allTags: string[]
  let loaded: boolean
  let [posts, tags, years]: [Urara.Post[], string[], number[]] = [[], [], []]

  storedTitle.set('')

  $: storedPosts.subscribe(storedPosts => (allPosts = storedPosts.filter(post => !post.flags?.includes('unlisted'))))

  $: storedTags.subscribe(storedTags => (allTags = storedTags as string[]))

  $: if (posts.length > 1) years = [new Date(posts[0].published ?? posts[0].created).getFullYear()]

  $: if (tags) {
    posts = !tags ? allPosts : allPosts.filter(post => tags.every(tag => post.tags?.includes(tag)))
    if (browser && window.location.pathname === '/')
      goto(tags.length > 0 ? `?tags=${tags.toString()}` : `/`, { replaceState: true })
  }

  onMount(() => {
    if (browser) {
      if ($page.url.searchParams.get('tags')) tags = $page.url.searchParams.get('tags')?.split(',') ?? []
      loaded = true
    }
  })
</script>

<Head />

<div
  class="flex flex-col flex-nowrap justify-center xl:flex-row xl:flex-wrap h-feed
    bg-[url('/assets/bg-header.png')] bg-contain bg-scroll bg-no-repeat bg-top">
  <!-- <div class="flex flex-col flex-nowrap justify-center xl:flex-row xl:flex-wrap h-feed"> -->
  <div class="flex-none w-full max-w-screen-xl mx-auto xl:mx-0">
    {#key posts}
      <!-- {:else} is not used because there is a problem with the transition -->
      {#if loaded && posts.length === 0}
        <div
          in:fly={{ x: 100, duration: 300, delay: 500 }}
          out:fly={{ x: -100, duration: 300 }}
          class="bg-base-300 text-base-content shadow-inner text-center md:rounded-box p-10 -mb-2 md:mb-0 relative z-10">
          <div class="prose items-center">
            <h2>
              Not found: [{#each tags as tag, i}
                '{tag}'{#if i + 1 < tags.length},{/if}
              {/each}]
            </h2>
            <button on:click={() => (tags = [])} class="btn btn-secondary">
              <span class="i-heroicons-outline-trash mr-2" />
              tags = []
            </button>
          </div>
        </div>
      {/if}
      <main
        class="flex flex-col relative bg-base-100 md:bg-transparent md:gap-8 z-10"
        itemprop="mainEntityOfPage"
        itemscope
        itemtype="https://schema.org/Blog">
        <div class="mx-auto p-3 bg-slate-900/[.65] rounded-md backdrop-blur">
          <h1 class="mx-auto font-normal md:font-medium text-2xl">
            Mujina Production
            <span class="text-base font-normal">by Nagitch</span>
          </h1>
        </div>
        <div class="flex flex-row justify-center justify-items-center items-center">
          <div class="basis-10 md:basis-20 m-3 md:m-6 rounded-full backdrop-blur bg-slate-100/[.7]">
            <a href="https://github.com/Nagitch" target="_blank">
              <img src={'/assets/social-logos/github-icon-1.svg'} alt="GitHub" />
            </a>
          </div>
          <div class="basis-10 md:basis-20 m-3 md:m-6 rounded-2xl backdrop-blur">
            <a href="https://twitter.com/NagitchDevelop" target="_blank">
              <img src={'/assets/social-logos/twitter-logo-blue.svg'} alt="Twitter / X" />
            </a>
          </div>
          <div class="basis-16 md:basis-32 m-3 md:m-6 rounded-2xl backdrop-blur">
            <a href="https://vrchat.com/home/user/usr_8292a43a-914e-4dc0-8c40-51809e1af76b" target="_blank">
              <img src={'/assets/social-logos/VRC_Logo_TrademarkWhite.png'} alt="VRChat" />
            </a>
          </div>
          <div class="basis-10 md:basis-24 m-3 md:m-6 rounded-2xl backdrop-blur">
            <a href="https://soundcloud.com/nagitch" target="_blank">
              <img src={'/assets/social-logos/soundcloud.svg'} alt="SoundCloud" />
            </a>
          </div>
          <div class="basis-10 md:basis-20 m-3 md:m-6 rounded-2xl backdrop-blur">
            <a href="https://mujina-prod.booth.pm/" target="_blank">
              <img src={'/assets/social-logos/booth-logo_icon_r.svg'} alt="Booth" />
            </a>
          </div>
        </div>
        <div class="conatiner aspect-video my-5 pd-15">
          <iframe
            width="100%"
            height="100%"
            src="https://www.youtube.com/embed/sdbYqEbr4-E?autoplay=1&mute=1&loop=1&playlist=sdbYqEbr4-E&disablekb=1"
            title="YouTube video player"
            frameborder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowfullscreen />
        </div>
        <div class="ml-6 my-4">
          <p>
            <strong>「狢制作」</strong>
            (Mujina Production) は
            <strong>Nagitch</strong>
            の個人事業・制作活動のブランド名です。
            <br />
            <a href="/portfolio"><span class="underline decoration-solid">ポートフォリオはこちら</span></a>
          </p>
        </div>
        <div class="divider mt-0 mb-8 hidden lg:flex" />
        <h1 class="text-xl font-bold ml-6">最新のブログ</h1>
        {#each posts.slice(0, 3) as post, index}
          {@const year = new Date(post.published ?? post.created).getFullYear()}
          {#if !years.includes(year)}
            <div
              in:fly={{ x: index % 2 ? 100 : -100, duration: 300, delay: 500 }}
              out:fly={{ x: index % 2 ? -100 : 100, duration: 300 }}
              class="divider my-4 md:my-0">
              {years.push(year) && year}
            </div>
          {/if}
          <div
            in:fly={{ x: index % 2 ? 100 : -100, duration: 300, delay: 500 }}
            out:fly={{ x: index % 2 ? -100 : 100, duration: 300 }}
            class="max-w-screen-lg mx-20 transition-all duration-500 ease-in-out hover:z-30 hover:shadow-xl md:shadow-sm md:hover:shadow-xl md:hover:-translate-y-0.5">
            <Post {post} preview={true} loading={index < 5 ? 'eager' : 'lazy'} decoding={index < 5 ? 'auto' : 'async'} />
          </div>
        {/each}
      </main>
      <div
        class:hidden={!loaded}
        class="sticky bottom-0 md:static md:mt-8"
        in:fly={{ x: posts.length + (1 % 2) ? 100 : -100, duration: 300, delay: 500 }}
        out:fly={{ x: posts.length + (1 % 2) ? -100 : 100, duration: 300 }}>
        <div class="divider mt-0 mb-8 hidden lg:flex" />
        <Footer />
      </div>
    {/key}
  </div>
</div>
