import { ressourceMatch } from "./ressourceMatch.js"
import { ressourceToMeta } from "./ressourceToMeta.js"

export const ressourceCanContainsMetaMatching = (metaMap, ressource, predicate) => {
  if (typeof metaMap !== "object") {
    throw new TypeError(
      `ressourceCanContainsMetaMatching metaMap must be an object, got ${metaMap}`,
    )
  }
  if (typeof ressource !== "string") {
    throw new TypeError(
      `ressourceCanContainsMetaMatching ressource must be a string, got ${ressource}`,
    )
  }
  if (typeof predicate !== "function") {
    throw new TypeError(
      `ressourceCanContainsMetaMatching predicate must be a function, got ${predicate}`,
    )
  }

  const matchIndexForRessource = ressource.split("/").join("").length
  const partialMatch = Object.keys(metaMap).some((pattern) => {
    const { matched, matchIndex } = ressourceMatch(pattern, ressource)
    return matched === false && matchIndex >= matchIndexForRessource && predicate(metaMap[pattern])
  })
  if (partialMatch) {
    return true
  }

  // no partial match satisfies predicate, does it work on a full match ?
  const meta = ressourceToMeta(metaMap, ressource)
  return Boolean(predicate(meta))
}
