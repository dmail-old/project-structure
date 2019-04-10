import { assert } from "@dmail/assert"
import { pathnameCanContainsMetaMatching } from "../../index.js"

{
  const metaDescription = {
    "/a/b": { a: true },
  }

  assert({
    actual: pathnameCanContainsMetaMatching({
      metaDescription,
      pathname: "/a",
      predicate: (meta) => meta.a,
    }),
    expected: true,
  })
  assert({
    actual: pathnameCanContainsMetaMatching({
      metaDescription,
      pathname: "/a/c",
      predicate: (meta) => meta.a,
    }),
    expected: false,
  })
  assert({
    actual: pathnameCanContainsMetaMatching({
      metaDescription,
      pathname: "/a/b",
      predicate: (meta) => meta.a,
    }),
    expected: true,
  })
}

{
  const metaDescription = {
    "/a/b*/c": { a: true },
  }

  assert({
    actual: pathnameCanContainsMetaMatching({
      metaDescription,
      pathname: "/a/bZ",
      predicate: (meta) => meta.a,
    }),
    expected: true,
  })
  assert({
    actual: pathnameCanContainsMetaMatching({
      metaDescription,
      pathname: "/a/bZ/c",
      predicate: (meta) => meta.a,
    }),
    expected: true,
  })
}

{
  const metaDescription = {
    "/a/**/b.js": { a: true },
  }

  assert({
    actual: pathnameCanContainsMetaMatching({
      metaDescription,
      pathname: "/a/b/c",
      predicate: (meta) => meta.a,
    }),
    expected: true,
  })
}

{
  const metaDescription = {
    "/**/*": { a: true },
    "/node_modules/": { a: false }, // eslint-disable-line camelcase
  }

  assert({
    actual: pathnameCanContainsMetaMatching({
      metaDescription,
      pathname: "/node_modules",
      predicate: (meta) => meta.a,
    }),
    expected: false,
  })
}

{
  const metaDescription = {
    "/**/*.js": { a: true },
    "/**/*.md": { a: false },
  }

  assert({
    actual: pathnameCanContainsMetaMatching({
      metaDescription,
      pathname: "/src",
      predicate: (meta) => meta.a,
    }),
    expected: true,
  })
}

{
  const metaDescription = {
    "/**/*.js": { a: true },
  }

  assert({
    actual: pathnameCanContainsMetaMatching({
      metaDescription,
      pathname: "/src/folder",
      predicate: (meta) => meta.a,
    }),
    expected: true,
  })
  assert({
    actual: pathnameCanContainsMetaMatching({
      metaDescription,
      pathname: "/src/folder/subfolder",
      predicate: (meta) => meta.a,
    }),
    expected: true,
  })
}

{
  const metaDescription = {
    "/src/**/*.js": { a: true },
  }

  assert({
    actual: pathnameCanContainsMetaMatching({
      metaDescription,
      pathname: "/src/jsCreateCompileService/compile",
      predicate: (meta) => meta.a,
    }),
    expected: true,
  })
}
