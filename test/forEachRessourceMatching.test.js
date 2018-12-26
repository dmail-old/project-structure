import path from "path"
import { assert } from "@dmail/assert"
import { forEachRessourceMatching } from "../index.js"

const localRoot = path.resolve(__dirname, "../") // because runned from dist

const test = async () => {
  {
    const metaMap = {
      src: {
        source: true,
      },
    }

    const ressources = await forEachRessourceMatching({
      localRoot,
      metaMap,
      predicate: ({ source }) => source,
    })

    assert({
      actual: ressources,
      expected: [
        "src/forEachRessourceMatching.js",
        "src/patternGroupToMetaMap.js",
        "src/ressourceCanContainsMetaMatching.js",
        "src/ressourceMatch.js",
        "src/ressourceToMeta.js",
      ],
    })
  }
}
test()
