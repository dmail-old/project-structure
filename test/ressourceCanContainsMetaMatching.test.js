import { assert } from "@dmail/assert"
import { ressourceCanContainsMetaMatching } from "../index.js"

{
  const metaMap = {
    "a/b": { a: true },
  }

  assert({
    actual: ressourceCanContainsMetaMatching(metaMap, "a", (meta) => meta.a),
    expected: true,
  })
  assert({
    actual: ressourceCanContainsMetaMatching(metaMap, "a/c", (meta) => meta.a),
    expected: false,
  })
  assert({
    actual: ressourceCanContainsMetaMatching(metaMap, "a/b", (meta) => meta.a),
    expected: true,
  })
}

{
  const metaMap = {
    "a/b*/c": { a: true },
  }

  assert({
    actual: ressourceCanContainsMetaMatching(metaMap, "a/bZ", (meta) => meta.a),
    expected: true,
  })
  assert({
    actual: ressourceCanContainsMetaMatching(metaMap, "a/bZ/c", (meta) => meta.a),
    expected: true,
  })
}

{
  const metaMap = {
    "a/**/b.js": { a: true },
  }

  assert({
    actual: ressourceCanContainsMetaMatching(metaMap, "a/b/c", (meta) => meta.a),
    expected: true,
  })
}

{
  const metaMap = {
    "**/*": { a: true },
    node_modules: { a: false }, // eslint-disable-line camelcase
  }

  assert({
    actual: ressourceCanContainsMetaMatching(metaMap, "node_modules", (meta) => meta.a),
    expected: false,
  })
}

{
  const metaMap = {
    "**/*.js": { a: true },
    "**/*.md": { a: false },
  }

  assert({
    actual: ressourceCanContainsMetaMatching(metaMap, "src", (meta) => meta.a),
    expected: true,
  })
}

{
  const metaMap = {
    "**/*.js": { a: true },
  }

  assert({
    actual: ressourceCanContainsMetaMatching(metaMap, "src/folder", (meta) => meta.a),
    expected: true,
  })
  assert({
    actual: ressourceCanContainsMetaMatching(metaMap, "src/folder/subfolder", (meta) => meta.a),
    expected: true,
  })
}

{
  const metaMap = {
    "src/**/*.js": { a: true },
  }

  assert({
    actual: ressourceCanContainsMetaMatching(
      metaMap,
      "src/jsCreateCompileService/compile",
      (meta) => meta.a,
    ),
    expected: true,
  })
}

console.log("passed")
