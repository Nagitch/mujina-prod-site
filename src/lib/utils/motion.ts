import type { FlyParams } from 'svelte/transition'
import { fly as svelteFly } from 'svelte/transition'

export function fly(node: Element, options: FlyParams = {}) {
  const reduced = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
  return svelteFly(node, reduced ? { ...options, delay: 0, duration: 0, x: 0, y: 0 } : options)
}
