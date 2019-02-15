const { rollup } = require("rollup")
const babel = require("rollup-plugin-babel")
const nodeResolve = require("rollup-plugin-node-resolve")
const { projectFolder } = require("./util.js")

const plugins = ["@babel/plugin-proposal-object-rest-spread", "@babel/plugin-transform-spread"]
const inputFile = `${projectFolder}/index.js`
const outputFile = `${projectFolder}/dist/index.js`

;(async () => {
  const bundle = await rollup({
    input: inputFile,
    plugins: [
      nodeResolve(),
      babel({
        babelrc: false,
        exclude: "node_modules/**",
        plugins,
      }),
    ],
  })

  await bundle.write({
    format: "cjs",
    file: outputFile,
    sourcemap: true,
  })

  console.log(`index.js -> dist/index.js`)
})()
