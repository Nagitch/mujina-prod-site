import assert from 'node:assert/strict'
import { spawn } from 'node:child_process'
import fs from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'
import process from 'node:process'
import { it } from 'node:test'
import { setTimeout as delay } from 'node:timers/promises'
import { fileURLToPath } from 'node:url'

import { ContentFiles } from '../scripts/content-files.mjs'

async function fixture(t) {
  const root = await fs.mkdtemp(path.join(os.tmpdir(), 'urara-test-'))
  t.after(() => fs.rm(root, { force: true, recursive: true }))
  const write = async (name, data) => {
    const file = path.join(root, name)
    await fs.mkdir(path.dirname(file), { recursive: true })
    await fs.writeFile(file, data)
  }
  await write('src/routes/blog/+page.svelte', '<h1>Authored blog index</h1>')
  await write('urara/blog/article/+page.md', '# Article')
  await write('urara/blog/article/image.png', 'image')
  return { content: new ContentFiles(root), root, write }
}

it('repeated build/clean preserves authored siblings and cleans only owned files', async (t) => {
  const { content, root, write } = await fixture(t)
  await write('src/routes/blog/article/notes.txt', 'authored notes')
  for (let i = 0; i < 2; i++) {
    await content.build()
    assert.equal(await fs.readFile(path.join(root, 'src/routes/blog/article/+page.md'), 'utf8'), '# Article')
    assert.equal(await fs.readFile(path.join(root, 'static/blog/article/image.png'), 'utf8'), 'image')
    const resumed = new ContentFiles(root)
    await resumed.load()
    await resumed.clean()
    assert.equal(await fs.readFile(path.join(root, 'src/routes/blog/+page.svelte'), 'utf8'), '<h1>Authored blog index</h1>')
    assert.equal(await fs.readFile(path.join(root, 'src/routes/blog/article/notes.txt'), 'utf8'), 'authored notes')
    await assert.rejects(fs.access(path.join(root, 'src/routes/blog/article/+page.md')))
    await content.load()
  }
})

it('deleted source directories are cleaned from the manifest without deleting authored routes', async (t) => {
  const { content, root } = await fixture(t)
  await content.build()
  await fs.rm(path.join(root, 'urara/blog'), { recursive: true })
  await content.removeDirectory('urara/blog')
  assert.equal(await fs.readFile(path.join(root, 'src/routes/blog/+page.svelte'), 'utf8'), '<h1>Authored blog index</h1>')
  assert.deepEqual(content.files, {})
})

it('cleanup after source deletion survives a new process', async (t) => {
  const { content, root } = await fixture(t)
  await content.build()
  await fs.rm(path.join(root, 'urara'), { recursive: true })
  const resumed = new ContentFiles(root)
  await resumed.load()
  await resumed.clean()
  assert.deepEqual(resumed.files, {})
  await fs.access(path.join(root, 'src/routes/blog/+page.svelte'))
})

it('unowned destinations and modified generated files are preserved', async (t) => {
  const { content, root, write } = await fixture(t)
  await write('src/routes/blog/article/+page.md', 'authored')
  await assert.rejects(content.build(), /unowned or edited/)
  assert.equal(await fs.readFile(path.join(root, 'src/routes/blog/article/+page.md'), 'utf8'), 'authored')
  await fs.rm(path.join(root, 'src/routes/blog/article/+page.md'))
  await content.build()
  await write('src/routes/blog/article/+page.md', 'edited output')
  await assert.rejects(content.clean(), /unowned or edited/)
  assert.equal(await fs.readFile(path.join(root, 'src/routes/blog/article/+page.md'), 'utf8'), 'edited output')
})

it('manifest traversal and symlink destinations cannot escape generated roots', async (t) => {
  const { content, root, write } = await fixture(t)
  await write('.urara-generated.json', JSON.stringify({ '../outside': 'hash' }))
  await assert.rejects(content.load(), /Invalid generated path/)
  await write('.urara-generated.json', '{}')
  await content.load()
  await fs.symlink(path.join(root, 'urara/blog/article'), path.join(root, 'src/routes/blog/article'))
  await assert.rejects(content.build(), /symlink/)
})

it('watch serializes updates, removes deleted content, and preserves source on shutdown', async (t) => {
  const { root, write } = await fixture(t)
  const script = fileURLToPath(new URL('../urara.js', import.meta.url))
  const watcher = spawn(process.execPath, [script, 'watch'], { cwd: root, env: { ...process.env, CHOKIDAR_INTERVAL: '50', CHOKIDAR_USEPOLLING: '1' }, stdio: 'pipe' })
  let stdout = ''
  watcher.stdout.on('data', chunk => stdout += chunk)
  let stderr = ''
  watcher.stderr.on('data', chunk => stderr += chunk)
  const exited = new Promise(resolve => watcher.once('exit', code => resolve(code)))
  t.after(async () => {
    if (watcher.exitCode === null) {
      watcher.kill('SIGKILL')
      await exited
    }
  })
  const waitFor = async (predicate) => {
    for (let i = 0; i < 100; i++) {
      if (await predicate())
        return
      await delay(50)
    }
    assert.fail(`Watcher condition timed out: ${stderr}`)
  }
  const generated = path.join(root, 'src/routes/blog/article/+page.md')
  await waitFor(async () => (await fs.readFile(generated, 'utf8').catch(() => '')) === '# Article')
  await waitFor(async () => stdout.includes('Content watcher ready'))
  await write('urara/blog/article/+page.md', '# Changed')
  await waitFor(async () => (await fs.readFile(generated, 'utf8').catch(() => '')) === '# Changed')
  await fs.rm(path.join(root, 'urara/blog'), { recursive: true })
  await waitFor(async () => !(await fs.access(generated).then(() => true, () => false)))
  watcher.kill('SIGTERM')
  assert.equal(await exited, 0)
  assert.equal(stderr, '')
  await fs.access(path.join(root, 'src/routes/blog/+page.svelte'))
})
