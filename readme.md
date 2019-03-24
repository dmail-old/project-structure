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

## Pathname pattern matching

This repository use a special specification to match a pathname and a pattern.
The concept is inspired from https://github.com/WICG/import-maps#specifier-remapping-examples.
Import map speficiation gives a special meaning to trailing slash and is considering to add more powerful approach to match a pathname.

I need a more powerful approach. You can get an idea of how pattern matching behaves thanks to the following examples:

### Pattern matching for `/folder/`.

| pathname        | match |
| --------------- | ----- |
| /folder         | false |
| /folder/        | true  |
| /folder/file.js | true  |

### Pattern matching for `/folder/*.js`.

| pathname          | match |
| ----------------- | ----- |
| /folder           | false |
| /folder/          | false |
| /folder/file.js   | true  |
| /folder/data.json | false |

### Pattern matching for `/**/folder/*.js`.

| pathname            | match |
| ------------------- | ----- |
| /folder/file.js     | true  |
| /foo/folder/file.js | true  |
| /folder/data.json   | false |
