// https://github.com/kaelzhang/node-ignore

const { ressourceToMeta } = require("../dist/index.js")
const assert = require("assert")

{
  const metaMap = {
    foo: { a: true },
  }

  assert.deepEqual(ressourceToMeta(metaMap, ""), {})
}

{
  const metaMap = {
    foo: { a: true },
  }

  assert.deepEqual(ressourceToMeta(metaMap, "/"), {})
}

{
  const metaMap = {
    foo: { a: true },
  }

  assert.deepEqual(ressourceToMeta(metaMap, "foo"), { a: true })
}

{
  const metaMap = {
    a: { a: true },
  }

  assert.deepEqual(ressourceToMeta(metaMap, "a"), { a: true })
  assert.deepEqual(ressourceToMeta(metaMap, "a.js"), {})
  assert.deepEqual(ressourceToMeta(metaMap, "a/b"), { a: true })
  assert.deepEqual(ressourceToMeta(metaMap, "a/b.js"), { a: true })
}

{
  const metaMap = {
    "b/a": { a: true },
  }

  assert.deepEqual(ressourceToMeta(metaMap, "b/a"), { a: true })
  assert.deepEqual(ressourceToMeta(metaMap, "b/a.js"), {})
  assert.deepEqual(ressourceToMeta(metaMap, "b/c"), {})
  assert.deepEqual(ressourceToMeta(metaMap, "b/a/c"), { a: true })
}

{
  const metaMap = {
    "*a": { a: true },
  }

  assert.deepEqual(ressourceToMeta(metaMap, "a"), { a: true })
  assert.deepEqual(ressourceToMeta(metaMap, "Za"), { a: true })
  assert.deepEqual(ressourceToMeta(metaMap, "ZZZa"), { a: true })
  assert.deepEqual(ressourceToMeta(metaMap, "aZ"), {})
}

{
  const metaMap = {
    "a*": { a: true },
  }

  assert.deepEqual(ressourceToMeta(metaMap, "a"), { a: true })
  assert.deepEqual(ressourceToMeta(metaMap, "aZ"), { a: true })
  assert.deepEqual(ressourceToMeta(metaMap, "aZZZ"), { a: true })
  assert.deepEqual(ressourceToMeta(metaMap, "Za"), {})
}

{
  const metaMap = {
    "*a*": { a: true },
  }

  assert.deepEqual(ressourceToMeta(metaMap, "a"), { a: true })
  assert.deepEqual(ressourceToMeta(metaMap, "Za"), { a: true })
  assert.deepEqual(ressourceToMeta(metaMap, "aZ"), { a: true })
  assert.deepEqual(ressourceToMeta(metaMap, "ZZa"), { a: true })
  assert.deepEqual(ressourceToMeta(metaMap, "aZZ"), { a: true })
  assert.deepEqual(ressourceToMeta(metaMap, "ZaZ"), { a: true })
  assert.deepEqual(ressourceToMeta(metaMap, "ZZaZZ"), { a: true })
}

{
  const metaMap = {
    "a*bc": { a: true },
  }

  assert.deepEqual(ressourceToMeta(metaMap, "abc"), { a: true })
  assert.deepEqual(ressourceToMeta(metaMap, "aZZbc"), { a: true })
  assert.deepEqual(ressourceToMeta(metaMap, "aZZbd"), {})
}

{
  const metaMap = {
    "**/a": { a: true },
  }

  assert.deepEqual(ressourceToMeta(metaMap, "a"), { a: true })
  assert.deepEqual(ressourceToMeta(metaMap, "b/a"), { a: true })
  assert.deepEqual(ressourceToMeta(metaMap, "c/b/a"), { a: true })
  assert.deepEqual(ressourceToMeta(metaMap, "a.js"), {})
}

{
  const metaMap = {
    "a/**": { a: true },
  }

  assert.deepEqual(ressourceToMeta(metaMap, "a"), {})
  assert.deepEqual(ressourceToMeta(metaMap, "a/b"), { a: true })
  assert.deepEqual(ressourceToMeta(metaMap, "a/b/c"), { a: true })
  assert.deepEqual(ressourceToMeta(metaMap, "a/a.js"), { a: true })
  assert.deepEqual(ressourceToMeta(metaMap, "a.js"), {})
}

{
  const metaMap = {
    "**/a/**": { a: true },
  }

  assert.deepEqual(ressourceToMeta(metaMap, "a"), {})
  assert.deepEqual(ressourceToMeta(metaMap, "a/b"), { a: true })
  assert.deepEqual(ressourceToMeta(metaMap, "b/a/c"), { a: true })
}

{
  const metaMap = {
    "**/*": { a: true },
  }

  assert.deepEqual(ressourceToMeta(metaMap, "a"), { a: true })
  assert.deepEqual(ressourceToMeta(metaMap, "node_modules"), { a: true })
}

{
  const metaMap = {
    "a/**/*.test.js": { a: true },
  }

  assert.deepEqual(ressourceToMeta(metaMap, "a"), {})
  assert.deepEqual(ressourceToMeta(metaMap, "a/b.test.js"), { a: true })
  assert.deepEqual(ressourceToMeta(metaMap, "a/b.js"), {})
  assert.deepEqual(ressourceToMeta(metaMap, "a/b/c.test.js"), { a: true })
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

  assert.deepEqual(ressourceToMeta(metaMap, "index.js"), { cover: true })
  assert.deepEqual(ressourceToMeta(metaMap, "src/file.js"), { cover: true })
  assert.deepEqual(ressourceToMeta(metaMap, "src/folder/file.js"), { cover: true })
  assert.deepEqual(ressourceToMeta(metaMap, "index.test.js"), { cover: false })
  assert.deepEqual(ressourceToMeta(metaMap, "src/file.test.js"), { cover: false })
  assert.deepEqual(ressourceToMeta(metaMap, "src/folder/file.test.js"), { cover: false })
  assert.deepEqual(ressourceToMeta(metaMap, "build/index.js"), { cover: false })
  assert.deepEqual(ressourceToMeta(metaMap, "src/exception.js"), { cover: false })
}

{
  const metaMap = {
    "**/*.js": { prettify: true },
  }

  assert.deepEqual(ressourceToMeta(metaMap, "index.test.js"), { prettify: true })
}

{
  const metaMap = {
    "**/*.js": { prettify: true },
    "**/*.jsx": { prettify: true },
    build: { prettify: false },
    "src/exception.js": { prettify: false },
  }

  assert.deepEqual(ressourceToMeta(metaMap, "index.js"), { prettify: true })
  assert.deepEqual(ressourceToMeta(metaMap, "src/file.js"), { prettify: true })
  assert.deepEqual(ressourceToMeta(metaMap, "src/folder/file.js"), { prettify: true })
  assert.deepEqual(ressourceToMeta(metaMap, "index.test.js"), { prettify: true })
  assert.deepEqual(ressourceToMeta(metaMap, "src/file.test.js"), { prettify: true })
  assert.deepEqual(ressourceToMeta(metaMap, "src/folder/file.test.js"), { prettify: true })
  assert.deepEqual(ressourceToMeta(metaMap, "src/exception.js"), { prettify: false })
}

console.log("passed")
