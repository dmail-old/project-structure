// https://git-scm.com/docs/gitignore
// https://github.com/kaelzhang/node-ignore

export const ressourceMatch = (pattern, ressource) => {
  return match({
    patterns: pattern.split("/"),
    parts: ressource.split("/"),
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

    // eslint-disable-next-line no-constant-condition
    while (true) {
      const pattern = patterns[patternIndex]
      const part = parts[partIndex]
      const isSkipPattern = skipPredicate(pattern)
      const isLastPattern = patternIndex === patterns.length - 1
      const isLastPart = partIndex === parts.length - 1

      if (isSkipPattern && isLastPart && isLastPattern) {
        matchIndex += part.length
        break
      }

      if (isSkipPattern && isLastPattern && isLastPart === false) {
        matchIndex += part.length
        break
      }

      if (isSkipPattern && isLastPattern === false && isLastPart) {
        // test next pattern on current part
        patternIndex++
        const nextPatternResult = match({
          patterns: patterns.slice(patternIndex),
          parts: parts.slice(partIndex),
          skipPredicate,
          lastSkipRequired,
          lastPatternRequired,
          matchPart,
        })
        matched = nextPatternResult.matched
        patternIndex += nextPatternResult.patternIndex
        partIndex += nextPatternResult.partIndex

        if (matched && patternIndex === patterns.length - 1) {
          matchIndex += nextPatternResult.matchIndex
          break
        }
        if (matched && partIndex === parts.length - 1) {
          matchIndex += nextPatternResult.matchIndex
          break
        }
        if (matched) {
          matchIndex += nextPatternResult.matchIndex
          continue
        }

        // we still increase the matchIndex by the length of the part because
        // this part has matched even if the full pattern is not satisfied
        matchIndex += part.length
        break
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
      if (matched === false && skipUntilStartsMatching) {
        matchIndex += part.length
      }

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
        continue
      }

      break
    }
  }

  return {
    matched,
    matchIndex,
    patternIndex,
    partIndex,
  }
}
