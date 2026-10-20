import assert from 'node:assert/strict'
import { Buffer } from 'node:buffer'
import fs from 'node:fs/promises'
import postcss from 'postcss'

export async function verifyStyles() {
  const files = (await fs.readdir('build/_app/immutable/assets')).filter(file => file.endsWith('.css'))
  const css = (await Promise.all(files.map(file => fs.readFile(`build/_app/immutable/assets/${file}`, 'utf8')))).join('\n')
  const root = postcss.parse(css)
  root.walkAtRules(rule => assert(!['apply', 'plugin', 'tailwind', 'source'].includes(rule.name), `Uncompiled CSS directive: ${rule.name}`))
  for (const theme of ['cmyk', 'dracula', 'valentine', 'aqua', 'synthwave', 'night', 'lofi', 'lemonade', 'cupcake', 'garden', 'retro', 'black', 'mujinaprod'])
    assert(css.includes(`data-theme=${theme}`) || css.includes(`data-theme="${theme}"`), `Missing theme ${theme}`)
  for (const marker of ['--color-primary', '--color-base-100', '--tw-prose-code', '--tw-prose-th-borders', '.card-body', '.prose pre', 'input[type=checkbox]', 'prefers-reduced-motion'])
    assert(css.includes(marker), `Missing article/theme style ${marker}`)
  assert(!/var\(--(?:[pan]|pc|ac|nc|b1|b2|b3|bc)\)/.test(css), 'Legacy daisyUI variables remain')
  console.info(`Compiled article styles and all 13 themes verified (${Buffer.byteLength(css)} CSS bytes).`)
}
