import path from "path"
import { assert } from "@dmail/assert"
import { selectAllFileInsideFolder } from "../../index.js"

const projectFolder = path.resolve(__dirname, "../") // because runned from dist

;(async () => {
  {
    const metaDescription = {
      "*.js": {
        source: true,
      },
      subfolder: { source: true },
    }

    const fileArray = await selectAllFileInsideFolder({
      pathname: `${projectFolder}/test/selectAllFileInsideFolder/folder`,
      metaDescription,
      predicate: ({ source }) => source,
    })
    const actual = fileArray.map(({ filenameRelative }) => filenameRelative).sort()
    const expected = ["a.js", "b.js", "subfolder/c.js"]

    assert({
      actual,
      expected,
    })
  }
})()
