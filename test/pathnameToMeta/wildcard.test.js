import { assert } from "@dmail/assert"
import { pathnameToMeta } from "../../index.js"

{
  const metaDescription = {
    "*a": { a: true },
  }

  assert({ actual: pathnameToMeta({ metaDescription, pathname: "a" }), expected: { a: true } })
  assert({ actual: pathnameToMeta({ metaDescription, pathname: "Za" }), expected: { a: true } })
  assert({ actual: pathnameToMeta({ metaDescription, pathname: "ZZZa" }), expected: { a: true } })
  assert({ actual: pathnameToMeta({ metaDescription, pathname: "aZ" }), expected: {} })
}

{
  const metaDescription = {
    "a*": { a: true },
  }

  assert({ actual: pathnameToMeta({ metaDescription, pathname: "a" }), expected: { a: true } })
  assert({ actual: pathnameToMeta({ metaDescription, pathname: "aZ" }), expected: { a: true } })
  assert({ actual: pathnameToMeta({ metaDescription, pathname: "aZZZ" }), expected: { a: true } })
  assert({ actual: pathnameToMeta({ metaDescription, pathname: "Za" }), expected: {} })
}

{
  const metaDescription = {
    "*a*": { a: true },
  }

  assert({ actual: pathnameToMeta({ metaDescription, pathname: "a" }), expected: { a: true } })
  assert({ actual: pathnameToMeta({ metaDescription, pathname: "Za" }), expected: { a: true } })
  assert({ actual: pathnameToMeta({ metaDescription, pathname: "aZ" }), expected: { a: true } })
  assert({ actual: pathnameToMeta({ metaDescription, pathname: "ZZa" }), expected: { a: true } })
  assert({ actual: pathnameToMeta({ metaDescription, pathname: "aZZ" }), expected: { a: true } })
  assert({ actual: pathnameToMeta({ metaDescription, pathname: "ZaZ" }), expected: { a: true } })
  assert({ actual: pathnameToMeta({ metaDescription, pathname: "ZZaZZ" }), expected: { a: true } })
}

{
  const metaDescription = {
    "a*bc": { a: true },
  }

  assert({ actual: pathnameToMeta({ metaDescription, pathname: "abc" }), expected: { a: true } })
  assert({ actual: pathnameToMeta({ metaDescription, pathname: "aZZbc" }), expected: { a: true } })
  assert({ actual: pathnameToMeta({ metaDescription, pathname: "aZZbd" }), expected: {} })
}
