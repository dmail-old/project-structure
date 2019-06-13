const { generateGlobalBundle } = require("@jsenv/core")
const { projectPath } = require("../../jsenv.config.js")

generateGlobalBundle({
  projectPath,
  globalName: "__dmail_project_structure__",
})
