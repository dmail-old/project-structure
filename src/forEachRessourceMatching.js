import fs from "fs"
import { ressourceCanContainsMetaMatching } from "./ressourceCanContainsMetaMatching.js"
import { ressourceToMeta } from "./ressourceToMeta.js"

// TODO: when using node 10.0 convert this to async generator
export const forEachRessourceMatching = async ({
  localRoot,
  metaMap,
  predicate,
  callback = (ressource) => ressource,
}) => {
  if (typeof localRoot !== "string") {
    throw new TypeError(`forEachRessourceMatching localRoot must be a string, got ${localRoot}`)
  }
  if (typeof metaMap !== "object") {
    throw new TypeError(`forEachRessourceMatching metaMap must be a object, got ${metaMap}`)
  }
  if (typeof predicate !== "function") {
    throw new TypeError(`forEachRessourceMatching predicate must be a function, got ${predicate}`)
  }
  if (typeof callback !== "function") {
    throw new TypeError(`forEachRessourceMatching callback must be a function, got ${callback}`)
  }

  const results = []
  const visitFolder = async (folder) => {
    const folderAbsolute = folder ? `${localRoot}/${folder}` : localRoot

    const names = await readDirectory(folderAbsolute)

    await Promise.all(
      names.map(async (name) => {
        const ressource = folder ? `${folder}/${name}` : name

        const ressourceAbsolute = `${localRoot}/${ressource}`
        const stat = await readStat(ressourceAbsolute)

        if (stat.isDirectory()) {
          if (!ressourceCanContainsMetaMatching(metaMap, ressource, predicate)) {
            return null
          }
          return visitFolder(ressource)
        }

        const meta = ressourceToMeta(metaMap, ressource)
        if (!predicate(meta)) {
          return null
        }

        const result = await callback(ressource, meta)
        results.push(result)
        return null
      }),
    )
  }

  await visitFolder()

  return results
}

const readDirectory = (dirname) =>
  new Promise((resolve, reject) => {
    fs.readdir(dirname, (error, names) => {
      if (error) {
        reject(error)
      } else {
        resolve(names)
      }
    })
  })

const readStat = (filename) =>
  new Promise((resolve, reject) => {
    fs.stat(filename, (error, stat) => {
      if (error) {
        reject(error)
      } else {
        resolve(stat)
      }
    })
  })
