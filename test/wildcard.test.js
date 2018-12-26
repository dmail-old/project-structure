import { assert } from "@dmail/assert"
import { ressourceToMeta } from "../index.js"

{
  const metaMap = {
    "*a": { a: true },
  }

  assert({ actual: ressourceToMeta(metaMap, "a"), expected: { a: true } })
  assert({ actual: ressourceToMeta(metaMap, "Za"), expected: { a: true } })
  assert({ actual: ressourceToMeta(metaMap, "ZZZa"), expected: { a: true } })
  assert({ actual: ressourceToMeta(metaMap, "aZ"), expected: {} })
}

{
  const metaMap = {
    "a*": { a: true },
  }

  assert({ actual: ressourceToMeta(metaMap, "a"), expected: { a: true } })
  assert({ actual: ressourceToMeta(metaMap, "aZ"), expected: { a: true } })
  assert({ actual: ressourceToMeta(metaMap, "aZZZ"), expected: { a: true } })
  assert({ actual: ressourceToMeta(metaMap, "Za"), expected: {} })
}

{
  const metaMap = {
    "*a*": { a: true },
  }

  assert({ actual: ressourceToMeta(metaMap, "a"), expected: { a: true } })
  assert({ actual: ressourceToMeta(metaMap, "Za"), expected: { a: true } })
  assert({ actual: ressourceToMeta(metaMap, "aZ"), expected: { a: true } })
  assert({ actual: ressourceToMeta(metaMap, "ZZa"), expected: { a: true } })
  assert({ actual: ressourceToMeta(metaMap, "aZZ"), expected: { a: true } })
  assert({ actual: ressourceToMeta(metaMap, "ZaZ"), expected: { a: true } })
  assert({ actual: ressourceToMeta(metaMap, "ZZaZZ"), expected: { a: true } })
}

{
  const metaMap = {
    "a*bc": { a: true },
  }

  assert({ actual: ressourceToMeta(metaMap, "abc"), expected: { a: true } })
  assert({ actual: ressourceToMeta(metaMap, "aZZbc"), expected: { a: true } })
  assert({ actual: ressourceToMeta(metaMap, "aZZbd"), expected: {} })
}
