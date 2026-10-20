<script lang='ts'>
  import type { LayoutData } from './$types'
  import { browser, dev } from '$app/environment'
  import Head from '$lib/components/head_static.svelte'
  import Header from '$lib/components/header.svelte'
  import Transition from '$lib/components/transition.svelte'
  import { posts, tags } from '$lib/stores/posts'
  import { genTags } from '$lib/utils/posts'
  import { onMount } from 'svelte'

  import 'uno.css'

  import '../app.css'

  export let data: LayoutData

  let { path, res } = data

  $: if (data)
    path = data.path

  posts.set(res)
  tags.set(genTags(res))
  let waiting: ServiceWorker | null = null
  let updateMessage = ''
  let applying = false
  function applyUpdate() {
    applying = true
    waiting?.postMessage({ type: 'APPLY_UPDATE' })
  }
  onMount(() => {
    if (dev || !browser || !('serviceWorker' in navigator))
      return
    let disposed = false
    let timer: ReturnType<typeof setInterval> | undefined
    const controllerChanged = () => {
      if (applying)
        window.location.reload()
      else if (navigator.serviceWorker.controller)
        updateMessage = ''
    }
    const message = (event: MessageEvent) => {
      if (event.data?.type === 'UPDATE_BLOCKED') {
        applying = false
        updateMessage = '読書中のページを守るため、このサイトの他のタブを閉じてから更新してください。'
      }
    }
    navigator.serviceWorker.addEventListener('controllerchange', controllerChanged)
    navigator.serviceWorker.addEventListener('message', message)
    const cleanups: (() => void)[] = []
    navigator.serviceWorker.register('/sw.js', { scope: '/', updateViaCache: 'none' }).then((registration) => {
      if (disposed)
        return
      const ready = () => {
        if (registration.waiting && navigator.serviceWorker.controller) {
          waiting = registration.waiting
          updateMessage = '新しい版を利用できます。読み終えてから更新してください。'
        }
      }
      const found = () => {
        const worker = registration.installing
        if (!worker)
          return
        worker.addEventListener('statechange', ready)
        cleanups.push(() => worker.removeEventListener('statechange', ready))
      }
      ready()
      found()
      registration.addEventListener('updatefound', found)
      cleanups.push(() => registration.removeEventListener('updatefound', found))
      timer = setInterval(() => registration.update().catch(console.error), 60 * 60 * 1000)
    }).catch(console.error)
    return () => {
      disposed = true
      clearInterval(timer)
      cleanups.forEach(cleanup => cleanup())
      navigator.serviceWorker.removeEventListener('controllerchange', controllerChanged)
      navigator.serviceWorker.removeEventListener('message', message)
    }
  })

</script>

<Head />

<Header {path} />

<Transition {path}>
  <slot />
</Transition>

{#if updateMessage}
  <div class='fixed bottom-4 left-4 right-4 z-50 rounded-box bg-base-100 text-base-content shadow-xl p-4 flex flex-wrap items-center gap-4' role='status'>
    <p>{updateMessage}</p>
    <button class='btn btn-primary' disabled={applying} on:click={applyUpdate}>更新して再読み込み</button>
    <button class='btn btn-ghost' on:click={() => (updateMessage = '')}>あとで</button>
  </div>
{/if}
