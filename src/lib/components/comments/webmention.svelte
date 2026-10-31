<script lang='ts'>
  import type { WebmentionConfig } from '#lib/types/post.ts'

  import { onMount } from 'svelte'
  import { canonicalPage, LEGACY_ORIGIN } from '#lib/utils/urls.ts'

  export let config: WebmentionConfig
  export let post: Urara.Post

  interface WebmentionEntry {
    'author'?: {
      name?: string
      photo?: string
      url?: string
    }
    'content'?: {
      html?: string
      text?: string
    }
    'published'?: string
    'rsvp'?: string
    'url': string
    'wm-id': number
    'wm-private': boolean
    'wm-property': 'bookmark-of' | 'in-reply-to' | 'like-of' | 'mention-of' | 'repost-of' | 'rsvp'
    'wm-received': string
    'wm-source': string
    'wm-target': string
  }

  interface WebmentionFeed {
    children: WebmentionEntry[]
    name: 'Webmentions'
    type: 'feed'
  }

  let [page, loaded, end, mentions, sortDirUp]: [number, boolean, boolean, WebmentionEntry[], boolean] = [
    0,
    false,
    false,
    [],
    config?.sortDir === 'up',
  ]

  const load = async () =>
    await fetch(
      `https://webmention.io/api/mentions.jf2?page=${page}&per-page=${config?.perPage ?? '20'}&sort-by=${
        config?.sortBy ?? 'created'
      }&sort-dir=${sortDirUp ? 'up' : 'down'}${
        config?.property && config.property.forEach(wmProperty => `&wm-property=${wmProperty}`)
      }&target[]=${encodeURIComponent(canonicalPage(post.path))}&target[]=${encodeURIComponent(`${LEGACY_ORIGIN}${post.path}`)}&target[]=${encodeURIComponent(`${LEGACY_ORIGIN}${post.path}/`)}`,
    )
      .then(res => res.json())
      .then((feed: WebmentionFeed) => {
        if (feed.children.length < 10)
          end = true
        feed = {
          ...feed,
          children: feed.children.filter(
            (entry: WebmentionEntry) => !config.blockList?.includes(new URL(entry['wm-source']).origin),
          ),
        }
        if (feed.children.length > 0)
          mentions = [...mentions, ...feed.children]
        page++
        loaded = true
      })

  const reset = async () => {
    page = 0
    loaded = false
    end = false
    mentions = []
    await load()
  }

  onMount(() => load())

  // format a date-like string as YYYY-MM-DD (zero-padded)
  function formatYMD(d?: string): string {
    if (!d)
      return ''
    const dt = new Date(d)
    if (Number.isNaN(dt.getTime())) {
      // fallback: try to slice (if it's ISO-like)
      return d.slice(0, 10)
    }
    const y = dt.getFullYear()
    const m = String(dt.getMonth() + 1).padStart(2, '0')
    const day = String(dt.getDate()).padStart(2, '0')
    return `${y}-${m}-${day}`
  }
</script>

<div class='flex flex-col gap-8'>
  <div class='flex'>
    <p class='flex-1 m-auto opacity-50 italic'>
      {`sort-by=${config?.sortBy ?? 'created'}&sort-dir=${sortDirUp ? 'up' : 'down'}`}
    </p>
    <button
      class='btn btn-ghost btn-sm float-right'
      on:click={() => {
        sortDirUp = !sortDirUp
        reset()
      }}>
      {#if sortDirUp === true}
        <span class='i-heroicons-outline-sort-ascending'></span>
      {:else}
        <span class='i-heroicons-outline-sort-descending'></span>
      {/if}
    </button>
  </div>
  {#key mentions}
    {#each mentions as mention}
      {@const [wmProperty, borderColor, textColor, tooltipColor] = {
        'bookmark-of': ['⭐️ bookmarked', 'border-neutral/50', 'text-neutral', 'tooltip-neutral'],
        'in-reply-to': ['💬 replied', 'border-primary/50', 'text-primary', 'tooltip-primary'],
        'like-of': ['❤️ liked', 'border-secondary/50', 'text-secondary', 'tooltip-secondary'],
        'mention-of': ['💬 mentioned', 'border-base-300/50', 'text-base-content', 'tooltip-base-content'],
        'repost-of': ['🔄 reposted', 'border-accent/50', 'text-accent', 'tooltip-accent'],
        'rsvp': [
          `📅 RSVPed ${
            mention.rsvp && {
              interested: '💡',
              maybe: '💭',
              no: '❌',
              yes: '✅',
            }[mention.rsvp]
          }`,
          'border-warning/50',
          'text-warning',
          'tooltip-warning',
        ],
      }[mention['wm-property']]}
      {#if mention.url !== null}
        <div class='{borderColor} border-2 rounded-box p-4'>
          <div class='flex bg-base-200 rounded-btn'>
            {#if mention?.author?.photo}
              <img
                alt={mention.author?.name ?? new URL(mention.url).host}
                class='h-12 flex-none rounded-btn w-12'
                decoding='async'
                loading='lazy'
                src={mention.author.photo} />
            {/if}
            <div class='flex-1 px-4 m-auto py-2'>
              <p>
                {#if mention?.author?.url}
                  <a class='font-semibold {textColor} hover:underline' href={mention.author.url}>
                    {mention.author?.name ?? new URL(mention.url).host}
                  </a>
                {:else}
                  {mention?.author?.name ?? new URL(mention.url).host}
                {/if}
                <a class='{textColor} hover:underline' href={mention['wm-source']}>
                  {wmProperty}
                </a>
                this post on
                <span
                  class='tooltip tooltip-bottom xl:tooltip-right {tooltipColor}'
                  data-tip={formatYMD(mention.published ?? mention['wm-received'])}>
                  {formatYMD(mention.published ?? mention['wm-received'])}
                </span>
              </p>
            </div>
          </div>
          {#if mention.content}
            <div class='prose mt-4 max-w-none break-words'>
              <p>{mention.content.text ?? 'View the original mention for its content.'}</p>
            </div>
          {/if}
        </div>
      {/if}
    {/each}
  {/key}
  {#if loaded === true}
    {#if end !== true}
      <button
        class='btn btn-primary btn-block'
        on:click={() => {
          loaded = false
          load()
        }}>
        LOAD
      </button>
    {:else if config?.form !== true}
      <div class='divider mt-0 -mb-2'>END</div>
    {/if}
  {:else}
    <button class='btn btn-lg btn-block flex btn-ghost loading' aria-label='Loading comments' id='webmention-loading'></button>
  {/if}
  {#if config?.form === true}
    <form action='https://webmention.io/{config.username}/webmention' id='webmention-form' method='post'>
      <input name='target' type='hidden' value={canonicalPage(post.path)} />
      <div class='gap-4 label'>
        <span class='label-text'>send webmentions here:</span>
        {#if config?.commentParade === true}
          <span class='text-right label-text-alt'>
            or <a
              class='hover:!text-primary'
              href='https://quill.p3k.io/?dontask=1&me=https://commentpara.de/&reply={encodeURI(
                canonicalPage(post.path),
              )}'>
              comment anonymously
            </a>
          </span>
        {/if}
      </div>
      <div class='flex gap-2'>
        <div class='flex-1'>
          <input
            class='input w-full focus:input-primary'
            id='reply-url'
            name='source'
            placeholder='https://example.com/my-post'
            type='text' />
        </div>
        <button class='btn btn-primary flex-none mt-auto' id='webmention-submit' type='submit'>Send</button>
      </div>
    </form>
  {/if}
</div>
