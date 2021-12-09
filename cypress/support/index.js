// adds "describe.each" and "it.each" helpers
// https://github.com/bahmutov/cypress-each
require('cypress-each')

// https://github.com/bahmutov/cypress-grep
require('cypress-grep')()

beforeEach(() => {
  cy.task('beforeTest', Cypress.currentTest.title)
})

afterEach(() => {
  cy.task('afterTest', Cypress.currentTest.title)
})

// https://on.cypress.io/catalog-of-events
Cypress.on('fail', (err) => {
  console.error(err)
  const at = new Date().toISOString()
  err.message = at + '\n' + err.message
  throw err
})
