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
