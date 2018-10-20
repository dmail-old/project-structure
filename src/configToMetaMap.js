export const configToMetaMap = (config) => {
  const metas = config.metas || {}
  const metaMap = {}

  Object.keys(metas).forEach((metaName) => {
    const metaPatterns = metas[metaName]
    Object.keys(metaPatterns).forEach((pattern) => {
      const metaValue = metaPatterns[pattern]
      const meta = { [metaName]: metaValue }

      metaMap[pattern] = pattern in metaMap ? { ...metaMap[pattern], ...meta } : meta
    })
  })

  return metaMap
}
