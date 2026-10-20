import assert from 'node:assert/strict'
import { spawn, spawnSync } from 'node:child_process'
import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { createServer } from 'node:http'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import process from 'node:process'

// Real tarball installs in fresh stores ensure cached hooks cannot mask a bypass.
const policy = readFileSync(new URL('../pnpm-workspace.yaml', import.meta.url), 'utf8')
const { packageManager } = JSON.parse(readFileSync(new URL('../package.json', import.meta.url)))
const pnpm = process.env.npm_execpath
assert(pnpm, 'Run this check with pnpm verify:install-policy')
const approvedVersion = policy.match(/^\s+esbuild@([^:]+): true$/m)?.[1]
assert(approvedVersion, 'Expected a version-specific esbuild approval')
const root = mkdtempSync(join(tmpdir(), 'site-install-policy-'))

try {
  for (const [name, version, allowed, rejected] of [
    ['esbuild', approvedVersion, true, false],
    ['esbuild', '0.0.0', false, true],
    ['unreviewed-policy-canary', '1.0.0', false, true],
    ['fsevents', '1.0.0', false, false],
  ]) {
    const project = join(root, `${name}-${version}`)
    const fixture = join(project, 'fixture')
    const marker = join(project, 'hook-ran')
    mkdirSync(join(fixture, 'package'), { recursive: true })
    writeFileSync(join(fixture, 'package', 'package.json'), JSON.stringify({
      name,
      version,
      scripts: { postinstall: 'node install.cjs' },
    }))
    writeFileSync(join(fixture, 'package', 'install.cjs'), `require('node:fs').writeFileSync(${JSON.stringify(marker)}, 'executed')`)
    const archive = join(project, 'fixture.tgz')
    const packed = spawnSync('tar', ['-czf', archive, '-C', fixture, 'package'], { encoding: 'utf8' })
    assert.equal(packed.status, 0, packed.stderr)
    // A loopback registry exercises version matchers, unlike file: tarballs.
    const server = createServer((request, response) => {
      if (request.url === '/fixture.tgz') {
        response.end(readFileSync(archive))
        return
      }
      response.setHeader('Content-Type', 'application/json')
      response.end(JSON.stringify({
        name,
        'dist-tags': { latest: version },
        'versions': {
          [version]: {
            name,
            version,
            dist: { tarball: `http://127.0.0.1:${server.address().port}/fixture.tgz` },
          },
        },
      }))
    })
    await new Promise(resolve => server.listen(0, '127.0.0.1', resolve))
    writeFileSync(join(project, 'package.json'), JSON.stringify({
      private: true,
      packageManager,
      dependencies: { [name]: version },
    }))
    writeFileSync(join(project, 'pnpm-workspace.yaml'), policy)
    let output = ''
    let status
    try {
      const child = spawn(process.execPath, [
        pnpm,
        'install',
        '--no-frozen-lockfile',
        '--registry',
        `http://127.0.0.1:${server.address().port}`,
        '--store-dir',
        join(project, 'store'),
      ], { cwd: project, env: { ...process.env, CI: 'true' } })
      child.stdout.on('data', data => output += data)
      child.stderr.on('data', data => output += data)
      status = await new Promise((resolve, reject) => {
        child.on('error', reject)
        child.on('close', resolve)
      })
    }
    finally {
      await new Promise(resolve => server.close(resolve))
    }
    assert.equal(existsSync(marker), allowed, `${name}@${version}: unexpected hook execution\n${output}`)
    if (rejected) {
      assert.notEqual(status, 0, output)
      assert.match(output, /ERR_PNPM_IGNORED_BUILDS/, output)
    }
    else {
      assert.equal(status, 0, output)
    }
    console.log(`${name}@${version}: ${allowed ? 'approved hook ran' : rejected ? 'unreviewed hook blocked; install failed' : 'denied hook skipped'}`)
  }
}
finally {
  rmSync(root, { recursive: true, force: true })
}
