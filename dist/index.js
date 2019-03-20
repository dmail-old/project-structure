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

// https://git-scm.com/docs/gitignore
// https://github.com/kaelzhang/node-ignore

/*
{
  matched: Boolean, // true false if value match
  highestMatchingIndex: Number, // the index at which we were able to determine value matched or not
}
*/
const pathnameMatch = ({
  pattern,
  pathname
}) => {
  if (typeof pattern !== "string") throw new TypeError(`pattern must be a string.
pattern: ${pattern}`);
  if (pattern[0] !== "/") throw new Error(`pattern must start with /.
pattern: ${pattern}`);
  if (typeof pathname !== "string") throw new TypeError(`pathname must be a string.
pathname: ${pathname}`);
  if (pathname[0] !== "/") throw new Error(`pathname must start with /.
pathname: ${pathname}`);
  return match({
    pattern,
    pathname
  });
};

const match = ({
  pattern,
  pathname
}) => {
  let patternIndex = 0;
  let pathnameIndex = 0;
  let remainingPattern = pattern;
  let remainingPathname = pathname; // eslint-disable-next-line no-constant-condition

  while (true) {
    //  '' === '' -> pass
    if (remainingPattern === "" && remainingPathname === "") {
      return pass({
        patternIndex,
        pathnameIndex
      });
    } // '' === value -> fail


    if (remainingPattern === "" && remainingPathname !== "") {
      return fail({
        patternIndex,
        pathnameIndex
      });
    } // pattern === '' -> pass only if pattern is only **


    if (remainingPattern !== "" && remainingPathname === "") {
      // pass because pattern is optionnal
      if (remainingPattern === "**") {
        return pass({
          patternIndex,
          pathnameIndex
        });
      } // fail because **/ would expect something like /a
      // and **a would expect something like foo/bar/a


      return fail({
        patternIndex,
        pathnameIndex
      });
    }

    if (remainingPattern.slice(0, "**".length) === "**") {
      patternIndex += `**`.length;
      remainingPattern = remainingPattern.slice(`**`.length);

      if (remainingPattern[0] === "/") {
        patternIndex += "/".length;
        remainingPattern = remainingPattern.slice("/".length);
      } // pattern ending with ** always match remaining pathname


      if (remainingPattern === "") {
        return pass({
          patternIndex,
          pathnameIndex: pathname.length
        });
      }

      const skipResult = skipUntilMatch({
        pattern: remainingPattern,
        pathname: remainingPathname
      });

      if (!skipResult.matched) {
        return fail({
          patternIndex: patternIndex + skipResult.patternIndex,
          pathnameIndex: pathnameIndex + skipResult.pathnameIndex
        });
      }

      return pass({
        patternIndex: pattern.length,
        pathnameIndex: pathname.length
      });
    }

    if (remainingPattern[0] === "*") {
      patternIndex += "*".length;
      remainingPattern = remainingPattern.slice("*".length); // la c'est plus délicat, il faut que remainingPathname
      // ne soit composé que de truc !== '/'

      if (remainingPattern === "") {
        const slashIndex = remainingPathname.indexOf("/");

        if (slashIndex > -1) {
          return fail({
            patternIndex,
            pathnameIndex: pathnameIndex + slashIndex
          });
        }

        return pass({
          patternIndex,
          pathnameIndex: pathname.length
        });
      } // the next char must not the one expected by remainingPattern[0]
      // because * is greedy and expect to skip one char


      if (remainingPattern[0] === remainingPathname[0]) {
        return fail({
          patternIndex: patternIndex - "*".length,
          pathnameIndex
        });
      }

      const skipResult = skipUntilMatch({
        pattern: remainingPattern,
        pathname: remainingPathname,
        skippablePredicate: remainingPathname => remainingPathname[0] !== "/"
      });

      if (!skipResult.matched) {
        return fail({
          patternIndex: patternIndex + skipResult.patternIndex,
          pathnameIndex: pathnameIndex + skipResult.pathnameIndex
        });
      }

      return pass({
        patternIndex: pattern.length,
        pathnameIndex: pathname.length
      });
    }

    if (remainingPattern[0] !== remainingPathname[0]) {
      return fail({
        patternIndex,
        pathnameIndex
      });
    } // trailing slash on pattern, -> match remaining


    if (remainingPattern === "/" && remainingPathname.length > 1) {
      return pass({
        patternIndex: patternIndex + 1,
        pathnameIndex: pathname.length
      });
    }

    patternIndex += 1;
    pathnameIndex += 1;
    remainingPattern = remainingPattern.slice(1);
    remainingPathname = remainingPathname.slice(1);
    continue;
  }
};

