import fs from "fs"

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

export const forEachFileMatching = (
  { getMetaForLocation, canContainsMetaMatching },
  root,
  metaPredicate,
  callback,
) => {
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
              if (canContainsMetaMatching(ressourceRelativeLocation, metaPredicate) === false) {
                return [nothingToDo]
              }
              return visit(ressourceRelativeLocation)
            }

            const meta = getMetaForLocation(ressourceRelativeLocation)
            if (metaPredicate(meta)) {
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
