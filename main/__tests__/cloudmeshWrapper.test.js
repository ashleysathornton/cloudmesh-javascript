import CloudmeshWrapper from '../cloudmeshWrapper'

test('Object init', () => {
  const cm = new CloudmeshWrapper()
  expect(cm).toBeInstanceOf(CloudmeshWrapper)
})

test('cms command prop', () => {
  let cm = new CloudmeshWrapper('cms')
  expect(cm.cms).toBe('cms')

  cm = new CloudmeshWrapper('cmsd')
  expect(cm.cms).toBe('cmsd')
})
