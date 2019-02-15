'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var fs = _interopDefault(require('fs'));

// TODO: externalize this into '@dmail/helper'

// https://github.com/tc39/proposal-cancellation/tree/master/stage0

const createCancellationToken = () => {
  const register = (callback) => {
    return {
      callback,
      unregister: () => {},
    }
  };

  const throwIfRequested = () => undefined;

  return {
    register,
    cancellationRequested: false,
    throwIfRequested,
  }
};

const createOperation = ({
  cancellationToken = createCancellationToken(),
  start,
  ...rest
}) => {
  ensureExactParameters$1(rest);
  cancellationToken.throwIfRequested();

  const promise = new Promise((resolve) => {
    resolve(start());
  });
  const cancelPromise = new Promise((resolve, reject) => {
    const cancelRegistration = cancellationToken.register((cancelError) => {
      cancelRegistration.unregister();
      reject(cancelError);
    });
    promise.then(cancelRegistration.unregister, () => {});
  });
  const operationPromise = Promise.race([promise, cancelPromise]);

  return operationPromise
};

const ensureExactParameters$1 = (extraParameters) => {
  const extraParamNames = Object.keys(extraParameters);
  if (extraParamNames.length)
    throw new Error(`createOperation expect only cancellationToken, start. Got ${extraParamNames}`)
};

// https://git-scm.com/docs/gitignore
// https://github.com/kaelzhang/node-ignore
const pathnameMatch = ({
  pathname,
  pattern
}) => {
  return match({
    patterns: pattern.split("/"),
    parts: pathname.split("/"),
    lastPatternRequired: false,
    lastSkipRequired: true,
    skipPredicate: sequencePattern => sequencePattern === "**",
    matchPart: (sequencePattern, sequencePart) => {
      return match({
        patterns: sequencePattern.split(""),
        parts: sequencePart.split(""),
        lastPatternRequired: true,
        lastSkipRequired: false,
        skipPredicate: charPattern => charPattern === "*",
        matchPart: (charPattern, charSource) => {
          const matched = charPattern === charSource;
          return {
            matched,
            patternIndex: 0,
            partIndex: 0,
            matchIndex: matched ? 1 : 0
          };
        }
      });
    }
  });
};

const match = ({
  patterns,
  parts,
  skipPredicate,
  lastSkipRequired,
  lastPatternRequired,
  matchPart,
  skipUntilStartsMatching = false
}) => {
  let matched;
  let patternIndex = 0;
  let partIndex = 0;
  let matchIndex = 0;

  if (patterns.length === 0 && parts.length === 0) {
    matched = true;
  } else if (patterns.length === 0 && parts.length) {
    matched = true;
    matchIndex = parts.length;
  } else if (patterns.length && parts.length === 0) {
    matched = false;
  } else {
    matched = true; // eslint-disable-next-line no-constant-condition

    while (true) {
      const pattern = patterns[patternIndex];
      const part = parts[partIndex];
      const isSkipPattern = skipPredicate(pattern);
      const isLastPattern = patternIndex === patterns.length - 1;
      const isLastPart = partIndex === parts.length - 1;

      if (isSkipPattern && isLastPart && isLastPattern) {
        matchIndex += part.length;
        break;
      }

      if (isSkipPattern && isLastPattern && isLastPart === false) {
        matchIndex += part.length;
        break;
      }

      if (isSkipPattern && isLastPattern === false && isLastPart) {
        // test next pattern on current part
        patternIndex++;
        const nextPatternResult = match({
          patterns: patterns.slice(patternIndex),
          parts: parts.slice(partIndex),
          skipPredicate,
          lastSkipRequired,
          lastPatternRequired,
          matchPart
        });
        matched = nextPatternResult.matched;
        patternIndex += nextPatternResult.patternIndex;
        partIndex += nextPatternResult.partIndex;

        if (matched && patternIndex === patterns.length - 1) {
          matchIndex += nextPatternResult.matchIndex;
          break;
        }

        if (matched && partIndex === parts.length - 1) {
          matchIndex += nextPatternResult.matchIndex;
          break;
        }

        if (matched) {
          matchIndex += nextPatternResult.matchIndex;
          continue;
        } // we still increase the matchIndex by the length of the part because
        // this part has matched even if the full pattern is not satisfied


        matchIndex += part.length;
        break;
      }

      if (isSkipPattern && isLastPattern === false && isLastPart === false) {
        // test next pattern on current part
        patternIndex++;
        const skipResult = match({
          patterns: patterns.slice(patternIndex),
          parts: parts.slice(partIndex),
          skipPredicate,
          lastSkipRequired,
          lastPatternRequired,
          matchPart,
          skipUntilStartsMatching: true
        });
        matched = skipResult.matched;
        patternIndex += skipResult.patternIndex;
        partIndex += skipResult.partIndex;
        matchIndex += skipResult.matchIndex;

        if (matched && patternIndex === patterns.length - 1) {
          break;
        }

        if (matched && partIndex === parts.length - 1) {
          break;
        }

        if (matched) {
          continue;
        }

        break;
      }

      const partMatch = matchPart(pattern, part);
      matched = partMatch.matched;
      matchIndex += partMatch.matchIndex;

      if (matched === false && skipUntilStartsMatching) {
        matchIndex += part.length;
      }

      if (matched && isLastPattern && isLastPart) {
        break;
      }

      if (matched && isLastPattern && isLastPart === false) {
        if (lastPatternRequired) {
          matched = false;
        }

        break;
      }

      if (matched && isLastPattern === false && isLastPart) {
        const remainingPatternAreSkip = patterns.slice(patternIndex + 1).every(pattern => skipPredicate(pattern));

        if (remainingPatternAreSkip && lastSkipRequired) {
          matched = false;
          break;
        }

        if (remainingPatternAreSkip === false) {
          matched = false;
          break;
        }

        break;
      }

      if (matched && isLastPattern === false && isLastPart === false) {
        patternIndex++;
        partIndex++;
        continue;
      }

      if (matched === false && skipUntilStartsMatching && isLastPart === false) {
        partIndex++; // keep searching for that pattern

        continue;
      }

      break;
    }
  }

  return {
    matched,
    matchIndex,
    patternIndex,
    partIndex
  };
};

