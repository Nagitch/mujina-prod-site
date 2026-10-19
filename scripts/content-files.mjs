import { createHash } from 'node:crypto'
import fs from 'node:fs/promises'
import path from 'node:path'
import process from 'node:process'

const roots = ['src/routes', 'src/static', 'static']
const digest = data => createHash('sha256').update(data).digest('hex')

// Ownership survives interrupted builds and deleted source content. Never delete a
// directory recursively: authored files can live alongside generated content.
export class ContentFiles {
  constructor(root = process.cwd()) {
    this.root = root
    this.manifest = path.join(root, '.urara-generated.json')
    this.files = {}
  }

  async build(directory = 'urara') {
    const entries = await fs.readdir(path.join(this.root, directory), { withFileTypes: true })
    for (const entry of entries) {
      if (entry.name.startsWith('.'))
        continue
      const source = path.join(directory, entry.name)
      if (entry.isSymbolicLink())
        throw new Error(`Content symlinks are not supported: ${source}`)
      if (entry.isDirectory())
        await this.build(source)
      else
        await this.copy(source)
    }
  }

  async clean() {
    for (const file of Object.keys(this.files))
      await this.remove(file)
  }

  async copy(source) {
    const data = await fs.readFile(path.join(this.root, source))
    for (const file of this.destinations(source)) {
      const target = await this.existing(file)
      await fs.mkdir(path.dirname(target), { recursive: true })
      await fs.writeFile(target, data)
      this.files[file] = digest(data)
      await this.save()
    }
  }

  destinations(source) {
    const relative = path.relative('urara', source).split(path.sep).join('/')
    if (relative.startsWith('../') || path.isAbsolute(relative))
      throw new Error(`Invalid content path: ${source}`)
    if (relative.split('/').some(part => part.startsWith('.')))
      return []
    const ext = path.extname(relative).slice(1)
    if (ext === 'md')
      return [`src/routes/${relative}`]
    if (['avif', 'jpg', 'png', 'webp'].includes(ext))
      return [`src/static/${relative}`, `static/${relative}`]
    return [`static/${relative}`]
  }

  async existing(file) {
    const target = await this.safePath(file)
    try {
      const data = await fs.readFile(target)
      if (!this.files[file] || this.files[file] !== digest(data))
        throw new Error(`Refusing to modify unowned or edited file: ${file}`)
    }
    catch (error) {
      if (error.code !== 'ENOENT')
        throw error
    }
    return target
  }

  async load() {
    try {
      this.files = JSON.parse(await fs.readFile(this.manifest, 'utf8'))
    }
    catch (error) {
      if (error.code !== 'ENOENT')
        throw error
    }
    for (const file of Object.keys(this.files))
      await this.safePath(file)
  }

  async remove(file) {
    if (!Object.hasOwn(this.files, file))
      return
    const target = await this.existing(file)
    await fs.rm(target, { force: true })
    delete this.files[file]
    await this.save()
    let directory = path.dirname(target)
    while (directory !== this.root) {
      try {
        await fs.rmdir(directory)
      }
      catch (error) {
        if (['EEXIST', 'ENOENT', 'ENOTEMPTY'].includes(error.code))
          break
        throw error
      }
      directory = path.dirname(directory)
    }
  }

  async removeDirectory(source) {
    const relative = path.relative('urara', source).split(path.sep).join('/')
    for (const file of Object.keys(this.files)) {
      if (roots.some(root => file.startsWith(`${root}/${relative}/`)))
        await this.remove(file)
    }
  }

  async removeSource(source) {
    for (const file of this.destinations(source))
      await this.remove(file)
  }

  async safePath(file) {
    const normalized = path.posix.normalize(file)
    if (normalized !== file || !roots.some(root => file.startsWith(`${root}/`)))
      throw new Error(`Invalid generated path: ${file}`)
    let current = this.root
    for (const part of file.split('/')) {
      current = path.join(current, part)
      const stat = await fs.lstat(current).catch((error) => {
        if (error.code !== 'ENOENT')
          throw error
      })
      if (stat?.isSymbolicLink())
        throw new Error(`Refusing generated symlink: ${file}`)
    }
    return path.join(this.root, file)
  }

  async save() {
    await fs.writeFile(`${this.manifest}.tmp`, `${JSON.stringify(this.files, null, 2)}\n`)
    await fs.rename(`${this.manifest}.tmp`, this.manifest)
  }
}
