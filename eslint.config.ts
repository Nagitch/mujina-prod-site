import antfu from '@antfu/eslint-config'

export default antfu({
  ignores: ['urara/slides/**/libs/**', 'build/**', 'static/**', 'src/static/**', 'urara.js', '.urara-generated.json'],
  // Preserve supported legacy components and root-hosted URLs during the dependency migration.
  svelte: { overrides: {
    'import/no-mutable-exports': 'off', // export let declares legacy Svelte props.
    'svelte/require-each-key': 'off', // Existing lists intentionally retain unkeyed semantics.
    'svelte/no-navigation-without-resolve': 'off', // This site has no base-path deployment.
  } },
  test: false, // This repository uses node:test, not Vitest.
  typescript: true,
  unocss: true,
  rules: { 'antfu/no-top-level-await': 'off' }, // Node 24 ESM CLI scripts await filesystem work.
})
