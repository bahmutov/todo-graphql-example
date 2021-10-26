// @ts-check

import selectors from './selectors.json'
import { testTitle, testElementSelector } from './utils'

describe('visible elements', () => {
  const filteredSelectors = selectors.filter((x, k) => k % 3 === 2)
  it.each(filteredSelectors)(testTitle, testElementSelector)
})
