<script lang='ts'>
  import { browser } from '$app/environment'
  import { goto } from '$app/navigation'
  import { page } from '$app/stores'
  import Footer from '$lib/components/footer.svelte'
  import Head from '$lib/components/head.svelte'
  import Post from '$lib/components/post_card.svelte'
  import { posts as storedPosts } from '$lib/stores/posts'
  import { title as storedTitle } from '$lib/stores/title'
  import { fly } from '$lib/utils/motion'
  import { onMount } from 'svelte'

  let playing = false
  let allPosts: Urara.Post[]
  let loaded: boolean
  let [posts, tags, years]: [Urara.Post[], string[], number[]] = [[], [], []]

  storedTitle.set('')

  $: allPosts = $storedPosts.filter(post => !post.flags?.includes('unlisted'))

  $: if (posts.length > 1)
    years = [new Date(posts[0].published ?? posts[0].created).getFullYear()]

  $: if (tags) {
    posts = !tags ? allPosts : allPosts.filter(post => tags.every(tag => post.tags?.includes(tag)))
    if (browser && window.location.pathname === '/')
      goto(tags.length > 0 ? `?tags=${tags.toString()}` : `/`, { replaceState: true })
  }

  onMount(() => {
    if (browser) {
      if ($page.url.searchParams.get('tags'))
        tags = $page.url.searchParams.get('tags')?.split(',') ?? []
      loaded = true
    }
    let disposed = false
    let vfx: import('@vfx-js/core').VFX | null = null
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)')
    const stop = () => {
      vfx?.destroy()
      vfx = null
    }
    const start = async () => {
      if (disposed || motion.matches || document.hidden)
        return
      try {
        const { VFX } = await import('@vfx-js/core')
        if (disposed || motion.matches || document.hidden || vfx)
          return
        const element = document.getElementById('site-land-page-title-display')
        if (element) {
          vfx = VFX.init()
          await vfx?.add(element, { overflow: 100, shader: 'rgbShift' })
          if (disposed || motion.matches || document.hidden)
            stop()
        }
      }
      catch { stop() }
    }
    const changed = () => {
      stop()
      void start()
    }
    const timer = setTimeout(start, 1500)
    motion.addEventListener('change', changed)
    document.addEventListener('visibilitychange', changed)
    return () => {
      disposed = true
      clearTimeout(timer)
      motion.removeEventListener('change', changed)
      document.removeEventListener('visibilitychange', changed)
      stop()
    }
  })
</script>

<Head />

<div
  class="flex flex-col justify-center flex-nowrap xl:flex-row xl:flex-wrap h-feed bg-[url('/assets/bg-header.webp')] bg-contain bg-scroll bg-no-repeat bg-top">
  <!-- <div class="flex flex-col flex-nowrap justify-center xl:flex-row xl:flex-wrap h-feed"> -->
  <div class='flex-none w-full max-w-screen-xl mx-auto xl:mx-0'>
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
            <button class='btn btn-secondary' on:click={() => (tags = [])}>
              <span class='mr-2 i-heroicons-outline-trash'></span>
              tags = []
            </button>
          </div>
        </div>
      {/if}
      <main
        class='flex flex-col relative z-10 bg-base-100 md:bg-transparent md:gap-8'
        itemprop='mainEntityOfPage'
        itemscope
        itemtype='https://schema.org/Blog'>
        <div class='mx-auto p-3 rounded-md' id='site-land-page-title-display'>
          <h1 class='mx-auto'>
            <span class='md:font-medium font-extrabold md:text-7xl text-2xl'>Mujina Production</span>
            <br />
            <div class='text-right'><span class='font-normal md:text-4xl text-base'>by Nagitch</span></div>
          </h1>
        </div>
        <div class='flex justify-center items-center flex-row justify-items-center'>
          <div class='basis-10 md:basis-20 m-3 md:m-6 rounded-full backdrop-blur-sm bg-slate-100/[.7]'>
            <a href='https://github.com/Nagitch' target='_blank'>
              <img alt='GitHub' src='/assets/social-logos/github-icon-1.svg' />
            </a>
          </div>
          <div class='basis-10 md:basis-20 m-3 md:m-6 backdrop-blur-sm rounded-2xl'>
            <a href='https://twitter.com/NagitchDevelop' target='_blank'>
              <img alt='Twitter / X' src='/assets/social-logos/twitter-logo-blue.svg' />
            </a>
          </div>
          <div class='m-3 md:m-6 rounded-2xl backdrop-blur-sm basis-16 md:basis-32'>
            <a href='https://vrchat.com/home/user/usr_8292a43a-914e-4dc0-8c40-51809e1af76b' target='_blank'>
              <img alt='VRChat' src='/assets/social-logos/VRC_Logo_TrademarkWhite.webp' />
            </a>
          </div>
          <div class='basis-10 md:basis-20 m-3 md:m-6 rounded-2xl backdrop-blur-sm'>
            <a href='https://mujina-prod.booth.pm/' target='_blank'>
              <img alt='Booth' src='/assets/social-logos/booth-logo_icon_r.svg' />
            </a>
          </div>
          <div class='basis-10 m-3 md:m-6 rounded-2xl backdrop-blur-sm md:basis-24'>
            <a href='https://soundcloud.com/nagitch' target='_blank'>
              <img alt='SoundCloud' src='/assets/social-logos/soundcloud.svg' />
            </a>
          </div>
        </div>
        <div class='conatiner aspect-video my-5 pd-15'>
          {#if playing}
            <iframe
              allow='autoplay; encrypted-media; picture-in-picture; fullscreen'
              allowfullscreen
              class='w-full h-full'
              src='https://www.youtube-nocookie.com/embed/sdbYqEbr4-E?autoplay=1'
              title='制作作品の紹介動画'></iframe>
          {:else}
            <button class='relative w-full h-full overflow-hidden rounded-box bg-neutral text-neutral-content' aria-label='制作作品の紹介動画を再生（YouTube）' on:click={() => (playing = true)}>
              <img src='/assets/bg-header.webp' alt='' class='w-full h-full object-cover' />
              <span class='absolute inset-0 flex flex-col items-center justify-center gap-4 bg-black/40 text-white'>
                <span class='text-5xl' aria-hidden='true'>▶</span>
                <span>制作作品の紹介動画を再生</span>
              </span>
            </button>
          {/if}
        </div>
        <div class='ml-6 my-4'>
          <p>
            <strong>「狢制作」</strong>
            (Mujina Production) は
            <strong>Nagitch</strong>
            の制作・個人事業名義です。
            <br />
            <a href='/portfolio/'>
              <span class='underline'>
                <span
                  class='text-base bg-no-repeat underline md:text-2xl bg-[length:100%_0%] bg-[position:0_88%] decoration-4 decoration-transparent group-hover:decoration-primary hover:bg-[length:100%_100%] hover:text-primary-content bg-linear-to-t from-primary to-primary transition-all ease-in-out duration-300'>
                  📝ポートフォリオはこちら
                </span>
              </span>
            </a>
          </p>
        </div>
        <div class='divider mt-0 mb-8 hidden lg:flex'></div>
        <h1 class='ml-6 text-xl font-bold'>最新のブログ</h1>
        {#each posts.slice(0, 3) as post, index}
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
            class='transition-all ease-in-out max-w-screen-lg md:mx-20 duration-500 hover:z-30 hover:shadow-xl md:shadow-xs md:hover:shadow-xl md:hover:-translate-y-0.5'
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
