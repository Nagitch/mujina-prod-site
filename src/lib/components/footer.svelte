<script lang='ts'>
  import { footer as footerConfig } from '$lib/config/general'
  import { site } from '$lib/config/site'

  let className: string = ''
  export { className as class }
  export let sticky: boolean = false
  export let rounded: boolean = false
</script>

<footer
  class="bg-base-300 text-base-content shadow-inner footer footer-center p-8{rounded
    ? 'rounded-box'
    : 'md:rounded-box'} {sticky ? 'sticky bottom-0 z-0 md:static' : ''} {className ?? ''}"
  id='footer'>
  <div class='prose'>
    <p>
      {#if footerConfig.nav}
        {#each footerConfig.nav as { link, text }, i}
          <a href={link} rel='noopener noreferrer external' target='_blank'>{text}</a>
          {#if i + 1 < footerConfig.nav.length}
            <span class='mr-1'>·</span>
          {/if}
        {/each}
        <br />
      {/if}
      Copyright © {footerConfig.since && footerConfig.since !== new Date().toJSON().substring(0, 4)
        ? `${footerConfig.since} - ${new Date().toJSON().substring(0, 4)}`
        : new Date().toJSON().substring(0, 4)}
      {site.author.name}
      <br />
      Powered by
      <a
        class='tooltip tooltip-secondary hover:text-secondary'
        data-tip='🌸 [Polaris] - Based on MDsveX & SvelteKit 🌸'
        href='https://github.com/importantimport/urara'
        rel='noopener noreferrer external'
        target='_blank'>
        Urara
      </a>
      {#if footerConfig.html}
        <br />
        <!-- Trusted HTML authored in the repository footer configuration. -->
        <!-- eslint-disable-next-line svelte/no-at-html-tags -->
        {@html footerConfig.html}
      {/if}
    </p>
  </div>
</footer>
