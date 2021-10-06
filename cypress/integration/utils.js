// @ts-check

import { gql } from '@apollo/client'
import { client } from '../../src/graphql-client'

export function deleteAll() {
  // fetches all todo items, grabs their IDs, and deletes them
  cy.log('**deleteAll**')
    .then(() =>
      client.query({
        // it is important to AVOID any caching here
        // and fetch the current server data
        fetchPolicy: 'no-cache',
        query: gql`
          query getAllTodos {
            allTodos {
              id
            }
          }
        `,
      }),
    )
    .its('data.allTodos')
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
