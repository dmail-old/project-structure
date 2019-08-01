const { generateGlobalBundle } = require("@jsenv/bundling")
const { projectPath } = require("../../jsenv.config.js")

generateGlobalBundle({
  projectPath,
  globalName: "__dmail_project_structure__",
})
