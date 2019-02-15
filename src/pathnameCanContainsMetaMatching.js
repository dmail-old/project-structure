import { pathnameMatch } from "./pathnameMatch.js"
import { pathnameToMeta } from "./pathnameToMeta.js"

export const pathnameCanContainsMetaMatching = ({ pathname, metaDescription, predicate }) => {
  if (typeof pathname !== "string")
    throw new TypeError(`pathname must be a string, got ${pathname}`)
  if (typeof metaDescription !== "object")
    throw new TypeError(`metaDescription must be an object, got ${metaDescription}`)
  if (typeof predicate !== "function")
    throw new TypeError(`predicate must be a function, got ${predicate}`)

  const matchIndexForFolder = pathname.split("/").join("").length
  const partialMatch = Object.keys(metaDescription).some((pattern) => {
    const { matched, matchIndex } = pathnameMatch({
      pathname,
      pattern,
    })
    return (
      matched === false && matchIndex >= matchIndexForFolder && predicate(metaDescription[pattern])
    )
  })
  if (partialMatch) return true

  // no partial match satisfies predicate, does it work on a full match ?
  const meta = pathnameToMeta({ pathname, metaDescription })
  return Boolean(predicate(meta))
}
