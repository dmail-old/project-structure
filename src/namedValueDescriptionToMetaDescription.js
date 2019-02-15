export const namedValueDescriptionToMetaDescription = (namedValueDescription) => {
  const metaDescription = {}

  Object.keys(namedValueDescription).forEach((name) => {
    const valueDescription = namedValueDescription[name]
    Object.keys(valueDescription).forEach((pattern) => {
      const value = valueDescription[pattern]
      const meta = { [name]: value }

      metaDescription[pattern] =
        pattern in metaDescription ? { ...metaDescription[pattern], ...meta } : meta
    })
  })

  return metaDescription
}
