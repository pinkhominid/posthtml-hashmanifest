import fs from 'fs'
import path from 'path'
import { promisify } from 'util'

const readFileAsync = promisify(fs.readFile);
const attrs = ['src', 'href']
const notEmpty = /.+/
// Using default manifest path of
// https://www.npmjs.com/package/rollup-plugin-entrypoint-hashmanifest
const defaults = { manifest: './entrypoint.hashmanifest.json' }

export default (opts = {}) => tree => new Promise(async (resolve, reject) => {
  opts = Object.assign({}, defaults, opts);

  if (typeof opts.manifest === 'string') { // it's a file path, read it
    try {
      opts.manifest = JSON.parse(await readFileAsync(opts.manifest, { encoding: 'utf8' }))
    } catch(e) {
      reject(e.toString())
      return
    }
  }

  opts.manifest = rebaseManifestPaths(opts)

  const exp = attrs.map(attr => {
    const o = {}
    o[attr] = notEmpty
    return { attrs: o }
  })

  tree.match(
    exp,
    node => {
      let attrValTuple
      attrs.some(attr => {
        const value = opts.manifest[node.attrs[attr]]
        if (value) {
          attrValTuple = [attr, value]
          return true
        }
      })

      if (attrValTuple) node.attrs[attrValTuple[0]] = attrValTuple[1]

      return node
    }
  )
  resolve(tree)
})

function rebaseManifestPaths(opts) {
  if (!opts.rebase) return opts.manifest

  return Object.fromEntries(Object.entries(opts.manifest).map(entry => {
    const origKeyPath = path.parse(entry[0])
    const origValuePath = path.parse(entry[1])

    if (opts.rebase.hasOwnProperty(origKeyPath.dir)) {
      origKeyPath.dir = opts.rebase[origKeyPath.dir]
      entry[0] = path.format(origKeyPath)
    }

    if (opts.rebase.hasOwnProperty(origValuePath.dir)) {
      origValuePath.dir = opts.rebase[origValuePath.dir]
      entry[1] = path.format(origValuePath)
    }

    return entry
  }))
}
