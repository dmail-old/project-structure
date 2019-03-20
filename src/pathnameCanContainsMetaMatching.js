import { pathnameMatch } from "./pathnameMatch.js"

export const pathnameCanContainsMetaMatching = ({ pathname, metaDescription, predicate }) => {
  if (typeof pathname !== "string")
    throw new TypeError(`pathname must be a string, got ${pathname}`)
  if (typeof metaDescription !== "object")
    throw new TypeError(`metaDescription must be an object, got ${metaDescription}`)
  if (typeof predicate !== "function")
    throw new TypeError(`predicate must be a function, got ${predicate}`)

  // we add a trailing slash because we are intested into what will be inside
  // this pathname, not the pathname itself
  // it allows to match pattern for what is inside that pathname
  const pathnameWithTrailingSlash = `${pathname}/`

  // for full match we must create an object to allow pattern to override previous ones
  let fullMatchMeta = {}
  let someFullMatch = false
  // for partial match, any meta satisfying predicate will be valid because
  // we don't know for sure if pattern will still match for a file inside pathname
  const partialMatchMetaArray = []

  Object.keys(metaDescription).forEach((pattern) => {
    const { matched, pathnameIndex } = pathnameMatch({
      pathname: pathnameWithTrailingSlash,
      pattern,
    })
    if (matched) {
      someFullMatch = true
      fullMatchMeta = {
        ...fullMatchMeta,
        ...metaDescription[pattern],
      }
    } else if (someFullMatch === false && pathnameIndex >= pathname.length) {
      partialMatchMetaArray.push(metaDescription[pattern])
    }
  })

  if (someFullMatch) return Boolean(predicate(fullMatchMeta))

  return partialMatchMetaArray.some((partialMatchMeta) => predicate(partialMatchMeta))
}
