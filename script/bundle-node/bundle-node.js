const { bundleNode } = require("@jsenv/core")
const { importMap, projectFolder, babelConfigMap } = require("../../jsenv.config.js")

bundleNode({
  importMap,
  projectFolder,
  into: "dist/node",
  babelConfigMap,
  entryPointMap: {
    main: "index.js",
  },
  verbose: true,
})
