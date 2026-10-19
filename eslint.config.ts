import antfu from '@antfu/eslint-config'
import ii from '@importantimport/eslint-config'

export default antfu({
  ignores: ['urara/slides/**/libs/**', 'build/**', 'static/**', 'src/static/**', 'urara.js', '.urara-generated.json'],
  svelte: true,
  test: false, // This repository uses node:test, not Vitest.
  typescript: true,
  unocss: true,
}).append(ii({ functional: false }))
