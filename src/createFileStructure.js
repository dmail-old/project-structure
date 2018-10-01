import { createStructure } from "./createStructure.js"
import { forEachFileMatching } from "./forEachFileMatching.js"

const CONFIG_FILE_NAME = "structure.config.js"

const loadConfigFile = (filename) => {
  return new Promise((resolve, reject) => {
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

    resolve(namespace || {})
  })
}

export const convertConfigIntoStructure = (config) => {
  const structure = createStructure()
  const metas = config.metas || {}

  Object.keys(metas).forEach((metaName) => {
    const metaPatterns = metas[metaName]
    Object.keys(metaPatterns).forEach((pattern) => {
      const metaValue = metaPatterns[pattern]
      structure.addMetaAtPattern(pattern, { [metaName]: metaValue })
    })
  })

  return structure
}

export const createFileStructure = ({ root, config = CONFIG_FILE_NAME }) => {
  return loadConfigFile(`${root}/${config}`)
    .then((config) => {
      return convertConfigIntoStructure(config)
    })
    .then((structure) => {
      const scopedForEachFileMatching = (predicate, callback) =>
        forEachFileMatching(structure, root, predicate, callback)

      const listFileMatching = (predicate) =>
        forEachFileMatching(structure, root, predicate, ({ relativeName }) => relativeName)

      return {
        ...structure,
        forEachFileMatching: scopedForEachFileMatching,
        listFileMatching,
      }
    })
}