function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
}

function _objectSpread(target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i] != null ? arguments[i] : {};
    var ownKeys = Object.keys(source);

    if (typeof Object.getOwnPropertySymbols === 'function') {
      ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) {
        return Object.getOwnPropertyDescriptor(source, sym).enumerable;
      }));
    }

    ownKeys.forEach(function (key) {
      _defineProperty(target, key, source[key]);
    });
  }

  return target;
}

const pathnameToMeta = ({
  pathname,
  metaDescription
}) => {
  return Object.keys(metaDescription).reduce((previousMeta, metaPattern) => {
    const {
      matched
    } = pathnameMatch({
      pathname,
      pattern: metaPattern
    });
    return matched ? _objectSpread({}, previousMeta, metaDescription[metaPattern]) : previousMeta;
  }, {});
};

const pathnameCanContainsMetaMatching = ({
  pathname,
  metaDescription,
  predicate
}) => {
  if (typeof pathname !== "string") throw new TypeError(`pathname must be a string, got ${pathname}`);
  if (typeof metaDescription !== "object") throw new TypeError(`metaDescription must be an object, got ${metaDescription}`);
  if (typeof predicate !== "function") throw new TypeError(`predicate must be a function, got ${predicate}`);
  const matchIndexForFolder = pathname.split("/").join("").length;
  const partialMatch = Object.keys(metaDescription).some(pattern => {
    const {
      matched,
      matchIndex
    } = pathnameMatch({
      pathname,
      pattern
    });
    return matched === false && matchIndex >= matchIndexForFolder && predicate(metaDescription[pattern]);
  });
  if (partialMatch) return true; // no partial match satisfies predicate, does it work on a full match ?

  const meta = pathnameToMeta({
    pathname,
    metaDescription
  });
  return Boolean(predicate(meta));
};

const selectAllFileInsideFolder = async ({
  cancellationToken = createCancellationToken(),
  pathname: entryPathname,
  metaDescription,
  predicate,
  transformFile = file => file
}) => {
  if (typeof entryPathname !== "string") throw new TypeError(`pathname must be a string, got ${entryPathname}`);
  if (typeof metaDescription !== "object") throw new TypeError(`metaMap must be a object, got ${metaDescription}`);
  if (typeof predicate !== "function") throw new TypeError(`predicate must be a function, got ${predicate}`);
  if (typeof transformFile !== "function") throw new TypeError(`transformFile must be a function, got ${transformFile}`);
  const results = [];

  const visitFolder = async folderPathname => {
    const names = await createOperation({
      cancellationToken,
      start: () => readDirectory(folderPathname)
    });
    await Promise.all(names.map(async name => {
      const pathname = `${folderPathname}/${name}`;
      const pathnameRelative = pathnameToRelativePathname(pathname, entryPathname);
      const lstat = await createOperation({
        cancellationToken,
        start: () => readLStat(pathname)
      });

      if (lstat.isDirectory()) {
        if (!pathnameCanContainsMetaMatching({
          pathname: pathnameRelative,
          metaDescription,
          predicate
        })) return null;
        return visitFolder(pathname);
      }

      if (lstat.isFile()) {
        const meta = pathnameToMeta({
          pathname: pathnameRelative,
          metaDescription
        });

        if (!predicate(meta)) {
          return null;
        }

        const result = await createOperation({
          cancellationToken,
          start: () => transformFile({
            filenameRelative: pathnameRelative,
            meta,
            lstat
          })
        });
        results.push(result);
        return null;
      } // we ignore symlink because entryFolder is recursively traversed
      // so symlinked file will be discovered.
      // Moreover if they lead outside of entryFolder it can become a problem
      // like infinite recursion of whatever.
      // that we could handle using an object of pathname already seen but it will be useless
      // because entryFolder is recursively traversed


      return null;
    }));
  };

  await visitFolder(entryPathname);
  return results;
};

const pathnameToRelativePathname = (pathname, parentPathname) => {
  return pathname.slice(parentPathname.length + 1);
};

const readDirectory = pathname => new Promise((resolve, reject) => {
  fs.readdir(pathname, (error, names) => {
    if (error) {
      reject(error);
    } else {
      resolve(names);
    }
  });
});

const readLStat = pathname => new Promise((resolve, reject) => {
  fs.lstat(pathname, (error, stat) => {
    if (error) {
      reject(error);
    } else {
      resolve(stat);
    }
  });
});

const namedValueDescriptionToMetaDescription = namedValueDescription => {
  const metaDescription = {};
  Object.keys(namedValueDescription).forEach(name => {
    const valueDescription = namedValueDescription[name];
    Object.keys(valueDescription).forEach(pattern => {
      const value = valueDescription[pattern];
      const meta = {
        [name]: value
      };
      metaDescription[pattern] = pattern in metaDescription ? _objectSpread({}, metaDescription[pattern], meta) : meta;
    });
  });
  return metaDescription;
};

exports.selectAllFileInsideFolder = selectAllFileInsideFolder;
exports.pathnameCanContainsMetaMatching = pathnameCanContainsMetaMatching;
exports.pathnameToMeta = pathnameToMeta;
exports.namedValueDescriptionToMetaDescription = namedValueDescriptionToMetaDescription;
//# sourceMappingURL=index.js.map
