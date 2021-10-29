// adds "describe.each" and "it.each" helpers
// https://github.com/bahmutov/cypress-each
require('cypress-each')

// https://github.com/bahmutov/cypress-grep
require('cypress-grep')()

import { createItems } from '../integration/utils'

Cypress.Commands.add('createTodos', (titles) => {
  const items = titles.map((title) => ({
    title,
    completed: false,
  }))
  return createItems(items)
})
