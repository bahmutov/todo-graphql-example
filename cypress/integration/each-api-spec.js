// @ts-check

// adds "describe.each" and "it.each" helpers
// https://github.com/bahmutov/cypress-each
import 'cypress-each'

import { data } from '../fixtures/three.json'
import { deleteAll } from './utils'

describe('Creates each item', () => {
  beforeEach(deleteAll)

  const titles = Cypress._.map(data.allTodos, 'title')
  const items = Cypress._.zip(titles, data.allTodos)

  // @ts-ignore
  it.each(items)('creates an item "%s"', (title, item) => {
    // create the item using a network call
    cy.request({
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
  })
})
