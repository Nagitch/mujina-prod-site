import assert from 'node:assert/strict'
import { execFileSync } from 'node:child_process'
import { createHash } from 'node:crypto'
import fs from 'node:fs/promises'
import process from 'node:process'

const tracked = execFileSync('git', ['ls-files', '-z'], { encoding: 'utf8' }).split('\0').filter(Boolean)
const fingerprint = async () => Object.fromEntries(await Promise.all(tracked.map(async file => [
  file,
  createHash('sha256').update(await fs.readFile(file)).digest('hex'),
])))
const before = await fingerprint()
for (let i = 0; i < 2; i++) {
  execFileSync('pnpm', ['build'], { stdio: 'inherit' })
  assert.deepEqual(await fingerprint(), before, `Build ${i + 1} modified tracked source`)
  for (const file of ['index.html', 'blog/index.html', 'portfolio/index.html', 'sitemap.xml', 'atom.xml', 'manifest.webmanifest', 'sw.js'])
    assert.ok((await fs.stat(`build/${file}`)).size > 0, `Missing build/${file}`)
  const posts = JSON.parse(await fs.readFile('build/posts.json', 'utf8'))
  assert.ok(posts.length > 0, 'No generated posts')
  for (const post of posts)
    await fs.access(`build${post.path}/index.html`)
}
console.info('Two builds passed; tracked source and all published post routes are intact.')

execFileSync('pnpm', ['build'], { env: { ...process.env, VERCEL: '1' }, stdio: 'inherit' })
assert.deepEqual(await fingerprint(), before, 'Vercel build modified tracked source')
const config = JSON.parse(await fs.readFile('.vercel/output/config.json', 'utf8'))
assert.equal(config.version, 3)
const functionFiles = await fs.readdir('.vercel/output/functions', { recursive: true })
const runtimeFiles = functionFiles.filter(file => file.endsWith('.vc-config.json'))
assert.ok(runtimeFiles.length > 0, 'Missing Vercel fallback function')
for (const file of runtimeFiles) {
  const runtime = JSON.parse(await fs.readFile(`.vercel/output/functions/${file}`, 'utf8'))
  assert.equal(runtime.runtime, 'nodejs24.x')
}
console.info('Vercel output uses Node 24 and preserves tracked source.')
