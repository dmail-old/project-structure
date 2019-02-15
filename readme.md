# project-structure

[![npm](https://badge.fury.io/js/%40dmail%2Fproject-structure.svg)](https://badge.fury.io/js/%40dmail%2Fproject-structure)
[![build](https://travis-ci.com/dmail/project-structure.svg?branch=master)](http://travis-ci.com/dmail/project-structure)
[![codecov](https://codecov.io/gh/dmail/project-structure/branch/master/graph/badge.svg)](https://codecov.io/gh/dmail/project-structure)

> Associate data to file matching patterns

## Example

```js
import { pathnameToMeta } from "@dmail/project-structure"

const metaDescription = {
  "*.js": {
    extension: "js",
  },
  "*.json": {
    extension: "json",
  },
  "file.js": {
    foo: true,
  },
}

pathnameToMeta({ pathname: "file.js", metaDescription }) // { extension: "js", foo: true }
pathnameToMeta({ pathname: "file.json", metaDescription }) // { extension: "json" }
```
