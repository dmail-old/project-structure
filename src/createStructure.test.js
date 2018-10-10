// https://github.com/kaelzhang/node-ignore

const { createStructure } = require("../dist/index.js")
const assert = require("assert")

{
  const { addMetaAtPattern, getMetaForLocation } = createStructure()
  addMetaAtPattern("foo", { a: true })

  assert.deepEqual(getMetaForLocation(""), {})
}

{
  const { addMetaAtPattern, getMetaForLocation } = createStructure()
  addMetaAtPattern("foo", { a: true })

  assert.deepEqual(getMetaForLocation("/"), {})
}

{
  const { addMetaAtPattern, getMetaForLocation } = createStructure()
  addMetaAtPattern("foo", { a: true })

  assert.deepEqual(getMetaForLocation("foo"), { a: true })
}

{
  const { addMetaAtPattern, getMetaForLocation } = createStructure()
  addMetaAtPattern("a", { a: true })

  assert.deepEqual(getMetaForLocation("a"), { a: true })
  assert.deepEqual(getMetaForLocation("a.js"), {})
  assert.deepEqual(getMetaForLocation("a/b"), { a: true })
  assert.deepEqual(getMetaForLocation("a/b.js"), { a: true })
}

{
  const { addMetaAtPattern, getMetaForLocation } = createStructure()
  addMetaAtPattern("b/a", { a: true })

  assert.deepEqual(getMetaForLocation("b/a"), { a: true })
  assert.deepEqual(getMetaForLocation("b/a.js"), {})
  assert.deepEqual(getMetaForLocation("b/c"), {})
  assert.deepEqual(getMetaForLocation("b/a/c"), { a: true })
}

{
  const { addMetaAtPattern, getMetaForLocation } = createStructure()
  addMetaAtPattern("*a", { a: true })

  assert.deepEqual(getMetaForLocation("a"), { a: true })
  assert.deepEqual(getMetaForLocation("Za"), { a: true })
  assert.deepEqual(getMetaForLocation("ZZZa"), { a: true })
  assert.deepEqual(getMetaForLocation("aZ"), {})
}

{
  const { addMetaAtPattern, getMetaForLocation } = createStructure()
  addMetaAtPattern("a*", { a: true })

  assert.deepEqual(getMetaForLocation("a"), { a: true })
  assert.deepEqual(getMetaForLocation("aZ"), { a: true })
  assert.deepEqual(getMetaForLocation("aZZZ"), { a: true })
  assert.deepEqual(getMetaForLocation("Za"), {})
}

{
  const { addMetaAtPattern, getMetaForLocation } = createStructure()
  addMetaAtPattern("*a*", { a: true })

  assert.deepEqual(getMetaForLocation("a"), { a: true })
  assert.deepEqual(getMetaForLocation("Za"), { a: true })
  assert.deepEqual(getMetaForLocation("aZ"), { a: true })
  assert.deepEqual(getMetaForLocation("ZZa"), { a: true })
  assert.deepEqual(getMetaForLocation("aZZ"), { a: true })
  assert.deepEqual(getMetaForLocation("ZaZ"), { a: true })
  assert.deepEqual(getMetaForLocation("ZZaZZ"), { a: true })
}

{
  const { addMetaAtPattern, getMetaForLocation } = createStructure()
  addMetaAtPattern("a*bc", { a: true })

  assert.deepEqual(getMetaForLocation("abc"), { a: true })
  assert.deepEqual(getMetaForLocation("aZZbc"), { a: true })
  assert.deepEqual(getMetaForLocation("aZZbd"), {})
}

{
  const { addMetaAtPattern, getMetaForLocation } = createStructure()
  addMetaAtPattern("**/a", { a: true })

  assert.deepEqual(getMetaForLocation("a"), { a: true })
  assert.deepEqual(getMetaForLocation("b/a"), { a: true })
  assert.deepEqual(getMetaForLocation("c/b/a"), { a: true })
  assert.deepEqual(getMetaForLocation("a.js"), {})
}

{
  const { addMetaAtPattern, getMetaForLocation } = createStructure()
  addMetaAtPattern("a/**", { a: true })

  assert.deepEqual(getMetaForLocation("a"), {})
  assert.deepEqual(getMetaForLocation("a/b"), { a: true })
  assert.deepEqual(getMetaForLocation("a/b/c"), { a: true })
  assert.deepEqual(getMetaForLocation("a/a.js"), { a: true })
  assert.deepEqual(getMetaForLocation("a.js"), {})
}

{
  const { addMetaAtPattern, getMetaForLocation } = createStructure()
  addMetaAtPattern("**/a/**", { a: true })

  assert.deepEqual(getMetaForLocation("a"), {})
  assert.deepEqual(getMetaForLocation("a/b"), { a: true })
  assert.deepEqual(getMetaForLocation("b/a/c"), { a: true })
}

