// all of these, or at least pathnameMatch
// should be part of something more low level
// and selectAllFileInsideFolder should be something
// with its own repo because only useful on nodejs

export { selectAllFileInsideFolder } from "./src/selectAllFileInsideFolder.js"

export { pathnameMatch } from "./src/pathnameMatch.js"

export { pathnameCanContainsMetaMatching } from "./src/pathnameCanContainsMetaMatching.js"

export { pathnameToMeta } from "./src/pathnameToMeta.js"

export {
  namedValueDescriptionToMetaDescription,
} from "./src/namedValueDescriptionToMetaDescription.js"
