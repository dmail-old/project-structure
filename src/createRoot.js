import { createLocationMeta } from "./createLocationMeta.js"
import { forEachFileMatching } from "./forEachFileMatching.js"

const CONFIG_FILE_NAME = "structure.config.js"

export const loadMetasForRoot = (root) => {
  return new Promise((resolve, reject) => {
    const filename = `${root}/${CONFIG_FILE_NAME}`

    let value
    let errored = false
    try {
      // eslint-disable-nextline no-dynamic-require
      value = require(filename)
    } catch (e) {
      value = e
      errored = true
    }

    if (errored) {
      const error = value
      if (error && error.code === "MODULE_NOT_FOUND") {
        return reject(new Error(`${filename} not found`))
      }
      if (error && error.code === "SYNTAX_ERROR") {
        console.error(`${filename} contains a syntax error`)
        return reject(error)
      }
      if (error && error.code === "REFERENCE_ERROR") {
        console.error(`${filename} contains a reference error`)
        return reject(error)
      }
      return reject(error)
    }

    const namespace = value
    const namespaceType = typeof namespace
    if (namespaceType !== "object") {
      return reject(new TypeError(`${filename} must export an object, got ${namespaceType}`))
    }

    resolve(namespace.metas || {})
  })
}

export const createRoot = ({
  root,
  loadMetas = loadMetasForRoot,
  getLocationMeta = () => createLocationMeta(),
}) => {
  return Promise.resolve()
    .then(() => loadMetas(root))
    .then((metas) => {
      const locationMeta = getLocationMeta()

      Object.keys(metas).forEach((metaName) => {
        const metaPatterns = metas[metaName]
        Object.keys(metaPatterns).forEach((pattern) => {
          const metaValue = metaPatterns[pattern]
          locationMeta.addMetaAtPattern(pattern, { [metaName]: metaValue })
        })
      })

      const scopedForEachFileMatching = (predicate, callback) =>
        forEachFileMatching(locationMeta, root, predicate, callback)

      const listFileMatching = (predicate) =>
        forEachFileMatching(locationMeta, root, predicate, ({ relativeName }) => relativeName)

      return {
        ...locationMeta,
        forEachFileMatching: scopedForEachFileMatching,
        listFileMatching,
      }
    })
}
