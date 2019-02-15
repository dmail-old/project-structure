import { pathnameMatch } from "./pathnameMatch.js"

export const pathnameToMeta = ({ pathname, metaDescription }) => {
  return Object.keys(metaDescription).reduce((previousMeta, metaPattern) => {
    const { matched } = pathnameMatch({ pathname, pattern: metaPattern })
    return matched ? { ...previousMeta, ...metaDescription[metaPattern] } : previousMeta
  }, {})
}
