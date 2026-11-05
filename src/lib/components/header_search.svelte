<script lang='ts'>
  import { header as headerConfig } from '#lib/config/general.ts'
  import { site } from '#lib/config/site.ts'
</script>

<form
  action={headerConfig?.search?.provider === 'duckduckgo' ? '//duckduckgo.com/' : '//google.com/search'}
  id='site-search-form'
  role='search'
  class='flex-1'
  method='get'>
  <input
    class='transition-all w-full input input-ghost xl:bg-base-100 xl:text-base-content h-12'
    id='site-search'
    aria-label='このサイトを検索'
    name='q'
    type='text' />
  <input
    name={headerConfig?.search?.provider === 'duckduckgo' ? 'sites' : 'sitesearch'}
    type='hidden'
    value={site.protocol + site.domain} />
  <button aria-label='Search' class='btn btn-square btn-ghost ml-2' type='submit'>
    <span class='i-heroicons-outline-search'></span>
  </button>
</form>
