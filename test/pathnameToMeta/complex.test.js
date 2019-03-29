import { assert } from "/node_modules/@dmail/assert/index.js"
import { pathnameToMeta } from "../../index.js"

{
  const metaDescription = {
    "/**/*.js": { js: true },
  }
  const actual = pathnameToMeta({
    metaDescription,
    pathname: "/file.es5.js/file.es5.js.map",
  })
  const expected = {}
  assert({ actual, expected })
}

{
  const metaDescription = {
    "/**/*.js": { js: true },
    "/**/*.js/**": { js: false },
  }
  const actual = pathnameToMeta({
    metaDescription,
    pathname: "/file.es5.js/file.es5.js.map",
  })
  const expected = { js: false }
  assert({ actual, expected })
}

{
  const metaDescription = {
    "/**/*.js": { js: true },
  }
  const actual = pathnameToMeta({ metaDescription, pathname: "/file.js.map" })
  const expected = {}
  assert({ actual, expected })
}

{
  const metaDescription = {
    "/**/*.js": { format: true },
    "/**/*.jsx": { format: true },
    "/build": { format: false },
    "/src/exception.js": { format: false },
  }

  assert({
    actual: pathnameToMeta({ metaDescription, pathname: "/index.js" }),
    expected: { format: true },
  })
  assert({
    actual: pathnameToMeta({ metaDescription, pathname: "/src/file.js" }),
    expected: { format: true },
  })
  assert({
    actual: pathnameToMeta({ metaDescription, pathname: "/src/folder/file.js" }),
    expected: { format: true },
  })
  assert({
    actual: pathnameToMeta({ metaDescription, pathname: "/index.test.js" }),
    expected: { format: true },
  })
  assert({
    actual: pathnameToMeta({ metaDescription, pathname: "/src/file.test.js" }),
    expected: { format: true },
  })
  assert({
    actual: pathnameToMeta({ metaDescription, pathname: "/src/folder/file.test.js" }),
    expected: { format: true },
  })
  assert({
    actual: pathnameToMeta({ metaDescription, pathname: "/src/exception.js" }),
    expected: { format: false },
  })
}

{
  const metaDescription = {
    "/index.js": { cover: true },
    "/src/**/*.js": { cover: true },
    "/src/**/*.jsx": { cover: true },
    "/**/*.test.js": { cover: false },
    "/**/*.test.jsx": { cover: false },
    "/build/": { cover: false },
    "/src/exception.js": { cover: false },
  }

  assert({
    actual: pathnameToMeta({ metaDescription, pathname: "/index.js" }),
    expected: { cover: true },
  })
  assert({
    actual: pathnameToMeta({ metaDescription, pathname: "/src/file.js" }),
    expected: { cover: true },
  })
  assert({
    actual: pathnameToMeta({ metaDescription, pathname: "/src/folder/file.js" }),
    expected: { cover: true },
  })
  assert({
    actual: pathnameToMeta({ metaDescription, pathname: "/index.test.js" }),
    expected: { cover: false },
  })
  assert({
    actual: pathnameToMeta({ metaDescription, pathname: "/src/file.test.js" }),
    expected: { cover: false },
  })
  assert({
    actual: pathnameToMeta({ metaDescription, pathname: "/src/folder/file.test.js" }),
    expected: { cover: false },
  })
  assert({
    actual: pathnameToMeta({ metaDescription, pathname: "/build/index.js" }),
    expected: { cover: false },
  })
  assert({
    actual: pathnameToMeta({ metaDescription, pathname: "/src/exception.js" }),
    expected: { cover: false },
  })
}
