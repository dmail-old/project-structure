import fs from "fs"
import { ressourceCanContainsMetaMatching } from "./ressourceCanContainsMetaMatching.js"
import { ressourceToMeta } from "./ressourceToMeta.js"

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

const nothingToDo = {}

export const forEachRessourceMatching = (root, metaMap, predicate, callback) => {
  if (typeof root !== "string") {
    throw new TypeError(`forEachRessourceMatching metaMap must be a string, got ${root}`)
  }
  if (typeof metaMap !== "object") {
    throw new TypeError(`forEachRessourceMatching ressource must be a object, got ${metaMap}`)
  }
  if (typeof predicate !== "function") {
    throw new TypeError(`forEachRessourceMatching predicate must be a function, got ${predicate}`)
  }
  if (typeof callback !== "function") {
    throw new TypeError(`forEachRessourceMatching callback must be a function, got ${callback}`)
  }

  const visit = (folderRelativeLocation) => {
    const folderAbsoluteLocation = folderRelativeLocation
      ? `${root}/${folderRelativeLocation}`
      : root

    return readDirectory(folderAbsoluteLocation).then((names) => {
      return Promise.all(
        names.map((name) => {
          const ressourceRelativeLocation = folderRelativeLocation
            ? `${folderRelativeLocation}/${name}`
            : name
          const ressourceAbsoluteLocation = `${root}/${ressourceRelativeLocation}`

          return readStat(ressourceAbsoluteLocation).then((stat) => {
            if (stat.isDirectory()) {
              if (
                ressourceCanContainsMetaMatching(metaMap, ressourceRelativeLocation, predicate) ===
                false
              ) {
                return [nothingToDo]
              }
              return visit(ressourceRelativeLocation)
            }

            const meta = ressourceToMeta(metaMap, ressourceRelativeLocation)
            if (predicate(meta)) {
              return Promise.resolve(
                callback({
                  absoluteName: ressourceAbsoluteLocation,
                  relativeName: ressourceRelativeLocation,
                  meta,
                }),
              ).then((result) => {
                return [result]
              })
            }
            return [nothingToDo]
          })
        }),
      ).then((results) => {
        return results.reduce((previous, results) => {
          return [...previous, ...results]
        }, [])
      })
    })
  }
  return visit().then((allResults) => {
    return allResults.filter((result) => result !== nothingToDo)
  })
}
