import assert from 'node:assert/strict'
import { createRequire } from 'node:module'
import test from 'node:test'
import vm from 'node:vm'

const require = createRequire(import.meta.url)
const workbox = createRequire(require.resolve('workbox-build'))

test('Workbox URI validation rejects hosts that WHATWG canonicalization would rewrite', () => {
  const ajv = createRequire(workbox.resolve('ajv'))
  const uri = ajv('fast-uri')
  const valid = uri.parse('https://example.com/path?query=1')
  assert.equal(valid.error, undefined)
  assert.equal(valid.host, 'example.com')
  for (const input of ['http://a@b@evil.example/', 'http://exa\tmple.com/', 'http://exa\rmple.com/', 'http://exa\nmple.com/'])
    assert(uri.parse(input).error, `Malformed host was accepted: ${JSON.stringify(input)}`)
})

test('Workbox terser serializer escapes a trailing script opener in function source', () => {
  const terser = createRequire(workbox.resolve('@rollup/plugin-terser'))
  const serialize = terser('serialize-javascript')
  const source = () => 1
  source.toString = () => 'function f(){ return 1 }//</script'
  const delimiter = () => 2
  delimiter.toString = () => 'function g(){} > <img src=x onerror=alert(1)>'
  const serialized = serialize({ nested: { source }, delimiter }, { space: 2 })
  assert(!serialized.includes('</script'), 'Serialized function can terminate its enclosing script element')

  const restored = vm.runInNewContext(`(${serialize({ answer: () => 42, text: '</script>' })})`)
  assert.equal(restored.answer(), 42)
  assert.equal(restored.text, '</script>')
})
