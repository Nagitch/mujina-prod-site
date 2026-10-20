import assert from 'node:assert/strict'
import fs from 'node:fs/promises'
import { createRequire } from 'node:module'
import test from 'node:test'
import { ESLint } from 'eslint'

const require = createRequire(import.meta.url)
const typography = createRequire(require.resolve('@tailwindcss/typography'))
const antfu = createRequire(require.resolve('@antfu/eslint-config'))
const markdownRequire = createRequire(antfu.resolve('@eslint/markdown'))
const mathRequire = createRequire(markdownRequire.resolve('micromark-extension-math'))

test('scoped selector-parser upgrade preserves typography selector transformations', async () => {
  assert.equal(typography('postcss-selector-parser/package.json').version, '7.1.6')
  const { commonTrailingPseudos } = typography('./utils.js')
  const fixtures = JSON.parse(await fs.readFile(new URL('./fixtures/typography-selectors.json', import.meta.url), 'utf8'))
  for (const { selector, result } of fixtures)
    assert.deepEqual(commonTrailingPseudos(selector), result, selector)
})

test('math extension renders inline/display math and handles invalid TeX with patched KaTeX', async () => {
  assert.equal(mathRequire('katex/package.json').version, '0.18.2')
  const { micromark } = await import(markdownRequire.resolve('micromark'))
  const { math, mathHtml } = await import(markdownRequire.resolve('micromark-extension-math'))
  const render = text => micromark(text, { extensions: [math()], htmlExtensions: [mathHtml({ throwOnError: false, trust: false })] })
  const inline = render('$x^2 + y^2 = z^2$')
  assert.match(inline, /class="katex"/)
  assert.match(inline, /<math /)
  assert.match(inline, /x\^2 \+ y\^2 = z\^2/)
  assert.match(render('$$\n\\frac{1}{2}\n$$'), /katex-display/)
  assert.match(render('$\\invalidcommand{x}$'), /#cc0000|katex-error/)
  assert(!render('$\\href{javascript:alert(1)}{click}$').includes('href="javascript:'))
})

test('Markdown lint continues to parse math and still reports actual Markdown violations', async () => {
  const { default: markdown } = await import(antfu.resolve('@eslint/markdown'))
  const eslint = new ESLint({ overrideConfigFile: true, overrideConfig: [{
    files: ['**/*.md'],
    plugins: { markdown },
    language: 'markdown/gfm',
    languageOptions: { math: true },
    rules: { 'markdown/no-missing-label-refs': 'error' },
  }] })
  const [valid] = await eslint.lintText('# Math\n\nInline $x^2$.\n\n$$\n\\frac{1}{2}\n$$\n', { filePath: 'math-fixture.md' })
  assert.equal(valid.errorCount, 0)
  const [invalid] = await eslint.lintText('[Missing][undefined-label]\n', { filePath: 'math-fixture.md' })
  assert(invalid.messages.some(message => message.ruleId === 'markdown/no-missing-label-refs'))
})
