import { assert } from "@dmail/assert"
import { pathnameCanContainsMetaMatching } from "../../index.js"

const metaDescription = {
  "/**/*": { whatever: true },
  "/.git/": { whatever: false },
}

{
  const actual = pathnameCanContainsMetaMatching({
    pathname: "/src",
    metaDescription,
    predicate: ({ whatever }) => whatever,
  })
  const expected = true
  assert({ actual, expected })
}

{
  const actual = pathnameCanContainsMetaMatching({
    pathname: "/.git",
    metaDescription,
    predicate: ({ whatever }) => whatever,
  })
  const expected = false
  assert({ actual, expected })
}
