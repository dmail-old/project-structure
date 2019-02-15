import { assert } from "@dmail/assert"
import { pathnameToMeta } from "../../index.js"

{
  const metaDescription = {
    foo: { a: true },
  }

  assert({
    actual: pathnameToMeta({ metaDescription, pathname: "" }),
    expected: {},
  })
}

{
  const metaDescription = {
    foo: { a: true },
  }

  assert({
    actual: pathnameToMeta({ metaDescription, pathname: "/" }),
    expected: {},
  })
}

{
  const metaDescription = {
    foo: { a: true },
  }

  assert({
    actual: pathnameToMeta({ metaDescription, pathname: "foo" }),
    expected: { a: true },
  })
}

{
  const metaDescription = {
    a: { a: true },
  }

  assert({
    actual: pathnameToMeta({ metaDescription, pathname: "a" }),
    expected: { a: true },
  })
  assert({
    actual: pathnameToMeta({ metaDescription, pathname: "a.js" }),
    expected: {},
  })
  assert({
    actual: pathnameToMeta({ metaDescription, pathname: "a/b" }),
    expected: { a: true },
  })
  assert({
    actual: pathnameToMeta({ metaDescription, pathname: "a/b.js" }),
    expected: { a: true },
  })
}

{
  const metaDescription = {
    "b/a": { a: true },
  }

  assert({
    actual: pathnameToMeta({ metaDescription, pathname: "b/a" }),
    expected: { a: true },
  })
  assert({
    actual: pathnameToMeta({ metaDescription, pathname: "b/a.js" }),
    expected: {},
  })
  assert({
    actual: pathnameToMeta({ metaDescription, pathname: "b/c" }),
    expected: {},
  })
  assert({
    actual: pathnameToMeta({ metaDescription, pathname: "b/a/c" }),
    expected: { a: true },
  })
}

{
  const metaDescription = {
    dist: { a: 0 },
  }

  assert({
    actual: pathnameToMeta({ metaDescription, pathname: "dist" }),
    expected: { a: 0 },
  })
  assert({
    actual: pathnameToMeta({ metaDescription, pathname: "a/dist" }),
    expected: {},
  })
}

console.log("passed")
