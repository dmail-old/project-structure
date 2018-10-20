const { ressourceCanContainsMetaMatching } = require("../dist/index.js")
const assert = require("assert")

{
  const metaMap = {
    "a/b": { a: true },
  }

  assert.equal(ressourceCanContainsMetaMatching(metaMap, "a", (meta) => meta.a), true)
  assert.equal(ressourceCanContainsMetaMatching(metaMap, "a/c", (meta) => meta.a), false)
  assert.equal(ressourceCanContainsMetaMatching(metaMap, "a/b", (meta) => meta.a), true)
}

{
  const metaMap = {
    "a/b*/c": { a: true },
  }

  assert.equal(ressourceCanContainsMetaMatching(metaMap, "a/bZ", (meta) => meta.a), true)
  assert.equal(ressourceCanContainsMetaMatching(metaMap, "a/bZ/c", (meta) => meta.a), true)
}

{
  const metaMap = {
    "a/**/b.js": { a: true },
  }

  assert.equal(ressourceCanContainsMetaMatching(metaMap, "a/b/c", (meta) => meta.a), true)
}

{
  const metaMap = {
    "**/*": { a: true },
    node_modules: { a: false },
  }

  assert.equal(ressourceCanContainsMetaMatching(metaMap, "node_modules", (meta) => meta.a), false)
}

{
  const metaMap = {
    "**/*.js": { a: true },
    "**/*.md": { a: false },
  }

  assert.equal(ressourceCanContainsMetaMatching(metaMap, "src", (meta) => meta.a), true)
}

{
  const metaMap = {
    "**/*.js": { a: true },
  }

  assert.equal(ressourceCanContainsMetaMatching(metaMap, "src/folder", (meta) => meta.a), true)
  assert.equal(
    ressourceCanContainsMetaMatching(metaMap, "src/folder/subfolder", (meta) => meta.a),
    true,
  )
}

{
  const metaMap = {
    "src/**/*.js": { a: true },
  }

  assert.equal(
    ressourceCanContainsMetaMatching(
      metaMap,
      "src/jsCreateCompileService/compile",
      (meta) => meta.a,
    ),
    true,
  )
}

console.log("passed")
