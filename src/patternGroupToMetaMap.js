export const patternGroupToMetaMap = (patternGroup) => {
  const metaMap = {}

  Object.keys(patternGroup).forEach((metaName) => {
    const valueMap = patternGroup[metaName]
    Object.keys(valueMap).forEach((pattern) => {
      const value = valueMap[pattern]
      const meta = { [metaName]: value }

      metaMap[pattern] = pattern in metaMap ? { ...metaMap[pattern], ...meta } : meta
    })
  })

  return metaMap
}
