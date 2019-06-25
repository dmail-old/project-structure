# project-structure

[![npm package](https://img.shields.io/npm/v/@dmail/project-structure.svg)](https://www.npmjs.com/package/@dmail/project-structure)
[![build](https://travis-ci.com/dmail/project-structure.svg?branch=master)](http://travis-ci.com/dmail/project-structure)
[![codecov](https://codecov.io/gh/dmail/project-structure/branch/master/graph/badge.svg)](https://codecov.io/gh/dmail/project-structure)

> Associate data to pathname using pattern.

## Example

```js
import { pathnameToMeta } from "@dmail/project-structure"

const metaDescription = {
  "/*.js": {
    extension: "js",
  },
  "/*.json": {
    extension: "json",
  },
  "/file.js": {
    foo: true,
  },
}

pathnameToMeta({ pathname: "/file.js", metaDescription }) // { extension: "js", foo: true }
pathnameToMeta({ pathname: "/file.json", metaDescription }) // { extension: "json" }
```

## Interactive example

You can test if a pathname matches a pattern at the following url:
https://dmail.github.io/project-structure/interactive-example.html
