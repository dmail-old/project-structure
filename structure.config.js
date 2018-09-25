module.exports = {
  metas: [
    // source
    { pattern: "index.js", meta: { source: true } },
    { pattern: "src/**/*.js", meta: { source: true } },
    { pattern: "src/**/*.test.js", meta: { source: false } },

    // test
    { pattern: "src/**/*.test.js", meta: { test: true } },
  ],
}
