// @ts-check

// adds "describe.each" and "it.each" helpers
// https://github.com/bahmutov/cypress-each
import 'cypress-each'

// just for demo, see the split specs in the folder "visible-spec" instead
describe.skip('visible elements', () => {
  // simulate creating lots of tests by using the same selectors
  const selectors = [
    'header',
    'footer',
    '.new-todo',
    'header',
    'footer',
    '.new-todo',
    'header',
    'footer',
    '.new-todo',
  ]

  it.each(selectors)(
    (selector, k) => `testing ${k + 1} selector ${selector}`,
    (selector) => {
      cy.visit('/')
      // simulate slow-loading page
      cy.wait(10000)
      cy.get(selector).should('be.visible')
    },
  )
})
