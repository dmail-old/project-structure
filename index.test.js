// https://github.com/kaelzhang/node-ignore

const { createLocationMeta } = require("./dist/index.js")
const assert = require("assert")

// {
//   const { addMetaAtPattern, getMetaForLocation } = createLocationMeta()
//   addMetaAtPattern("a", { a: true })

//   assert.deepEqual(getMetaForLocation("a"), { a: true })
//   assert.deepEqual(getMetaForLocation("a.js"), {})
//   assert.deepEqual(getMetaForLocation("a/b"), { a: true })
//   assert.deepEqual(getMetaForLocation("a/b.js"), { a: true })
// }

// {
//   const { addMetaAtPattern, getMetaForLocation } = createLocationMeta()
//   addMetaAtPattern("a/b", { b: true })

//   assert.deepEqual(getMetaForLocation("a/b"), { b: true })
//   assert.deepEqual(getMetaForLocation("a/b.js"), {})
//   assert.deepEqual(getMetaForLocation("a/c"), {})
//   assert.deepEqual(getMetaForLocation("a/b/c"), { b: true })
// }

// {
//   const { addMetaAtPattern, getMetaForLocation } = createLocationMeta()
//   addMetaAtPattern("*b", { b: true })

//   assert.deepEqual(getMetaForLocation("b"), { b: true })
//   assert.deepEqual(getMetaForLocation("Zb"), { b: true })
//   assert.deepEqual(getMetaForLocation("ZZZb"), { b: true })
//   assert.deepEqual(getMetaForLocation("bZ"), {})
// }

// {
//   const { addMetaAtPattern, getMetaForLocation } = createLocationMeta()
//   addMetaAtPattern("b*", { b: true })

//   assert.deepEqual(getMetaForLocation("b"), { b: true })
//   assert.deepEqual(getMetaForLocation("bZ"), { b: true })
//   assert.deepEqual(getMetaForLocation("bZZZ"), { b: true })
//   assert.deepEqual(getMetaForLocation("Zb"), {})
// }

// {
//   const { addMetaAtPattern, getMetaForLocation } = createLocationMeta()
//   addMetaAtPattern("**/a", { a: true })

//   assert.deepEqual(getMetaForLocation("a"), { a: true })
//   assert.deepEqual(getMetaForLocation("b/a"), { a: true })
//   assert.deepEqual(getMetaForLocation("c/b/a"), { a: true })
//   assert.deepEqual(getMetaForLocation("a.js"), {})
// }

// {
//   const { addMetaAtPattern, getMetaForLocation } = createLocationMeta()
//   addMetaAtPattern("a/**", { a: true })

//   assert.deepEqual(getMetaForLocation("a"), {})
//   assert.deepEqual(getMetaForLocation("a/b"), { a: true })
//   assert.deepEqual(getMetaForLocation("a/b/c"), { a: true })
//   assert.deepEqual(getMetaForLocation("a/a.js"), { a: true })
//   assert.deepEqual(getMetaForLocation("a.js"), {})
// }

// {
//   const { addMetaAtPattern, getMetaForLocation } = createLocationMeta()
//   addMetaAtPattern("a/**/*.test.js", { a: true })

//   assert.deepEqual(getMetaForLocation("a"), {})
//   assert.deepEqual(getMetaForLocation("a/b.test.js"), { a: true })
//   assert.deepEqual(getMetaForLocation("a/b.js"), {})
//   assert.deepEqual(getMetaForLocation("a/b/c.test.js"), { a: true })
// }

// {
//   const { addMetaAtPattern, canContainsMetaMatching } = createLocationMeta()
//   addMetaAtPattern("a/b", { a: true })

//   assert.equal(canContainsMetaMatching("a", (meta) => meta.a), true)
// }

// {
//   const { addMetaAtPattern, canContainsMetaMatching } = createLocationMeta()
//   addMetaAtPattern("*a*", { a: true })

//   assert.equal(canContainsMetaMatching("ZaZ", (meta) => meta.a), true)
// }

// {
//   const { addMetaAtPattern, canContainsMetaMatching } = createLocationMeta()
//   addMetaAtPattern("a/b*/c", { a: true })

//   assert.equal(canContainsMetaMatching("a/bZ", (meta) => meta.a), true)
// }

// {
//   const { addMetaAtPattern, canContainsMetaMatching } = createLocationMeta()
//   addMetaAtPattern("a/**/*.test.js", { a: true })

//   assert.equal(canContainsMetaMatching("a", (meta) => meta.a), true)
//   assert.equal(canContainsMetaMatching("a/b", (meta) => meta.a), true)
// }

// {
//   const { addMetaAtPattern, getMetaForLocation } = createLocationMeta()
//   addMetaAtPattern("index.js", { cover: true })
//   addMetaAtPattern("src/**/*.js", { cover: true })
//   addMetaAtPattern("src/**/*.jsx", { cover: true })
//   addMetaAtPattern("**/*.test.js", { cover: false })
//   addMetaAtPattern("**/*.test.jsx", { cover: false })
//   addMetaAtPattern("build", { cover: false })
//   addMetaAtPattern("src/exception.js", { cover: false })

//   assert.deepEqual(getMetaForLocation("index.js"), { cover: true })
//   assert.deepEqual(getMetaForLocation("src/file.js"), { cover: true })
//   assert.deepEqual(getMetaForLocation("src/folder/file.js"), { cover: true })
//   assert.deepEqual(getMetaForLocation("index.test.js"), { cover: false })
//   assert.deepEqual(getMetaForLocation("src/file.test.js"), { cover: false })
//   assert.deepEqual(getMetaForLocation("src/folder/file.test.js"), { cover: false })
//   assert.deepEqual(getMetaForLocation("build/index.js"), { cover: false })
//   assert.deepEqual(getMetaForLocation("src/exception.js"), { cover: false })
// }

{
  const { addMetaAtPattern, getMetaForLocation } = createLocationMeta()
  addMetaAtPattern("prefix*suffix", { prettify: true })

  assert.deepEqual(getMetaForLocation("prefixandsuffix"), { prettify: true })
}

// {
//   const { addMetaAtPattern, getMetaForLocation } = createLocationMeta()
//   addMetaAtPattern("**/*.js", { prettify: true })
//   addMetaAtPattern("**/*.jsx", { prettify: true })
//   addMetaAtPattern("build", { prettify: false })
//   addMetaAtPattern("src/exception.js", { prettify: false })

//   assert.deepEqual(getMetaForLocation("index.js"), { prettify: true })
//   assert.deepEqual(getMetaForLocation("src/file.js"), { prettify: true })
//   assert.deepEqual(getMetaForLocation("src/folder/file.js"), { prettify: true })
//   assert.deepEqual(getMetaForLocation("index.test.js"), { prettify: true })
//   assert.deepEqual(getMetaForLocation("src/file.test.js"), { prettify: true })
//   assert.deepEqual(getMetaForLocation("src/folder/file.test.js"), { prettify: true })
//   assert.deepEqual(getMetaForLocation("src/exception.js"), { prettify: false })
// }

// addMetaAtPattern("**/*.js", { lint: true })
// addMetaAtPattern("**/*.jsx", { lint: true })
// addMetaAtPattern("build", { lint: false })

console.log("passed")
