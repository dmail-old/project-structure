import { readdir, lstat } from "fs"
import { createCancellationToken, createOperation } from "@dmail/cancellation"
import { pathnameToFilename } from "@dmail/helper"
import { pathnameCanContainsMetaMatching } from "./pathnameCanContainsMetaMatching.js"
import { pathnameToMeta } from "./pathnameToMeta.js"

// when using node 10.0 consider to convert this to async generator ?
export const selectAllFileInsideFolder = async ({
  cancellationToken = createCancellationToken(),
  pathname: rootFolderPathname,
  metaDescription,
  predicate,
  transformFile = (file) => file,
}) => {
  if (typeof rootFolderPathname !== "string")
    throw new TypeError(`pathname must be a string, got ${rootFolderPathname}`)
  if (typeof metaDescription !== "object")
    throw new TypeError(`metaDescription must be a object, got ${metaDescription}`)
  if (typeof predicate !== "function")
    throw new TypeError(`predicate must be a function, got ${predicate}`)
  if (typeof transformFile !== "function")
    throw new TypeError(`transformFile must be a function, got ${transformFile}`)

  const results = []

  const visitFolder = async (folderPathname) => {
    const folderFilename = pathnameToFilename(folderPathname)

    const folderBasenameArray = await createOperation({
      cancellationToken,
      start: () => readDirectory(folderFilename),
    })

    await Promise.all(
      folderBasenameArray.map(async (basename) => {
        const folderEntryPathname = `${folderPathname}/${basename}`
        const folderEntryFilename = pathnameToFilename(folderEntryPathname)
        const folderEntryPathnameRelative = pathnameToRelativePathname(
          folderEntryPathname,
          rootFolderPathname,
        )
        const lstat = await createOperation({
          cancellationToken,
          start: () => readLStat(folderEntryFilename),
        })

        if (lstat.isDirectory()) {
          if (
            !pathnameCanContainsMetaMatching({
              pathname: folderEntryPathnameRelative,
              metaDescription,
              predicate,
            })
          )
            return null

          return visitFolder(folderEntryPathname)
        }

        if (lstat.isFile()) {
          const meta = pathnameToMeta({ pathname: folderEntryPathnameRelative, metaDescription })
          if (!predicate(meta)) {
            return null
          }

          const result = await createOperation({
            cancellationToken,
            start: () =>
              transformFile({
                filenameRelative: folderEntryPathnameRelative.slice(1),
                meta,
                lstat,
              }),
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
  await visitFolder(rootFolderPathname)

  return results
}

const pathnameToRelativePathname = (pathname, parentPathname) => {
  return pathname.slice(parentPathname.length)
}

const readDirectory = (pathname) =>
  new Promise((resolve, reject) => {
    readdir(pathname, (error, names) => {
      if (error) {
        reject(error)
      } else {
        resolve(names)
      }
    })
  })

const readLStat = (pathname) =>
  new Promise((resolve, reject) => {
    lstat(pathname, (error, stat) => {
      if (error) {
        reject(error)
      } else {
        resolve(stat)
      }
    })
  })
