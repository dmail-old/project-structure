const { createRoot } = require("../dist/index.js")
const assert = require("assert")
const path = require("path")

const rootLocation = path.resolve(__dirname, "../")

createRoot(rootLocation).then((root) => {
  return root.listFileMatching(({ source }) => source).then((files) => {
    assert.deepEqual(files, [
      "index.js",
      "src/createLocationMeta.js",
      "src/createRoot.js",
      "src/forEachFileMatching.js",
    ])
    return root
      .forEachFileMatching(
        ({ source }) => source,
        ({ absoluteName, relativeName, meta }) =>
          // wrap into promise.resolve to ensure callback can return promise
          Promise.resolve({
            absoluteName,
            relativeName,
            meta,
          }),
      )
      .then((results) => {
        assert.deepEqual(
          results,
          files.map((file) => {
            return {
              absoluteName: `${rootLocation}/${file}`,
              relativeName: file,
              meta: { source: true },
            }
          }),
        )
        console.log("passed")
      })
  })
})
