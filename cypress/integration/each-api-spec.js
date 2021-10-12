// @ts-check

// adds "describe.each" and "it.each" helpers
// https://github.com/bahmutov/cypress-each
import 'cypress-each'

// adds the "cy.api" command
// https://github.com/bahmutov/cy-api
import '@bahmutov/cy-api/support'

import { data } from '../fixtures/three.json'
import { deleteAll } from './utils'

describe('Creates each item', () => {
  beforeEach(deleteAll)

  beforeEach(() => {
    // visit the blank page
    // to better see the API requests and responses
    cy.window().then((win) => {
      win.location.href = 'about:blank'
    })
  })

  const titles = Cypress._.map(data.allTodos, 'title')
  const items = Cypress._.zip(titles, data.allTodos)

  /**
   * @typedef {Object} Item
   * @property {string} title
   * @property {boolean} completed
   */

  it.each(items)(
    'creates an item "%s"',
    /** @param {string} title */
    /** @param {Item} item */
    (title, item) => {
      // create the item using a network call
      cy.api({
        method: 'POST',
        url: 'http://localhost:3000/',
        body: {
          operationName: 'AddTodo',
          query: `
          mutation AddTodo($title: String!, $completed: Boolean!) {
            createTodo(title: $title, completed: $completed) {
              id
            }
          }
        `,
          variables: {
            title: item.title,
            completed: item.completed,
          },
        },
      })
      // visit the page and check the item is present
      cy.visit('/')
      const classAssertion = item.completed ? 'have.class' : 'not.have.class'
      cy.contains('.todo', item.title).should(classAssertion, 'completed')
    },
  )
})
