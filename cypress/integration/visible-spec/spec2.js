// @ts-check

// adds "describe.each" and "it.each" helpers
// https://github.com/bahmutov/cypress-each
import 'cypress-each'
import selectors from './selectors.json'
import { testTitle, testElementSelector } from './utils'

describe('visible elements', () => {
  const filteredSelectors = selectors.filter((x, k) => k % 3 === 1)
  it.each(filteredSelectors)(testTitle, testElementSelector)
})
