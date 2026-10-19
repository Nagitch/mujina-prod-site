<script lang='ts'>
  import { browser, dev } from '$app/environment'
  import Head from '$lib/components/head_static.svelte'
  import Header from '$lib/components/header.svelte'
  import Transition from '$lib/components/transition.svelte'
  import { posts, tags } from '$lib/stores/posts'
  import { genTags } from '$lib/utils/posts'
  import { onMount } from 'svelte'
  import 'uno.css'
  import { registerSW } from 'virtual:pwa-register'

  import type { LayoutData } from './$types'

  import '../app.pcss'

  export let data: LayoutData

  let { path, res } = data

  $: if (data)
    path = data.path

  posts.set(res)
  tags.set(genTags(res))
  onMount(() => {
    let updateTimer: ReturnType<typeof setInterval> | undefined
    if (!dev && browser) {
      registerSW({
        immediate: true,
        onRegistered: (registration) => {
          if (registration)
            updateTimer = setInterval(() => registration.update().catch(console.error), 198964)
        },
        onRegisterError: error => console.error(error),
      })
    }
    return () => clearInterval(updateTimer)
  })

</script>

<Head />

<Header {path} />

<Transition {path}>
  <slot />
</Transition>
