<script lang='ts'>
  let className = ''
  export { className as class }
  export let in_reply_to: Urara.Post['in_reply_to']
</script>

<div class='flex flex-wrap gap-2 rounded-box p-4 outline outline-neutral/10 {className}'>
  <span class='flex-none font-bold uppercase opacity-30'>Reply to:&nbsp;</span>
  <a
    class='ml-auto flex-none flex transition-all gap-2 rounded-badge bg-base-200 hover:bg-base-300 px-4 u-in-reply-to'
    href={in_reply_to}
    rel='noopener noreferrer external'
    target='_blank'>
    <span class='my-auto !w-4 !h-4 i-heroicons-outline-reply'></span>
    {in_reply_to}
  </a>
</div>
