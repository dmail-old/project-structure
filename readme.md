# project-structure

[![npm](https://badge.fury.io/js/%40dmail%2Fproject-structure.svg)](https://badge.fury.io/js/%40dmail%2Fproject-structure)
[![build](https://travis-ci.com/dmail/project-structure.svg?branch=master)](http://travis-ci.com/dmail/project-structure)
[![codecov](https://codecov.io/gh/dmail/project-structure/branch/master/graph/badge.svg)](https://codecov.io/gh/dmail/project-structure)

> Associate objects with patterns to describe a file structure

## Example

```js
import { ressourceToMeta } from "@dmail/project-structure"

const metaMap = {
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

ressourceToMeta(metaMap, "file.js") // { extension: "js", foo: true }
ressourceToMeta(metaMap, "file.json") // { extension: "json" }
```
