'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var fs = _interopDefault(require('fs'));

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

function _toConsumableArray(arr) {
  return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread();
}

function _arrayWithoutHoles(arr) {
  if (Array.isArray(arr)) {
    for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) arr2[i] = arr[i];

    return arr2;
  }
}

function _iterableToArray(iter) {
  if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter);
}

function _nonIterableSpread() {
  throw new TypeError("Invalid attempt to spread non-iterable instance");
}

// https://git-scm.com/docs/gitignore
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
    matched = true;

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

        matchIndex++;
        continue;
      }

      break;
    }

    return {
      matched,
      matchIndex,
      patternIndex,
      partIndex
    };
  }
};

const locationMatch = (pattern, location) => {
  return match({
    patterns: pattern.split("/"),
    parts: location.split("/"),
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

const createStructure = ({
  mergeMeta = (a, b) => _objectSpread({}, a, b)
} = {}) => {
  const patternAndMetaList = [];

  const addMetaAtPattern = (pattern, meta = {}) => {
    const existingPattern = patternAndMetaList.find(patternAndMeta => patternAndMeta.pattern === pattern);

    if (existingPattern) {
      existingPattern.meta = mergeMeta(existingPattern.meta, meta);
    } else {
      patternAndMetaList.push({
        pattern,
        meta
      });
    }
  };

  const getMetaForLocation = filename => {
    return patternAndMetaList.reduce((previousMeta, {
      pattern,
      meta
    }) => {
      const {
        matched
      } = locationMatch(pattern, filename);
      return matched ? mergeMeta(previousMeta, meta) : previousMeta;
    }, {});
  };

  const canContainsMetaMatching = (filename, metaPredicate) => {
    const matchIndexForFile = filename.split("/").join("").length;
    const partialMatch = patternAndMetaList.some(({
      pattern,
      meta
    }) => {
      const {
        matched,
        matchIndex
      } = locationMatch(pattern, filename);
      return matched === false && matchIndex >= matchIndexForFile && metaPredicate(meta);
    });

    if (partialMatch) {
      return true;
    } // no partial match satisfies predicate, does it work on a full match ?


    const meta = getMetaForLocation(filename);
    return Boolean(metaPredicate(meta));
  };

  const toJSON = () => {
    return patternAndMetaList;
  };

  return {
    addMetaAtPattern,
    getMetaForLocation,
    canContainsMetaMatching,
    toJSON
  };
};

const readDirectory = dirname => new Promise((resolve, reject) => {
  fs.readdir(dirname, (error, names) => {
    if (error) {
      reject(error);
    } else {
      resolve(names);
    }
  });
});

const readStat = filename => new Promise((resolve, reject) => {
  fs.stat(filename, (error, stat) => {
    if (error) {
      reject(error);
    } else {
      resolve(stat);
    }
  });
});

const nothingToDo = {};
const forEachFileMatching = ({
  getMetaForLocation,
  canContainsMetaMatching
}, root, metaPredicate, callback) => {
  const visit = folderRelativeLocation => {
    const folderAbsoluteLocation = folderRelativeLocation ? `${root}/${folderRelativeLocation}` : root;
    return readDirectory(folderAbsoluteLocation).then(names => {
      return Promise.all(names.map(name => {
        const ressourceRelativeLocation = folderRelativeLocation ? `${folderRelativeLocation}/${name}` : name;
        const ressourceAbsoluteLocation = `${root}/${ressourceRelativeLocation}`;
        return readStat(ressourceAbsoluteLocation).then(stat => {
          if (stat.isDirectory()) {
            if (canContainsMetaMatching(ressourceRelativeLocation, metaPredicate) === false) {
              return [nothingToDo];
            }

            return visit(ressourceRelativeLocation);
          }

          const meta = getMetaForLocation(ressourceRelativeLocation);

          if (metaPredicate(meta)) {
            return Promise.resolve(callback({
              absoluteName: ressourceAbsoluteLocation,
              relativeName: ressourceRelativeLocation,
              meta
            })).then(result => {
              return [result];
            });
          }

          return [nothingToDo];
        });
      })).then(results => {
        return results.reduce((previous, results) => {
          return _toConsumableArray(previous).concat(_toConsumableArray(results));
        }, []);
      });
    });
  };

  return visit().then(allResults => {
    return allResults.filter(result => result !== nothingToDo);
  });
};

const CONFIG_FILE_NAME = "structure.config.js";

const loadConfigFile = filename => {
  return new Promise((resolve, reject) => {
    let value;
    let errored = false;

    try {
      // eslint-disable-nextline no-dynamic-require
      value = require(filename);
    } catch (e) {
      value = e;
      errored = true;
    }

    if (errored) {
      const error = value;

      if (error && error.code === "MODULE_NOT_FOUND") {
        return reject(new Error(`${filename} not found`));
      }

      if (error && error.code === "SYNTAX_ERROR") {
        console.error(`${filename} contains a syntax error`);
        return reject(error);
      }

      if (error && error.code === "REFERENCE_ERROR") {
        console.error(`${filename} contains a reference error`);
        return reject(error);
      }

      return reject(error);
    }

    const namespace = value;
    const namespaceType = typeof namespace;

    if (namespaceType !== "object") {
      return reject(new TypeError(`${filename} must export an object, got ${namespaceType}`));
    }

    resolve(namespace || {});
  });
};

const convertConfigIntoStructure = config => {
  const structure = createStructure();
  const metas = config.metas || {};
  Object.keys(metas).forEach(metaName => {
    const metaPatterns = metas[metaName];
    Object.keys(metaPatterns).forEach(pattern => {
      const metaValue = metaPatterns[pattern];
      structure.addMetaAtPattern(pattern, {
        [metaName]: metaValue
      });
    });
  });
  return structure;
};
const createFileStructure = ({
  root,
  config = CONFIG_FILE_NAME
}) => {
  return loadConfigFile(`${root}/${config}`).then(config => {
    return convertConfigIntoStructure(config);
  }).then(structure => {
    const scopedForEachFileMatching = (predicate, callback) => forEachFileMatching(structure, root, predicate, callback);

    const listFileMatching = predicate => forEachFileMatching(structure, root, predicate, ({
      relativeName
    }) => relativeName);

    return _objectSpread({}, structure, {
      forEachFileMatching: scopedForEachFileMatching,
      listFileMatching
    });
  });
};

exports.createStructure = createStructure;
exports.forEachFileMatching = forEachFileMatching;
exports.createFileStructure = createFileStructure;
exports.convertConfigIntoStructure = convertConfigIntoStructure;
//# sourceMappingURL=index.js.map
