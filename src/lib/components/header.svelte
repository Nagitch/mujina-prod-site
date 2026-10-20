<script lang='ts'>
  import { browser } from '$app/environment'
  import Nav from '$lib/components/header_nav.svelte'
  import Search from '$lib/components/header_search.svelte'
  import { header as headerConfig, theme } from '$lib/config/general'
  import { site } from '$lib/config/site'
  import { title as storedTitle } from '$lib/stores/title'
  import { fly } from '$lib/utils/motion'
  import { tick } from 'svelte'

  export let path: string
  $: title = $storedTitle as string
  let search: boolean = false
  let themeOpen = false
  let themeButton: HTMLButtonElement
  let searchButton: HTMLButtonElement
  async function toggleSearch(open: boolean) {
    search = open
    await tick()
    if (open)
      document.getElementById('site-search')?.focus()
    else searchButton?.focus()
  }
  let currentTheme: string
  let currentThemeColor: string
  let pin: boolean = true
  let percent: number
  let [scrollY, lastY] = [0, 0]

  $: if (browser && currentTheme) {
    document.documentElement.setAttribute('data-theme', currentTheme)
    currentThemeColor = getComputedStyle(document.documentElement).getPropertyValue('--color-base-100').trim()
  }

  $: if (scrollY) {
    pin = !!(lastY - scrollY > 0 || scrollY === 0)
    lastY = scrollY
    if (browser) {
      percent
        = Math.round((scrollY / (document.documentElement.scrollHeight - document.documentElement.clientHeight)) * 10000) / 100
    }
  }

  if (browser) {
    const preferredTheme = 'mujinaprod'
    currentTheme = localStorage.getItem('theme') ?? theme.find(item => item.name === preferredTheme)?.name ?? theme[0].name
  }
</script>

<svelte:head>
  <meta content={currentThemeColor} name='theme-color' />
</svelte:head>

<svelte:window bind:scrollY on:keydown={(event) => {
  if (event.key === 'Escape') {
    if (search)
      void toggleSearch(false)
    if (themeOpen) {
      themeOpen = false
      themeButton?.focus()
    }
  }
}} />

<header
  class="w-full transition-all duration-500 ease-in-out border-transparent fixed z-50 border-b-2 max-h-[4.125rem] {scrollY > 32 && 'backdrop-blur-sm !border-base-content/10 bg-base-100/30 md:bg-base-200/30'}"
  class:-translate-y-32={!pin && scrollY > 0}
  id='header'
>
  {#if !search}
    <div class='navbar' in:fly={{ delay: 300, duration: 300, x: -50 }} out:fly={{ duration: 300, x: -50 }}>
      <div class='navbar-start'>
        {#if headerConfig.nav}
          <Nav nav={headerConfig.nav} {path} {pin} {scrollY} {title} />
        {/if}
        <a class='btn btn-ghost normal-case text-lg' href='/'>
          {#if site.header?.logo}
            <img alt={site.title} class='rounded-full u-photo w-8 h-8 z-6 md:w-7 md:h-7 mx-3 my-2' src={site.header.logo} />
          {/if}
          {site.title}
        </a>
      </div>
      <div class='navbar-end'>
        {#if headerConfig.search}
          <button bind:this={searchButton} aria-label='検索を開く' aria-expanded={search} aria-controls='site-search-form' class='btn btn-ghost btn-square' on:click={() => toggleSearch(!search)} tabindex='0'>
            <span class='i-heroicons-outline-search'></span>
          </button>
        {/if}
        <div class='relative' id='change-theme'>
          <button bind:this={themeButton} class='btn btn-square btn-ghost' aria-label='テーマを選ぶ' aria-expanded={themeOpen} aria-controls='theme-options' on:click={() => (themeOpen = !themeOpen)}>
            <span class='i-heroicons-outline-color-swatch'></span>
          </button>
          {#if themeOpen}
            <ul id='theme-options' class='absolute right-0 bg-base-100 text-base-content rounded-box p-2 shadow-2xl w-52 overflow-y-auto max-h-80'>
              {#each theme as { name, text }}
                <li><button class='btn btn-ghost w-full justify-start' aria-pressed={currentTheme === name} on:click={() => {
                  currentTheme = name
                  localStorage.setItem('theme', name)
                  themeOpen = false
                  themeButton.focus()
                }}>{text ?? name}</button></li>
              {/each}
            </ul>
          {/if}
        </div>
      </div>
    </div>
  {:else}
    <div class='navbar' in:fly={{ delay: 300, duration: 300, x: 50 }} out:fly={{ duration: 300, x: 50 }}>
      <Search />
      <button aria-label='Close search' class='btn btn-square btn-ghost' on:click={() => toggleSearch(!search)} tabindex='0'>
        <span class='i-heroicons-outline-x'></span>
      </button>
    </div>
  {/if}
</header>

<button
  aria-label='scroll to top'
  class="fixed grid group btn backdrop-blur-sm z-50 duration-500 ease-in-out btn-circle btn-lg border-none bottom-6 right-6 {percent > 95
    ? 'btn-accent shadow-lg'
    : 'btn-ghost bg-base-100/30 md:bg-base-200/30'}"
  class:opacity-100={scrollY}
  class:translate-y-24={!pin || scrollY === 0}
  id='totop'
  tabindex={pin && scrollY > 0 ? 0 : -1}
  on:click={() => window.scrollTo(0, 0)}>
  <!-- https://daisyui.com/blog/how-to-update-daisyui-4/#3-all--focus-colors-are-removed -->
  <div
    class='transition-all duration-500 ease-in-out radial-progress text-accent group-hover:text-[color-mix(in_oklab,var(--color-accent),black_7%)] col-start-1 row-start-1'
    style={`--size:4rem; --thickness: 0.25rem; --value:${percent};`}></div>
  <div
    class='col-start-1 row-start-1 rounded-full w-full grid duration-500 ease-in-out border-base-content/10 p-4 h-full border-4 group-hover:border-transparent'
    class:border-transparent={percent > 95}>
    <span class='!w-6 !h-6 i-heroicons-solid-chevron-up'></span>
  </div>
</button>
