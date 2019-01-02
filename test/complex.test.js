import { assert } from "@dmail/assert"
import { ressourceToMeta } from "../index.js"

{
  const metaMap = {
    "**/*.js": { js: true },
  }
  const actual = ressourceToMeta(metaMap, "file.es5.js/file.es5.js.map")
  const expected = { js: true }
  assert({ actual, expected })
}

{
  const metaMap = {
    "**/*.js": { js: true },
    "**/*.js/**": { js: false },
  }
  const actual = ressourceToMeta(metaMap, "file.es5.js/file.es5.js.map")
  const expected = { js: false }
  assert({ actual, expected })
}

{
  const metaMap = {
    "**/*.js": { js: true },
  }
  const actual = ressourceToMeta(metaMap, "file.js.map")
  const expected = {}
  assert({ actual, expected })
}

{
  const metaMap = {
    "**/*.js": { format: true },
    "**/*.jsx": { format: true },
    build: { format: false },
    "src/exception.js": { format: false },
  }

  assert({ actual: ressourceToMeta(metaMap, "index.js"), expected: { format: true } })
  assert({ actual: ressourceToMeta(metaMap, "src/file.js"), expected: { format: true } })
  assert({ actual: ressourceToMeta(metaMap, "src/folder/file.js"), expected: { format: true } })
  assert({ actual: ressourceToMeta(metaMap, "index.test.js"), expected: { format: true } })
  assert({ actual: ressourceToMeta(metaMap, "src/file.test.js"), expected: { format: true } })
  assert({
    actual: ressourceToMeta(metaMap, "src/folder/file.test.js"),
    expected: { format: true },
  })
  assert({ actual: ressourceToMeta(metaMap, "src/exception.js"), expected: { format: false } })
}

{
  const metaMap = {
    "index.js": { cover: true },
    "src/**/*.js": { cover: true },
    "src/**/*.jsx": { cover: true },
    "**/*.test.js": { cover: false },
    "**/*.test.jsx": { cover: false },
    build: { cover: false },
    "src/exception.js": { cover: false },
  }

  assert({ actual: ressourceToMeta(metaMap, "index.js"), expected: { cover: true } })
  assert({ actual: ressourceToMeta(metaMap, "src/file.js"), expected: { cover: true } })
  assert({ actual: ressourceToMeta(metaMap, "src/folder/file.js"), expected: { cover: true } })
  assert({ actual: ressourceToMeta(metaMap, "index.test.js"), expected: { cover: false } })
  assert({ actual: ressourceToMeta(metaMap, "src/file.test.js"), expected: { cover: false } })
  assert({
    actual: ressourceToMeta(metaMap, "src/folder/file.test.js"),
    expected: { cover: false },
  })
  assert({ actual: ressourceToMeta(metaMap, "build/index.js"), expected: { cover: false } })
  assert({ actual: ressourceToMeta(metaMap, "src/exception.js"), expected: { cover: false } })
}
