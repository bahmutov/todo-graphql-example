// @ts-check

import selectors from './selectors.json'
import { testTitle, testElementSelector } from './utils'

describe('visible elements', () => {
  // there are 3 spec files testing the "selectors" list
  // this spec file will pick the selectors 0, 3, 6, etc.
  const filteredSelectors = selectors.filter((x, k) => k % 3 === 0)
  it.each(filteredSelectors)(testTitle, testElementSelector)
})