{
  const { addMetaAtPattern, getMetaForLocation } = createStructure()
  addMetaAtPattern("**/*", { a: true })

  assert.deepEqual(getMetaForLocation("a"), { a: true })
  assert.deepEqual(getMetaForLocation("node_modules"), { a: true })
}

{
  const { addMetaAtPattern, getMetaForLocation } = createStructure()
  addMetaAtPattern("a/**/*.test.js", { a: true })

  assert.deepEqual(getMetaForLocation("a"), {})
  assert.deepEqual(getMetaForLocation("a/b.test.js"), { a: true })
  assert.deepEqual(getMetaForLocation("a/b.js"), {})
  assert.deepEqual(getMetaForLocation("a/b/c.test.js"), { a: true })
}

{
  const { addMetaAtPattern, getMetaForLocation } = createStructure()
  addMetaAtPattern("index.js", { cover: true })
  addMetaAtPattern("src/**/*.js", { cover: true })
  addMetaAtPattern("src/**/*.jsx", { cover: true })
  addMetaAtPattern("**/*.test.js", { cover: false })
  addMetaAtPattern("**/*.test.jsx", { cover: false })
  addMetaAtPattern("build", { cover: false })
  addMetaAtPattern("src/exception.js", { cover: false })

  assert.deepEqual(getMetaForLocation("index.js"), { cover: true })
  assert.deepEqual(getMetaForLocation("src/file.js"), { cover: true })
  assert.deepEqual(getMetaForLocation("src/folder/file.js"), { cover: true })
  assert.deepEqual(getMetaForLocation("index.test.js"), { cover: false })
  assert.deepEqual(getMetaForLocation("src/file.test.js"), { cover: false })
  assert.deepEqual(getMetaForLocation("src/folder/file.test.js"), { cover: false })
  assert.deepEqual(getMetaForLocation("build/index.js"), { cover: false })
  assert.deepEqual(getMetaForLocation("src/exception.js"), { cover: false })
}

{
  const { addMetaAtPattern, getMetaForLocation } = createStructure()
  addMetaAtPattern("**/*.js", { prettify: true })

  assert.deepEqual(getMetaForLocation("index.test.js"), { prettify: true })
}

{
  const { addMetaAtPattern, getMetaForLocation } = createStructure()
  addMetaAtPattern("**/*.js", { prettify: true })
  addMetaAtPattern("**/*.jsx", { prettify: true })
  addMetaAtPattern("build", { prettify: false })
  addMetaAtPattern("src/exception.js", { prettify: false })

  assert.deepEqual(getMetaForLocation("index.js"), { prettify: true })
  assert.deepEqual(getMetaForLocation("src/file.js"), { prettify: true })
  assert.deepEqual(getMetaForLocation("src/folder/file.js"), { prettify: true })
  assert.deepEqual(getMetaForLocation("index.test.js"), { prettify: true })
  assert.deepEqual(getMetaForLocation("src/file.test.js"), { prettify: true })
  assert.deepEqual(getMetaForLocation("src/folder/file.test.js"), { prettify: true })
  assert.deepEqual(getMetaForLocation("src/exception.js"), { prettify: false })
}

{
  const { addMetaAtPattern, canContainsMetaMatching } = createStructure()
  addMetaAtPattern("a/b", { a: true })

  assert.equal(canContainsMetaMatching("a", (meta) => meta.a), true)
  assert.equal(canContainsMetaMatching("a/c", (meta) => meta.a), false)
  assert.equal(canContainsMetaMatching("a/b", (meta) => meta.a), true)
}

{
  const { addMetaAtPattern, canContainsMetaMatching } = createStructure()
  addMetaAtPattern("a/b*/c", { a: true })

  assert.equal(canContainsMetaMatching("a/bZ", (meta) => meta.a), true)
  assert.equal(canContainsMetaMatching("a/bZ/c", (meta) => meta.a), true)
}

{
  const { addMetaAtPattern, canContainsMetaMatching } = createStructure()
  addMetaAtPattern("a/**/b.js", { a: true })

  assert.equal(canContainsMetaMatching("a/b/c", (meta) => meta.a), true)
}

{
  const { addMetaAtPattern, canContainsMetaMatching } = createStructure()
  addMetaAtPattern("**/*", { a: true })
  addMetaAtPattern("node_modules", { a: false })

  assert.equal(canContainsMetaMatching("node_modules", (meta) => meta.a), false)
}

{
  const { addMetaAtPattern, canContainsMetaMatching } = createStructure()
  addMetaAtPattern("**/*.js", { a: true })
  addMetaAtPattern("**/*.md", { a: false })

  assert.equal(canContainsMetaMatching("src", (meta) => meta.a), true)
}

console.log("passed")
