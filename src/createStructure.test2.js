const { createStructure } = require("../dist/index.js")
const assert = require("assert")

{
  const { addMetaAtPattern, canContainsMetaMatching } = createStructure()
  addMetaAtPattern("**/*.js", { a: true })

  assert.equal(canContainsMetaMatching("src/folder", (meta) => meta.a), true)
  assert.equal(canContainsMetaMatching("src/folder/subfolder", (meta) => meta.a), true)
}

{
  const { addMetaAtPattern, getMetaForLocation } = createStructure()
  addMetaAtPattern("dist", { a: 0 })

  assert.equal(getMetaForLocation("dist").a, 0)
  assert.equal(getMetaForLocation("a/dist").a, undefined)
}

console.log("passed")
