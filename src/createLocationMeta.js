// https://git-scm.com/docs/gitignore

const partMatch = (pattern, part) => {
  const match = ({ patterns, parts, skipUntilStartsMatching = false }) => {
    let matched
    let patternIndex = 0
    let partIndex = 0

    if (patterns.length === 0 && parts.length === 0) {
      matched = true
    } else if (patterns.length === 0 && parts.length) {
      matched = false
    } else if (patterns.length && parts.length === 0) {
      matched = false
    } else {
      const isLastPartChar = () => partIndex === parts.length - 1
      const isLastPatternChar = () => patternIndex === patterns.length - 1

      while (true) {
        const patternChar = patterns[patternIndex]

        if (patternChar === "*") {
          // part = 'ab', pattern = 'a*', partChar = 'b'
          if (isLastPartChar() && isLastPatternChar()) {
            break
          }

          // part = 'abc', pattern = 'a*', partChar = 'c'
          if (isLastPartChar()) {
            break
          }

          // part = 'bac', pattern = 'b*', partChar = 'a'
          if (isLastPatternChar()) {
            break
          }

          // part = 'ab', pattern = '*', partChar = 'a'
          patternIndex++

          debugger
          const skipResult = match({
            patterns: patterns.slice(patternIndex),
            parts: parts.slice(partIndex),
            skipUntilStartsMatching: true,
          })

          patternIndex += skipResult.patternIndex
          partIndex += skipResult.partIndex

          if (skipResult.matched) {
            if (isLastPattern()) {
              break
            }
            if (isLastPart()) {
              break
            }
            continue
          }

          matched = false
          break
        }

        const partChar = parts[partIndex]

        if (patternChar === partChar) {
          // it starts matching, cool
          if (skipUntilStartsMatching) {
            skipUntilStartsMatching = false
          }

          // part = 'a', pattern = 'a', partChar = 'a'
          if (isLastPartChar() && isLastPatternChar()) {
            break
          }

          // part = 'ab', pattern = 'a', partChar = 'a'
          if (isLastPatternChar()) {
            matched = false
            break
          }

          // part = 'a', pattern = 'ab', partChar = 'a'
          // or
          // part = 'a', pattern = 'a*', partChar = 'a'
          if (isLastPartChar()) {
            patternIndex++
            continue
          }

          // part = 'ab', pattern = 'ab', partChar = 'a'
          partIndex++
          patternIndex++
          continue
        }

        if (skipUntilStartsMatching) {
          partIndex++
          continue
        }

        // part = 'ab', pattern = 'cd', partChar = 'a'
        matched = false
        break
      }

      return {
        matched,
        patternIndex,
        partIndex,
        remainingPattern: patterns.length - patternIndex,
      }
    }
  }

  return match({
    patterns: pattern.split(""),
    parts: part.split(""),
  })
}

const locationMatch = (pattern, location) => {
  const match = ({ patterns, parts }) => {
    let patternIndex = 0
    let partIndex = 0

    const isLastPart = () => partIndex === parts.length - 1
    const isLastPattern = () => patternIndex === patterns.length - 1
    let matched = true

    while (true) {
      const pattern = patterns[patternIndex]

      if (pattern === "**") {
        // location = 'a/b', pattern = 'a/**', part = 'b'
        if (isLastPart() && isLastPattern()) {
          break
        }

        // location = 'a/b', pattern = 'a/**', part = 'a'
        if (isLastPattern()) {
          break
        }

        // location = 'a/b', pattern = '**/b', part = 'b'
        if (isLastPart()) {
          patternIndex++
          continue
        }

        // location = 'a/b', pattern = '**/b', part = 'a'
        partIndex++
        patternIndex++

        const skipResult = match({
          patterns: patterns.slice(patternIndex),
          parts: parts.slice(partIndex),
        })

        patternIndex += skipResult.patternIndex
        partIndex += skipResult.partIndex
        matched = skipResult.matched

        if (matched) {
          if (isLastPattern()) {
            break
          }
          if (isLastPart()) {
            break
          }
          continue
        }

        break
      }

      const part = parts[partIndex]

      if (partMatch(pattern, part)) {
        // location = 'a/b', pattern = 'a/b', part = 'b'
        if (isLastPart() && isLastPattern()) {
          partIndex++
          break
        }

        // location = 'a', pattern = 'a/b', part = 'a'
        if (isLastPart()) {
          partIndex++
          matched = false
          break
        }

        // location = 'a/b', pattern = 'a', part = 'a'
        if (isLastPattern()) {
          partIndex++
          break
        }

        // location = 'a/b', pattern = 'a/b', part = 'a'
        partIndex++
        patternIndex++
        continue
      }

      // location = 'a/b', pattern = 'b/a', part = 'a'
      matched = false
      break
    }

    return {
      matched,
      patternIndex,
      partIndex,
      remainingPattern: patterns.length - patternIndex,
    }
  }

  return match({
    patterns: pattern.split("/"),
    parts: location.split("/"),
  })
}

export const createLocationMeta = () => {
  const patternAndMetaList = []

  const addMetaAtPattern = (pattern, meta) => {
    patternAndMetaList.push({
      pattern,
      meta,
    })
  }

  const getMetaForLocation = (filename) => {
    return patternAndMetaList.reduce((previousMeta, { pattern, meta }) => {
      const { matched } = locationMatch(pattern, filename)
      return matched ? { ...previousMeta, ...meta } : previousMeta
    }, {})
  }

  const canContainsMetaMatching = (filename, metaPredicate) => {
    return patternAndMetaList.some(({ pattern, meta }) => {
      const { partIndex } = locationMatch(pattern, filename)
      const parts = filename.split("/")
      return partIndex === parts.length && metaPredicate(meta)
    })
  }

  return {
    addMetaAtPattern,
    getMetaForLocation,
    canContainsMetaMatching,
  }
}
