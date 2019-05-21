import { sep } from "path"
import { assert } from "@dmail/assert"
import { importMetaURLToFolderPath } from "../../src/operating-system-path.js"
import { selectAllFileInsideFolder } from "../../index.js"

const testFolderPath = importMetaURLToFolderPath(import.meta.url)
const metaDescription = {
  "/*.js": {
    source: true,
  },
  "/subfolder/": { source: true },
}
const relativePathArray = await selectAllFileInsideFolder({
  folderPath: `${testFolderPath}${sep}folder`,
  metaDescription,
  predicate: ({ source }) => source,
  transformFile: ({ relativePath }) => relativePath,
})
const actual = relativePathArray.sort()
const expected = ["/a.js", "/b.js", "/subfolder/c.js"]

assert({
  actual,
  expected,
})
