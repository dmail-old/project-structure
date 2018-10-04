const { createStructure } = require("../dist/index.js")
const assert = require("assert")

{
  const { addMetaAtPattern, canContainsMetaMatching } = createStructure()
  addMetaAtPattern("**/*.js", { a: true })

  assert.equal(canContainsMetaMatching("src/folder", (meta) => meta.a), true)
  assert.equal(canContainsMetaMatching("src/folder/subfolder", (meta) => meta.a), true)
}

console.log("passed")
