import { assert } from "@dmail/assert"
import { pathnameToMeta } from "../../index.js"

const metaDescription = {
  "/**/*": { whatever: true },
  "/.git/": { whatever: false },
}

{
  const actual = pathnameToMeta({
    pathname: "/file.js",
    metaDescription,
  })
  const expected = { whatever: true }
  assert({ actual, expected })
}

{
  const actual = pathnameToMeta({
    pathname: "/.git/file.js",
    metaDescription,
  })
  const expected = { whatever: false }
  assert({ actual, expected })
}

{
  const actual = pathnameToMeta({
    pathname: "/file.js",
    metaDescription: {
      "/**/*": { whatever: false },
      "/*": { whatever: true },
    },
  })
  const expected = { whatever: true }
  assert({ actual, expected })
}

{
  const actual = pathnameToMeta({
    pathname: "/.git/file.js",
    metaDescription: {
      "/**/*": { whatever: false },
      "/*": { whatever: true },
    },
  })
  const expected = { whatever: false }
  assert({ actual, expected })
}
