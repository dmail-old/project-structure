const path = require("path")
const eslintConfig = require("@dmail/project-eslint-config").config
const prettierConfig = require("@dmail/project-prettier-config")

const localRoot = path.resolve(__dirname, "../")

const plugins = ["@babel/plugin-proposal-object-rest-spread", "@babel/plugin-transform-spread"]

module.exports = {
  localRoot,
  eslint: eslintConfig,
  prettier: prettierConfig,
  plugins,
}
