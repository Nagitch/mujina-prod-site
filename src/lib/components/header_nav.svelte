<script lang='ts'>
  export let nav: { children?: { link: string, text: string }[], link?: string, text: string }[]
  export let path: string
  export let title: string
  export let scrollY: number
  export let pin: boolean
  let open = false
  let button: HTMLButtonElement
  $: if (!pin)
    open = false
  $: if (path)
    open = false
</script>

<svelte:window on:keydown={(event) => {
  if (event.key === 'Escape' && open) {
    open = false
    button?.focus()
  }
}} />
<nav class='lg:order-last' aria-label='メインナビゲーション'>
  <button bind:this={button} class='btn btn-ghost btn-square lg:hidden' aria-label='メニュー' aria-expanded={open} aria-controls='navbar-links' on:click={() => (open = !open)}>
    <span class='i-heroicons-outline-menu-alt-1'></span>
  </button>
  <ul id='navbar-links' class='menu lg:menu-horizontal max-lg:absolute max-lg:bg-base-100 max-lg:rounded-box max-lg:shadow-lg max-lg:min-w-40' class:mobile-closed={!open}>
    {#each nav as { children, link, text }}
      {#if link && !children}
        <li><a class:font-bold={link === path} aria-current={link === path ? 'page' : undefined} href={link} on:click={() => (open = false)}>{text}</a></li>
      {:else if children}
        <li><details><summary>{text}</summary><ul class='bg-base-100 rounded-box'>
          {#each children as { link, text }}
            <li><a href={link} aria-current={link === path ? 'page' : undefined} on:click={() => (open = false)}>{text}</a></li>
          {/each}
        </ul></details></li>
      {/if}
    {/each}
  </ul>
  {#if scrollY > 32 && title}
    <button class='sr-only focus:not-sr-only btn' on:click={() => window.scrollTo(0, 0)}>{title}の先頭へ</button>
  {/if}
</nav>

<style>
  @media (max-width: 1023px) { .mobile-closed { display: none; } }
</style>
