import fs from "fs"
import { createCancellationToken, createOperation } from "@dmail/cancellation"
import { pathnameCanContainsMetaMatching } from "./pathnameCanContainsMetaMatching.js"
import { pathnameToMeta } from "./pathnameToMeta.js"

// when using node 10.0 consider to convert this to async generator ?
export const selectAllFileInsideFolder = async ({
  cancellationToken = createCancellationToken(),
  pathname: entryPathname,
  metaDescription,
  predicate,
  transformFile = (file) => file,
}) => {
  if (typeof entryPathname !== "string")
    throw new TypeError(`pathname must be a string, got ${entryPathname}`)
  if (typeof metaDescription !== "object")
    throw new TypeError(`metaMap must be a object, got ${metaDescription}`)
  if (typeof predicate !== "function")
    throw new TypeError(`predicate must be a function, got ${predicate}`)
  if (typeof transformFile !== "function")
    throw new TypeError(`transformFile must be a function, got ${transformFile}`)

  const results = []

  const visitFolder = async (folderPathname) => {
    const names = await createOperation({
      cancellationToken,
      start: () => readDirectory(folderPathname),
    })

    await Promise.all(
      names.map(async (name) => {
        const pathname = `${folderPathname}/${name}`
        const pathnameRelative = pathnameToRelativePathname(pathname, entryPathname)
        const lstat = await createOperation({
          cancellationToken,
          start: () => readLStat(pathname),
        })

        if (lstat.isDirectory()) {
          if (
            !pathnameCanContainsMetaMatching({
              pathname: pathnameRelative,
              metaDescription,
              predicate,
            })
          )
            return null

          return visitFolder(pathname)
        }

        if (lstat.isFile()) {
          const meta = pathnameToMeta({ pathname: pathnameRelative, metaDescription })
          if (!predicate(meta)) {
            return null
          }

          const result = await createOperation({
            cancellationToken,
            start: () => transformFile({ filenameRelative: pathnameRelative, meta, lstat }),
          })
          results.push(result)
          return null
        }

        // we ignore symlink because entryFolder is recursively traversed
        // so symlinked file will be discovered.
        // Moreover if they lead outside of entryFolder it can become a problem
        // like infinite recursion of whatever.
        // that we could handle using an object of pathname already seen but it will be useless
        // because entryFolder is recursively traversed

        return null
      }),
    )
  }
  await visitFolder(entryPathname)

  return results
}

const pathnameToRelativePathname = (pathname, parentPathname) => {
  return pathname.slice(parentPathname.length + 1)
}

const readDirectory = (pathname) =>
  new Promise((resolve, reject) => {
    fs.readdir(pathname, (error, names) => {
      if (error) {
        reject(error)
      } else {
        resolve(names)
      }
    })
  })

const readLStat = (pathname) =>
  new Promise((resolve, reject) => {
    fs.lstat(pathname, (error, stat) => {
      if (error) {
        reject(error)
      } else {
        resolve(stat)
      }
    })
  })
