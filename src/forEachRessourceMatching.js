import fs from "fs"
import { ressourceCanContainsMetaMatching } from "./ressourceCanContainsMetaMatching.js"
import { ressourceToMeta } from "./ressourceToMeta.js"

const nothingToDo = {}

export const forEachRessourceMatching = async (root, metaMap, predicate, callback) => {
  if (typeof root !== "string") {
    throw new TypeError(`forEachRessourceMatching root must be a string, got ${root}`)
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

  const visitFolder = async (folder) => {
    const folderAbsolute = folder ? `${root}/${folder}` : root

    const names = await readDirectory(folderAbsolute)

    const results = await Promise.all(
      names.map(async (name) => {
        const ressource = folder ? `${folder}/${name}` : name

        const ressourceAbsolute = `${root}/${ressource}`
        const stat = await readStat(ressourceAbsolute)

        if (stat.isDirectory()) {
          if (!ressourceCanContainsMetaMatching(metaMap, ressource, predicate)) {
            return [nothingToDo]
          }
          return visitFolder(ressource)
        }

        const meta = ressourceToMeta(metaMap, ressource)
        if (!predicate(meta)) {
          return [nothingToDo]
        }

        const result = await callback(ressource, meta)
        return [result]
      }),
    )

    return results.reduce((previous, results) => {
      return [...previous, ...results]
    }, [])
  }

  const allResults = await visitFolder()
  return allResults.filter((result) => result !== nothingToDo)
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
