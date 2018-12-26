import { assert } from "@dmail/assert"
import { ressourceToMeta } from "../index.js"

{
  const metaMap = {
    foo: { a: true },
  }

  assert({ actual: ressourceToMeta(metaMap, ""), expected: {} })
}

{
  const metaMap = {
    foo: { a: true },
  }

  assert({ actual: ressourceToMeta(metaMap, "/"), expected: {} })
}

{
  const metaMap = {
    foo: { a: true },
  }

  assert({ actual: ressourceToMeta(metaMap, "foo"), expected: { a: true } })
}

{
  const metaMap = {
    a: { a: true },
  }

  assert({ actual: ressourceToMeta(metaMap, "a"), expected: { a: true } })
  assert({ actual: ressourceToMeta(metaMap, "a.js"), expected: {} })
  assert({ actual: ressourceToMeta(metaMap, "a/b"), expected: { a: true } })
  assert({ actual: ressourceToMeta(metaMap, "a/b.js"), expected: { a: true } })
}

{
  const metaMap = {
    "b/a": { a: true },
  }

  assert({ actual: ressourceToMeta(metaMap, "b/a"), expected: { a: true } })
  assert({ actual: ressourceToMeta(metaMap, "b/a.js"), expected: {} })
  assert({ actual: ressourceToMeta(metaMap, "b/c"), expected: {} })
  assert({ actual: ressourceToMeta(metaMap, "b/a/c"), expected: { a: true } })
}

{
  const metaMap = {
    dist: { a: 0 },
  }

  assert({ actual: ressourceToMeta(metaMap, "dist").a, expected: 0 })
  assert({ actual: ressourceToMeta(metaMap, "a/dist").a, expected: undefined })
}

console.log("passed")
