// https://github.com/kaelzhang/node-ignore

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

{
  const metaMap = {
    "**/*.js": { prettify: true },
  }

  assert({ actual: ressourceToMeta(metaMap, "index.test.js"), expected: { prettify: true } })
}

{
  const metaMap = {
    "**/*.js": { prettify: true },
    "**/*.jsx": { prettify: true },
    build: { prettify: false },
    "src/exception.js": { prettify: false },
  }

  assert({ actual: ressourceToMeta(metaMap, "index.js"), expected: { prettify: true } })
  assert({ actual: ressourceToMeta(metaMap, "src/file.js"), expected: { prettify: true } })
  assert({ actual: ressourceToMeta(metaMap, "src/folder/file.js"), expected: { prettify: true } })
  assert({ actual: ressourceToMeta(metaMap, "index.test.js"), expected: { prettify: true } })
  assert({ actual: ressourceToMeta(metaMap, "src/file.test.js"), expected: { prettify: true } })
  assert({
    actual: ressourceToMeta(metaMap, "src/folder/file.test.js"),
    expected: { prettify: true },
  })
  assert({ actual: ressourceToMeta(metaMap, "src/exception.js"), expected: { prettify: false } })
}

{
  const metaMap = {
    dist: { a: 0 },
  }

  assert({ actual: ressourceToMeta(metaMap, "dist").a, expected: 0 })
  assert({ actual: ressourceToMeta(metaMap, "a/dist").a, expected: undefined })
}

console.log("passed")
