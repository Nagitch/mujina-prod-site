import process from 'node:process'
import chokidar from 'chokidar'

import { ContentFiles } from './scripts/content-files.mjs'

const content = new ContentFiles()
await content.load()

switch (process.argv[2]) {
  case 'build':
    await content.clean()
    await content.build()
    break
  case 'clean':
    await content.clean()
    break
  case 'watch': {
    await content.clean()
    let pending = Promise.resolve()
    const watcher = chokidar.watch('urara', {
      ignored: /(^|[/\\])\../,
    })
    const enqueue = (operation: () => Promise<void>) => {
      pending = pending.then(operation).catch((error) => {
        console.error(error)
        process.exitCode = 1
      })
    }
    watcher
      .on('add', source => enqueue(() => content.copy(source)))
      .on('change', source => enqueue(() => content.copy(source)))
      .on('unlink', source => enqueue(() => content.removeSource(source)))
      .on('unlinkDir', source => enqueue(() => content.removeDirectory(source)))
      .on('error', error => console.error(error))
      .on('ready', () => enqueue(async () => {
        // eslint-disable-next-line no-console
        console.info('Content watcher ready')
      }))
    let stopping = false
    const stop = async () => {
      if (stopping)
        return
      stopping = true
      await watcher.close()
      await pending
      await content.clean()
    }
    process.once('SIGINT', stop)
    process.once('SIGTERM', stop)
    break
  }
  default:
    throw new Error('Expected build, clean or watch')
}
