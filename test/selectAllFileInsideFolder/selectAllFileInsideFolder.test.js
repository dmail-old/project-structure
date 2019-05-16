import { hrefToPathname, pathnameToDirname } from "@jsenv/module-resolution"
import { assert } from "@dmail/assert"
import { selectAllFileInsideFolder } from "../../index.js"

const testFolder = pathnameToDirname(hrefToPathname(import.meta.url))
const metaDescription = {
  "/*.js": {
    source: true,
  },
  "/subfolder/": { source: true },
}
const filenameRelativeArray = await selectAllFileInsideFolder({
  pathname: `${testFolder}/folder`,
  metaDescription,
  predicate: ({ source }) => source,
  transformFile: ({ filenameRelative }) => filenameRelative,
})
const actual = filenameRelativeArray.sort()
const expected = ["a.js", "b.js", "subfolder/c.js"]

assert({
  actual,
  expected,
})
