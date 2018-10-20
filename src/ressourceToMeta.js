import { ressourceMatch } from "./ressourceMatch.js"

export const ressourceToMeta = (metaMap, ressource) => {
  return Object.keys(metaMap).reduce((previousMeta, pattern) => {
    const { matched } = ressourceMatch(pattern, ressource)
    return matched ? { ...previousMeta, ...metaMap[pattern] } : previousMeta
  }, {})
}
