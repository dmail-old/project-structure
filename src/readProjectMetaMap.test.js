const { readProjectMetaMap, forEachRessourceMatching } = require("../dist/index.js")
const assert = require("assert")
const path = require("path")

const root = path.resolve(__dirname, "../")

readProjectMetaMap({ root, config: "structure.config.js" }).then((metaMap) => {
  return forEachRessourceMatching(
    root,
    metaMap,
    ({ source }) => source,
    ({ relativeName }) => relativeName,
  ).then((files) => {
    assert.deepEqual(files, [
      "index.js",
      "src/configToMetaMap.js",
      "src/forEachRessourceMatching.js",
      "src/readProjectMetaMap.js",
      "src/ressourceCanContainsMetaMatching.js",
      "src/ressourceMatch.js",
      "src/ressourceToMeta.js",
    ])

    return forEachRessourceMatching(
      root,
      metaMap,
      ({ source }) => source,
      ({ absoluteName, relativeName, meta }) =>
        // wrap into promise.resolve to ensure callback can return promise
        Promise.resolve({
          absoluteName,
          relativeName,
          meta,
        }),
    ).then((results) => {
      assert.deepEqual(
        results,
        files.map((file) => {
          return {
            absoluteName: `${root}/${file}`,
            relativeName: file,
            meta: { source: true },
          }
        }),
      )
      console.log("passed")
    })
  })
})
