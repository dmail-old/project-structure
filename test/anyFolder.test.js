// https://github.com/kaelzhang/node-ignore

import { assert } from "@dmail/assert"
import { ressourceToMeta } from "../index.js"

{
  const metaMap = {
    "**/a": { a: true },
  }

  assert({ actual: ressourceToMeta(metaMap, "a"), expected: { a: true } })
  assert({ actual: ressourceToMeta(metaMap, "b/a"), expected: { a: true } })
  assert({ actual: ressourceToMeta(metaMap, "c/b/a"), expected: { a: true } })
  assert({ actual: ressourceToMeta(metaMap, "a.js"), expected: {} })
}

{
  const metaMap = {
    "a/**": { a: true },
  }

  assert({ actual: ressourceToMeta(metaMap, "a"), expected: {} })
  assert({ actual: ressourceToMeta(metaMap, "a/b"), expected: { a: true } })
  assert({ actual: ressourceToMeta(metaMap, "a/b/c"), expected: { a: true } })
  assert({ actual: ressourceToMeta(metaMap, "a/a.js"), expected: { a: true } })
  assert({ actual: ressourceToMeta(metaMap, "a.js"), expected: {} })
}

{
  const metaMap = {
    "**/a/**": { a: true },
  }

  assert({ actual: ressourceToMeta(metaMap, "a"), expected: {} })
  assert({ actual: ressourceToMeta(metaMap, "a/b"), expected: { a: true } })
  assert({ actual: ressourceToMeta(metaMap, "b/a/c"), expected: { a: true } })
}

{
  const metaMap = {
    "**/*": { a: true },
  }

  assert({ actual: ressourceToMeta(metaMap, "a"), expected: { a: true } })
  assert({ actual: ressourceToMeta(metaMap, "node_modules"), expected: { a: true } })
}

{
  const metaMap = {
    "a/**/*.test.js": { a: true },
  }

  assert({ actual: ressourceToMeta(metaMap, "a"), expected: {} })
  assert({ actual: ressourceToMeta(metaMap, "a/b.test.js"), expected: { a: true } })
  assert({ actual: ressourceToMeta(metaMap, "a/b.js"), expected: {} })
  assert({ actual: ressourceToMeta(metaMap, "a/b/c.test.js"), expected: { a: true } })
}

{
  const metaMap = {
    "**/*.js": { a: true },
  }

  assert({ actual: ressourceToMeta(metaMap, "index.test.js"), expected: { a: true } })
}

console.log("passed")
