const { createFileStructure } = require("../dist/index.js")
const assert = require("assert")
const path = require("path")

const rootLocation = path.resolve(__dirname, "../")

createFileStructure({ root: rootLocation, configName: "structure.config.js" }).then(
  (fileStructure) => {
    return fileStructure.listFileMatching(({ source }) => source).then((files) => {
      assert.deepEqual(files, [
        "index.js",
        "src/createFileStructure.js",
        "src/createStructure.js",
        "src/forEachFileMatching.js",
      ])
      return fileStructure
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
  },
)
