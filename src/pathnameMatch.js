// https://git-scm.com/docs/gitignore
// https://github.com/kaelzhang/node-ignore

/*
{
  matched: Boolean, // true false if value match
  highestMatchingIndex: Number, // the index at which we were able to determine value matched or not
}
*/

export const pathnameMatch = ({ pattern, pathname }) => {
  if (typeof pattern !== "string")
    throw new TypeError(`pattern must be a string.
pattern: ${pattern}`)
  if (pattern[0] !== "/")
    throw new Error(`pattern must start with /.
pattern: ${pattern}`)

  if (typeof pathname !== "string")
    throw new TypeError(`pathname must be a string.
pathname: ${pathname}`)
  if (pathname[0] !== "/")
    throw new Error(`pathname must start with /.
pathname: ${pathname}`)

  return match({ pattern, pathname })
}

const match = ({ pattern, pathname }) => {
  let patternIndex = 0
  let pathnameIndex = 0
  let remainingPattern = pattern
  let remainingPathname = pathname

  // eslint-disable-next-line no-constant-condition
  while (true) {
    //  '' === '' -> pass
    if (remainingPattern === "" && remainingPathname === "") {
      return pass({
        patternIndex,
        pathnameIndex,
      })
    }

    // '' === value -> fail
    if (remainingPattern === "" && remainingPathname !== "") {
      return fail({
        patternIndex,
        pathnameIndex,
      })
    }

    // pattern === '' -> pass only if pattern is only **
    if (remainingPattern !== "" && remainingPathname === "") {
      // pass because pattern is optionnal
      if (remainingPattern === "**") {
        return pass({
          patternIndex,
          pathnameIndex,
        })
      }

      // fail because **/ would expect something like /a
      // and **a would expect something like foo/bar/a
      return fail({
        patternIndex,
        pathnameIndex,
      })
    }

    if (remainingPattern.slice(0, "**".length) === "**") {
      patternIndex += `**`.length
      remainingPattern = remainingPattern.slice(`**`.length)
      if (remainingPattern[0] === "/") {
        patternIndex += "/".length
        remainingPattern = remainingPattern.slice("/".length)
      }

      // pattern ending with ** always match remaining pathname
      if (remainingPattern === "") {
        return pass({
          patternIndex,
          pathnameIndex: pathname.length,
        })
      }

      const skipResult = skipUntilMatch({ pattern: remainingPattern, pathname: remainingPathname })

      if (!skipResult.matched) {
        return fail({
          patternIndex: patternIndex + skipResult.patternIndex,
          pathnameIndex: pathnameIndex + skipResult.pathnameIndex,
        })
      }

      return pass({
        patternIndex: pattern.length,
        pathnameIndex: pathname.length,
      })
    }

    if (remainingPattern[0] === "*") {
      patternIndex += "*".length
      remainingPattern = remainingPattern.slice("*".length)

      // la c'est plus délicat, il faut que remainingPathname
      // ne soit composé que de truc !== '/'
      if (remainingPattern === "") {
        const slashIndex = remainingPathname.indexOf("/")
        if (slashIndex > -1) {
          return fail({
            patternIndex,
            pathnameIndex: pathnameIndex + slashIndex,
          })
        }
        return pass({
          patternIndex,
          pathnameIndex: pathname.length,
        })
      }

      // the next char must not the one expected by remainingPattern[0]
      // because * is greedy and expect to skip one char
      if (remainingPattern[0] === remainingPathname[0]) {
        return fail({
          patternIndex: patternIndex - "*".length,
          pathnameIndex,
        })
      }

      const skipResult = skipUntilMatch({
        pattern: remainingPattern,
        pathname: remainingPathname,
        skippablePredicate: (remainingPathname) => remainingPathname[0] !== "/",
      })

      if (!skipResult.matched) {
        return fail({
          patternIndex: patternIndex + skipResult.patternIndex,
          pathnameIndex: pathnameIndex + skipResult.pathnameIndex,
        })
      }

      return pass({
        patternIndex: pattern.length,
        pathnameIndex: pathname.length,
      })
    }

    if (remainingPattern[0] !== remainingPathname[0]) {
      return fail({
        patternIndex,
        pathnameIndex,
      })
    }

    // trailing slash on pattern, -> match remaining
    if (remainingPattern === "/" && remainingPathname.length > 1) {
      return pass({
        patternIndex: patternIndex + 1,
        pathnameIndex: pathname.length,
      })
    }

    patternIndex += 1
    pathnameIndex += 1
    remainingPattern = remainingPattern.slice(1)
    remainingPathname = remainingPathname.slice(1)
    continue
  }
}

const skipUntilMatch = ({ pattern, pathname, skippablePredicate = () => true }) => {
  let pathnameIndex = 0
  let remainingPathname = pathname
  let bestMatch = null

  // eslint-disable-next-line no-constant-condition
  while (true) {
    const matchAttempt = match({
      pattern,
      pathname: remainingPathname,
    })

    if (matchAttempt.matched) {
      bestMatch = matchAttempt
      break
    }

    const skippable = skippablePredicate(remainingPathname)

    bestMatch = fail({
      patternIndex: bestMatch
        ? Math.max(bestMatch.patternIndex, matchAttempt.patternIndex)
        : matchAttempt.patternIndex,
      pathnameIndex: pathnameIndex + matchAttempt.pathnameIndex,
    })

    if (!skippable) {
      break
    }

    // search against the next unattempted pathname
    pathnameIndex += matchAttempt.pathnameIndex + 1
    remainingPathname = remainingPathname.slice(matchAttempt.pathnameIndex + 1)
    if (remainingPathname === "") {
      bestMatch = {
        ...bestMatch,
        pathnameIndex: pathname.length,
      }
      break
    }

    continue
  }

  return bestMatch
}

const pass = ({ patternIndex, pathnameIndex }) => {
  return {
    matched: true,
    patternIndex,
    pathnameIndex,
  }
}

const fail = ({ patternIndex, pathnameIndex }) => {
  return {
    matched: false,
    patternIndex,
    pathnameIndex,
  }
}
