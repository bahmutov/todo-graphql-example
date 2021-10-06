// @ts-check

import { gql } from '@apollo/client'
import { client } from '../../src/graphql-client'

/**
 * Fetches all todos from the server
 */
export function getTodos() {
  // use a "dummy" cy.then(() => ...)
  // to make the command "wait" its turn
  // when executing in the Cypress command chain
  return cy
    .then(() => {
      return client.query({
        // it is important to AVOID any caching here
        // and fetch the current server data
        fetchPolicy: 'no-cache',
        query: gql`
          query getAllTodos {
            allTodos {
              title
              id
            }
          }
        `,
      })
    })
    .its('data.allTodos')
}

/**
 * Deletes all items from the server
 */
export function deleteAll() {
  // fetches all todo items, grabs their IDs, and deletes them
  cy.log('**deleteAll**')
  getTodos()
    // from each item, grab just the property "id"
    .then((items) => Cypress._.map(items, 'id'))
    .then((ids) => {
      /** @type string[] */
      // @ts-ignore
      const idList = ids
      if (!idList.length) {
        cy.log('Nothing to delete')
        return
      }
      cy.log(`Found **${idList.length}** todos`)

      // delete all items one by one
      idList.forEach((id) => {
        const mutation = gql`
            mutation deleteTodo {
              removeTodo(id: "${id}") {
                id
              }
            }
          `
        cy.log(`deleting item id:**${id}**`).then(() =>
          client.mutate({
            mutation,
          }),
        )
      })
    })
}

/**
 * @typedef {Object} Todo
 * @property {string} title
 * @property {boolean} completed ’
 */
/**
 * Creates items on the server one by one
 * @param {Todo[]} todos
 */
export function createItems(todos) {
  todos.forEach((item) => {
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
  })
}
