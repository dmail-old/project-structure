// https://git-scm.com/docs/gitignore

const match = ({
  patterns,
  parts,
  skipPredicate,
  lastSkipRequired,
  lastPatternRequired,
  matchPart,
  skipUntilStartsMatching = false,
}) => {
  let matched
  let patternIndex = 0
  let partIndex = 0
  let matchIndex = 0

  if (patterns.length === 0 && parts.length === 0) {
    matched = true
  } else if (patterns.length === 0 && parts.length) {
    matched = true
    matchIndex = parts.length
  } else if (patterns.length && parts.length === 0) {
    matched = false
  } else {
    matched = true

    while (true) {
      const pattern = patterns[patternIndex]
      const part = parts[partIndex]
      const isSkipPattern = skipPredicate(pattern)
      const isLastPattern = patternIndex === patterns.length - 1
      const isLastPart = partIndex === parts.length - 1

      if (isSkipPattern && isLastPart && isLastPattern) {
        matchIndex++
        break
      }

      if (isSkipPattern && isLastPattern && isLastPart === false) {
        matchIndex++
        break
      }

      if (isSkipPattern && isLastPattern === false && isLastPart) {
        // test next pattern on current part
        patternIndex++
        continue
      }

      if (isSkipPattern && isLastPattern === false && isLastPart === false) {
        // test next pattern on current part
        patternIndex++

        const skipResult = match({
          patterns: patterns.slice(patternIndex),
          parts: parts.slice(partIndex),
          skipPredicate,
          lastSkipRequired,
          lastPatternRequired,
          matchPart,
          skipUntilStartsMatching: true,
        })

        matched = skipResult.matched
        patternIndex += skipResult.patternIndex
        partIndex += skipResult.partIndex
        matchIndex += skipResult.matchIndex

        if (matched && patternIndex === patterns.length - 1) {
          break
        }
        if (matched && partIndex === parts.length - 1) {
          break
        }
        if (matched) {
          continue
        }
        break
      }

      const partMatch = matchPart(pattern, part)
      matched = partMatch.matched
      matchIndex += partMatch.matchIndex

      if (matched && isLastPattern && isLastPart) {
        break
      }

      if (matched && isLastPattern && isLastPart === false) {
        if (lastPatternRequired) {
          matched = false
        }
        break
      }

      if (matched && isLastPattern === false && isLastPart) {
        const remainingPatternAreSkip = patterns
          .slice(patternIndex + 1)
          .every((pattern) => skipPredicate(pattern))

        if (remainingPatternAreSkip && lastSkipRequired) {
          matched = false
          break
        }
        if (remainingPatternAreSkip === false) {
          matched = false
          break
        }
        break
      }

      if (matched && isLastPattern === false && isLastPart === false) {
        patternIndex++
        partIndex++
        continue
      }

      if (matched === false && skipUntilStartsMatching && isLastPart === false) {
        partIndex++ // keep searching for that pattern
        matchIndex++
        continue
      }

      break
    }

    return {
      matched,
      matchIndex,
      patternIndex,
      partIndex,
    }
  }
}

const locationMatch = (pattern, location) => {
  return match({
    patterns: pattern.split("/"),
    parts: location.split("/"),
    lastPatternRequired: false,
    lastSkipRequired: true,
    skipPredicate: (sequencePattern) => sequencePattern === "**",
    matchPart: (sequencePattern, sequencePart) => {
      return match({
        patterns: sequencePattern.split(""),
        parts: sequencePart.split(""),
        lastPatternRequired: true,
        lastSkipRequired: false,
        skipPredicate: (charPattern) => charPattern === "*",
        matchPart: (charPattern, charSource) => {
          const matched = charPattern === charSource
          return {
            matched,
            patternIndex: 0,
            partIndex: 0,
            matchIndex: matched ? 1 : 0,
          }
        },
      })
    },
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
      const matchIndexForFile = filename.split("/").join("").length
      const { matched, matchIndex } = locationMatch(pattern, filename)
      return matched === false && matchIndex >= matchIndexForFile && metaPredicate(meta)
    })
  }

  return {
    addMetaAtPattern,
    getMetaForLocation,
    canContainsMetaMatching,
  }
}
