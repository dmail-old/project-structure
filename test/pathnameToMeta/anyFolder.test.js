// https://github.com/kaelzhang/node-ignore

import { assert } from "@dmail/assert"
import { pathnameToMeta } from "../../index.js"

{
  const metaDescription = {
    "**/a": { a: true },
  }

  assert({
    actual: pathnameToMeta({ metaDescription, pathname: "a" }),
    expected: { a: true },
  })
  assert({
    actual: pathnameToMeta({ metaDescription, pathname: "b/a" }),
    expected: { a: true },
  })
  assert({
    actual: pathnameToMeta({ metaDescription, pathname: "c/b/a" }),
    expected: { a: true },
  })
  assert({
    actual: pathnameToMeta({ metaDescription, pathname: "a.js" }),
    expected: {},
  })
}

{
  const metaDescription = {
    "a/**": { a: true },
  }

  assert({
    actual: pathnameToMeta({ metaDescription, pathname: "a" }),
    expected: {},
  })
  assert({
    actual: pathnameToMeta({ metaDescription, pathname: "a/b" }),
    expected: { a: true },
  })
  assert({
    actual: pathnameToMeta({ metaDescription, pathname: "a/b/c" }),
    expected: { a: true },
  })
  assert({
    actual: pathnameToMeta({ metaDescription, pathname: "a/a.js" }),
    expected: { a: true },
  })
  assert({
    actual: pathnameToMeta({ metaDescription, pathname: "a.js" }),
    expected: {},
  })
}

{
  const metaDescription = {
    "**/a/**": { a: true },
  }

  assert({
    actual: pathnameToMeta({ metaDescription, pathname: "a" }),
    expected: {},
  })
  assert({
    actual: pathnameToMeta({ metaDescription, pathname: "a/b" }),
    expected: { a: true },
  })
  assert({
    actual: pathnameToMeta({ metaDescription, pathname: "b/a/c" }),
    expected: { a: true },
  })
}

{
  const metaDescription = {
    "**/*": { a: true },
  }

  assert({
    actual: pathnameToMeta({ metaDescription, pathname: "a" }),
    expected: { a: true },
  })
  assert({
    actual: pathnameToMeta({ metaDescription, pathname: "node_modules" }),
    expected: { a: true },
  })
}

{
  const metaDescription = {
    "a/**/*.test.js": { a: true },
  }

  assert({
    actual: pathnameToMeta({ metaDescription, pathname: "a" }),
    expected: {},
  })
  assert({
    actual: pathnameToMeta({ metaDescription, pathname: "a/b.test.js" }),
    expected: { a: true },
  })
  assert({
    actual: pathnameToMeta({ metaDescription, pathname: "a/b.js" }),
    expected: {},
  })
  assert({
    actual: pathnameToMeta({ metaDescription, pathname: "a/b/c.test.js" }),
    expected: { a: true },
  })
}

{
  const metaDescription = {
    "**/*.js": { a: true },
  }

  assert({
    actual: pathnameToMeta({ metaDescription, pathname: "index.test.js" }),
    expected: { a: true },
  })
}

console.log("passed")
