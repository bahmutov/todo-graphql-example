/// <reference types="cypress" />
import { gql } from '@apollo/client'
import { client } from '../../src/graphql-client'

describe('Delete items', () => {
  function deleteAll() {
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
        if (!ids.length) {
          cy.log('Nothing to delete')
          return
        }
        cy.log(`Found **${ids.length}** todos`)

        // delete all items one by one
        ids.forEach((id) => {
          cy.log(`deleting item id:**${id}**`)
          const mutation = gql`
            mutation deleteTodo {
              removeTodo(id: "${id}") {
                id
              }
            }
          `
          cy.wrap(
            client.mutate({
              mutation,
            }),
            { log: false },
          )
        })
      })
  }

  beforeEach(deleteAll)

  it('deletes all items by making GraphQL calls', () => {
    cy.intercept({
      method: 'POST',
      url: '/',
      headers: {
        'x-gql-operation-name': 'allTodos',
      },
    }).as('allTodos')

    cy.visit('/')
    cy.wait('@allTodos').its('response.body.data.allTodos').should('be.empty')
    cy.get('.todo').should('have.length', 0)

    cy.get('.new-todo')
      .type('first task{enter}')
      .type('second task{enter}')
      .type('third task{enter}')

    cy.get('.todo')
      .should('have.length', 3)
      // add extra wait, otherwise the test goes by too quickly
      // for the human eye!
      .wait(1000)

    cy.log('**items are there after reload**')
    cy.reload()
    cy.get('.todo').should('have.length', 3).wait(1000).then(deleteAll)

    // make sure the page is loaded by waiting a bit
    cy.reload().wait(1000)
    cy.get('.todo').should('have.length', 0)
  })
})
