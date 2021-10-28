// @ts-check

import selectors from './selectors.json'
import { testTitle, testElementSelector } from './utils'

describe('visible elements', { tags: '@visible' }, () => {
  const filteredSelectors = selectors.filter((x, k) => k % 3 === 1)
  it.each(filteredSelectors)(testTitle, testElementSelector)
})
