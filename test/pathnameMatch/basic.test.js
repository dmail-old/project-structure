import { assert } from "/node_modules/@dmail/assert/index.js"
import { pathnameMatch } from "../../index.js"

{
  const actual = pathnameMatch({ pathname: "/foo.js", pattern: "/foo.js" })
  const expected = {
    matched: true,
    patternIndex: 7,
    pathnameIndex: 7,
  }
  assert({ actual, expected })
}

{
  const actual = pathnameMatch({ pathname: "/foo.js", pattern: "/bar.js" })
  const expected = {
    matched: false,
    patternIndex: 1,
    pathnameIndex: 1,
  }
  assert({ actual, expected })
}