const skipUntilMatch = ({
  pattern,
  pathname,
  skippablePredicate = () => true
}) => {
  let pathnameIndex = 0;
  let remainingPathname = pathname;
  let bestMatch = null; // eslint-disable-next-line no-constant-condition

  while (true) {
    const matchAttempt = match({
      pattern,
      pathname: remainingPathname
    });

    if (matchAttempt.matched) {
      bestMatch = matchAttempt;
      break;
    }

    const skippable = skippablePredicate(remainingPathname);
    bestMatch = fail({
      patternIndex: bestMatch ? Math.max(bestMatch.patternIndex, matchAttempt.patternIndex) : matchAttempt.patternIndex,
      pathnameIndex: pathnameIndex + matchAttempt.pathnameIndex
    });

    if (!skippable) {
      break;
    } // search against the next unattempted pathname


    pathnameIndex += matchAttempt.pathnameIndex + 1;
    remainingPathname = remainingPathname.slice(matchAttempt.pathnameIndex + 1);

    if (remainingPathname === "") {
      bestMatch = _objectSpread({}, bestMatch, {
        pathnameIndex: pathname.length
      });
      break;
    }

    continue;
  }

  return bestMatch;
};

const pass = ({
  patternIndex,
  pathnameIndex
}) => {
  return {
    matched: true,
    patternIndex,
    pathnameIndex
  };
};

const fail = ({
  patternIndex,
  pathnameIndex
}) => {
  return {
    matched: false,
    patternIndex,
    pathnameIndex
  };
};

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

const pathnameCanContainsMetaMatching = ({
  pathname,
  metaDescription,
  predicate
}) => {
  if (typeof pathname !== "string") throw new TypeError(`pathname must be a string, got ${pathname}`);
  if (typeof metaDescription !== "object") throw new TypeError(`metaDescription must be an object, got ${metaDescription}`);
  if (typeof predicate !== "function") throw new TypeError(`predicate must be a function, got ${predicate}`); // we add a trailing slash because we are intested into what will be inside
  // this pathname, not the pathname itself
  // it allows to match pattern for what is inside that pathname

  const pathnameWithTrailingSlash = `${pathname}/`; // for full match we must create an object to allow pattern to override previous ones

  let fullMatchMeta = {};
  let someFullMatch = false; // for partial match, any meta satisfying predicate will be valid because
  // we don't know for sure if pattern will still match for a file inside pathname

  const partialMatchMetaArray = [];
  Object.keys(metaDescription).forEach(pattern => {
    const {
      matched,
      pathnameIndex
    } = pathnameMatch({
      pathname: pathnameWithTrailingSlash,
      pattern
    });

    if (matched) {
      someFullMatch = true;
      fullMatchMeta = _objectSpread({}, fullMatchMeta, metaDescription[pattern]);
    } else if (someFullMatch === false && pathnameIndex >= pathname.length) {
      partialMatchMetaArray.push(metaDescription[pattern]);
    }
  });
  if (someFullMatch) return Boolean(predicate(fullMatchMeta));
  return partialMatchMetaArray.some(partialMatchMeta => predicate(partialMatchMeta));
};

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

const selectAllFileInsideFolder = async ({
  cancellationToken = createCancellationToken(),
  pathname: rootFolderPathname,
  metaDescription,
  predicate,
  transformFile = file => file
}) => {
  if (typeof rootFolderPathname !== "string") throw new TypeError(`pathname must be a string, got ${rootFolderPathname}`);
  if (typeof metaDescription !== "object") throw new TypeError(`metaMap must be a object, got ${metaDescription}`);
  if (typeof predicate !== "function") throw new TypeError(`predicate must be a function, got ${predicate}`);
  if (typeof transformFile !== "function") throw new TypeError(`transformFile must be a function, got ${transformFile}`);
  const results = [];

  const visitFolder = async folder => {
    const folderBasenameArray = await createOperation({
      cancellationToken,
      start: () => readDirectory(folder)
    });
    await Promise.all(folderBasenameArray.map(async basename => {
      const pathname = `${folder}/${basename}`;
      const pathnameRelative = pathnameToRelativePathname(pathname, rootFolderPathname);
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
            filenameRelative: pathnameRelative.slice(1),
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

  await visitFolder(rootFolderPathname);
  return results;
};

const pathnameToRelativePathname = (pathname, parentPathname) => {
  return pathname.slice(parentPathname.length);
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

exports.pathnameMatch = pathnameMatch;
exports.selectAllFileInsideFolder = selectAllFileInsideFolder;
exports.pathnameCanContainsMetaMatching = pathnameCanContainsMetaMatching;
exports.pathnameToMeta = pathnameToMeta;
exports.namedValueDescriptionToMetaDescription = namedValueDescriptionToMetaDescription;
//# sourceMappingURL=index.js.map
